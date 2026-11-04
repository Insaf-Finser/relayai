
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { PrismaModule } from '../src/prisma/prisma.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { ConversationsService } from '../src/conversations/conversations.service.js';
import { ConversationsGateway } from '../src/conversations/conversations.gateway.js';

describe('Conversation claims (PostgreSQL integration)', () => {
  let moduleRef: TestingModule;
  let prisma: PrismaService;
  let service: ConversationsService;

  const createdUserIds: string[] = [];
  const createdConversationIds: string[] = [];
  const prefix = `integration-${randomUUID()}`;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL?.includes('/relayai_test?')) {
      throw new Error(
        'Refusing to run integration tests unless DATABASE_URL targets relayai_test.',
      );
    }

    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
      providers: [
        ConversationsService,
        {
          provide: ConversationsGateway,
          useValue: { emitNewMessage: vi.fn() },
        },
      ],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    service = moduleRef.get(ConversationsService);

    await prisma.$connect();
  });

  afterAll(async () => {
    // Clean up only records created by this test run.
    if (prisma) {
      if (createdConversationIds.length > 0) {
        await prisma.conversation.deleteMany({
          where: { id: { in: createdConversationIds } },
        });
      }

      if (createdUserIds.length > 0) {
        await prisma.user.deleteMany({
          where: { id: { in: createdUserIds } },
        });
      }

      await prisma.$disconnect();
    }

    await moduleRef?.close();
  });

  async function createUser(
    role: 'CUSTOMER' | 'AGENT' | 'ADMIN',
  ) {
    const user = await prisma.user.create({
      data: {
        name: `${role} integration test`,
        email: `${prefix}-${role.toLowerCase()}-${randomUUID()}@example.test`,
        role,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    createdUserIds.push(user.id);
    return user;
  }

  async function createConversation(
    customerId: string,
    options: {
      assignedAgentId?: string | null;
      status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    } = {},
  ) {
    const conversation = await prisma.conversation.create({
      data: {
        subject: `${prefix} ${randomUUID()}`,
        customerId,
        assignedAgentId: options.assignedAgentId ?? null,
        status: options.status ?? 'OPEN',
      },
    });

    createdConversationIds.push(conversation.id);
    return conversation;
  }

  it('allows only one of two agents to claim the same conversation', async () => {
    const customer = await createUser('CUSTOMER');
    const agentA = await createUser('AGENT');
    const agentB = await createUser('AGENT');
    const conversation = await createConversation(customer.id);

    const results = await Promise.allSettled([
      service.claimConversation(conversation.id, agentA.id, 'AGENT'),
      service.claimConversation(conversation.id, agentB.id, 'AGENT'),
    ]);

    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((r) => r.status === 'rejected')).toHaveLength(1);

    const rejected = results.find(
      (r) => r.status === 'rejected',
    );

    expect(rejected?.status).toBe('rejected');

    if (rejected?.status === 'rejected') {
      expect(rejected.reason).toBeInstanceOf(ConflictException);
    }

    const saved = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversation.id },
    });

    expect([agentA.id, agentB.id]).toContain(saved.assignedAgentId);
    expect(saved.status).toBe('IN_PROGRESS');
  });

  it('enforces the three-active-conversation limit under concurrent claims', async () => {
    const customer = await createUser('CUSTOMER');
    const agent = await createUser('AGENT');

    await createConversation(customer.id, {
      assignedAgentId: agent.id,
      status: 'IN_PROGRESS',
    });

    await createConversation(customer.id, {
      assignedAgentId: agent.id,
      status: 'OPEN',
    });

    const targetA = await createConversation(customer.id);
    const targetB = await createConversation(customer.id);

    const results = await Promise.allSettled([
      service.claimConversation(targetA.id, agent.id, 'AGENT'),
      service.claimConversation(targetB.id, agent.id, 'AGENT'),
    ]);

    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((r) => r.status === 'rejected')).toHaveLength(1);

    const rejected = results.find(
      (r) => r.status === 'rejected',
    );

    if (rejected?.status === 'rejected') {
      expect(rejected.reason).toBeInstanceOf(ConflictException);
    }

    const activeCount = await prisma.conversation.count({
      where: {
        assignedAgentId: agent.id,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
    });

    expect(activeCount).toBe(3);

    const targetRecords = await prisma.conversation.findMany({
      where: { id: { in: [targetA.id, targetB.id] } },
    });

    expect(
      targetRecords.filter((c) => c.assignedAgentId === agent.id),
    ).toHaveLength(1);

    expect(
      targetRecords.filter(
        (c) => c.assignedAgentId === null && c.status === 'OPEN',
      ),
    ).toHaveLength(1);
  });

  it('leaves a conversation unchanged when an agent is already at capacity', async () => {
    const customer = await createUser('CUSTOMER');
    const agent = await createUser('AGENT');

    for (let i = 0; i < 3; i++) {
      await createConversation(customer.id, {
        assignedAgentId: agent.id,
        status: i === 0 ? 'OPEN' : 'IN_PROGRESS',
      });
    }

    const target = await createConversation(customer.id);

    await expect(
      service.claimConversation(target.id, agent.id, 'AGENT'),
    ).rejects.toBeInstanceOf(ConflictException);

    const saved = await prisma.conversation.findUniqueOrThrow({
      where: { id: target.id },
    });

    expect(saved.assignedAgentId).toBeNull();
    expect(saved.status).toBe('OPEN');
  });

  it('rejects customer claims without changing the conversation', async () => {
    const customer = await createUser('CUSTOMER');
    const target = await createConversation(customer.id);

    await expect(
      service.claimConversation(target.id, customer.id, 'CUSTOMER'),
    ).rejects.toBeInstanceOf(ForbiddenException);

    const saved = await prisma.conversation.findUniqueOrThrow({
      where: { id: target.id },
    });

    expect(saved.assignedAgentId).toBeNull();
    expect(saved.status).toBe('OPEN');
  });
});
