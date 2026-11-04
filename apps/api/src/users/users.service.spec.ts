
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(),
  },
  hash: vi.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  const prisma = {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UsersService(prisma as unknown as PrismaService);
  });

  it('creates an AGENT with a hashed password and safe response fields', async () => {
    const dto = {
      name: 'Test Agent',
      email: ' AGENT@EXAMPLE.TEST ',
      password: 'StrongPassword123!',
    };

    const expected = {
      id: 'agent-1',
      name: 'Test Agent',
      email: 'agent@example.test',
      role: 'AGENT',
      createdAt: new Date(),
    };

    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);
    prisma.user.create.mockResolvedValue(expected);

    await expect(service.createAgent(dto)).resolves.toEqual(expected);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Test Agent',
          email: 'agent@example.test',
          passwordHash: 'hashed-password',
          role: 'AGENT',
        }),
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    );
  });

  it('converts duplicate email errors into a conflict response', async () => {
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);

    const { Prisma } = await import('../generated/prisma/client.js');
    prisma.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.createAgent({
        name: 'Test Agent',
        email: 'agent@example.test',
        password: 'StrongPassword123!',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('lists users without password hashes, newest first', async () => {
    const expected = [{ id: 'user-1', role: 'CUSTOMER' }];
    prisma.user.findMany.mockResolvedValue(expected);

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  });
});
