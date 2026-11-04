
import { Test, TestingModule } from "@nestjs/testing";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { ConversationsService } from "./conversations.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { ConversationsGateway } from "./conversations.gateway.js";

describe("ConversationsService", () => {
  let service: ConversationsService;
  let prisma: {
    conversation: {
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      findUniqueOrThrow: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      updateMany: ReturnType<typeof vi.fn>;
      count: ReturnType<typeof vi.fn>;
    };
    message: {
      create: ReturnType<typeof vi.fn>;
    };
    $transaction: ReturnType<typeof vi.fn>;
  };
  let tx: {
    $queryRaw: ReturnType<typeof vi.fn>;
    conversation: {
      count: ReturnType<typeof vi.fn>;
      updateMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      findUniqueOrThrow: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    tx = {
      $queryRaw: vi.fn(),
      conversation: {
        count: vi.fn(),
        updateMany: vi.fn(),
        findUnique: vi.fn(),
        findUniqueOrThrow: vi.fn(),
      },
    };

    prisma = {
      conversation: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findUniqueOrThrow: vi.fn(),
        create: vi.fn(),
        updateMany: vi.fn(),
        count: vi.fn(),
      },
      message: {
        create: vi.fn(),
      },
      $transaction: vi.fn(
        async (callback: (transaction: typeof tx) => unknown) =>
          callback(tx),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConversationsGateway,
          useValue: { emitNewMessage: vi.fn() },
        },
      ],
    }).compile();

    service = module.get(ConversationsService);
  });

  it("rejects customers from the unassigned queue", async () => {
    await expect(
      service.findUnassigned("customer-1", "CUSTOMER"),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.conversation.findMany).not.toHaveBeenCalled();
  });

  it("returns only open, unassigned conversations to agents", async () => {
    prisma.conversation.findMany.mockResolvedValue([]);

    await service.findUnassigned("agent-1", "AGENT");

    expect(prisma.conversation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          assignedAgentId: null,
          status: "OPEN",
        },
      }),
    );
  });

  it("rejects customers attempting to claim conversations", async () => {
    await expect(
      service.claimConversation(
        "conversation-1",
        "customer-1",
        "CUSTOMER",
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("rejects a claim when the agent already has three active conversations", async () => {
    tx.$queryRaw.mockResolvedValue([{ id: "agent-1" }]);
    tx.conversation.count.mockResolvedValue(3);

    await expect(
      service.claimConversation(
        "conversation-4",
        "agent-1",
        "AGENT",
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(tx.conversation.updateMany).not.toHaveBeenCalled();
  });

  it("claims a conversation when the agent has capacity", async () => {
    tx.$queryRaw.mockResolvedValue([{ id: "agent-1" }]);
    tx.conversation.count.mockResolvedValue(2);
    tx.conversation.updateMany.mockResolvedValue({ count: 1 });

    const claimedConversation = {
      id: "conversation-3",
      assignedAgentId: "agent-1",
      status: "IN_PROGRESS",
    };

    tx.conversation.findUniqueOrThrow.mockResolvedValue(
      claimedConversation,
    );

    await expect(
      service.claimConversation(
        "conversation-3",
        "agent-1",
        "AGENT",
      ),
    ).resolves.toEqual(claimedConversation);

    expect(tx.conversation.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "conversation-3",
          assignedAgentId: null,
          status: "OPEN",
        },
        data: {
          assignedAgentId: "agent-1",
          status: "IN_PROGRESS",
        },
      }),
    );
  });

  it("rejects a claim when another agent already claimed the conversation", async () => {
    tx.$queryRaw.mockResolvedValue([{ id: "agent-1" }]);
    tx.conversation.count.mockResolvedValue(1);
    tx.conversation.updateMany.mockResolvedValue({ count: 0 });
    tx.conversation.findUnique.mockResolvedValue({
      id: "conversation-1",
    });

    await expect(
      service.claimConversation(
        "conversation-1",
        "agent-1",
        "AGENT",
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  describe("updateStatus", () => {
    const conversation = {
      id: "conversation-1",
      status: "IN_PROGRESS",
      assignedAgentId: "agent-1",
    };

    it("allows an administrator to reopen a resolved conversation and clears the reopening request", async () => {
      const resolvedConversation = {
        ...conversation,
        status: "RESOLVED",
        reopenRequestedAt: new Date(),
        reopenRequestMessage: "My issue is still unresolved.",
      };

      const reopened = {
        ...resolvedConversation,
        status: "OPEN",
        reopenRequestedAt: null,
        reopenRequestMessage: null,
      };

      prisma.conversation.findUnique
        .mockResolvedValueOnce(resolvedConversation)
        .mockResolvedValueOnce(reopened);

      prisma.conversation.updateMany.mockResolvedValue({ count: 1 });

      await expect(
        service.updateStatus(
          "conversation-1",
          "admin-1",
          "ADMIN",
          "OPEN",
        ),
      ).resolves.toEqual(reopened);

      expect(prisma.conversation.updateMany).toHaveBeenCalledWith({
        where: {
          id: "conversation-1",
          status: "RESOLVED",
        },
        data: {
          status: "OPEN",
          reopenRequestedAt: null,
          reopenRequestMessage: null,
        },
      });
    });

    it("does not clear reopening fields when resolving a conversation", async () => {
      const conversationWithRequest = {
        ...conversation,
        reopenRequestedAt: new Date(),
        reopenRequestMessage: "Previous reopening request",
      };

      prisma.conversation.findUnique.mockResolvedValue(
        conversationWithRequest,
      );

      prisma.conversation.updateMany.mockResolvedValue({ count: 1 });

      await service.updateStatus(
        "conversation-1",
        "agent-1",
        "AGENT",
        "RESOLVED",
      );

      expect(prisma.conversation.updateMany).toHaveBeenCalledWith({
        where: {
          id: "conversation-1",
          status: "IN_PROGRESS",
          assignedAgentId: "agent-1",
        },
        data: {
          status: "RESOLVED",
        },
      });
    });

    it("allows an administrator to reopen a resolved conversation", async () => {
      const resolvedConversation = {
        ...conversation,
        status: "RESOLVED",
      };

      const reopened = {
        ...resolvedConversation,
        status: "OPEN",
      };

      prisma.conversation.findUnique
        .mockResolvedValueOnce(resolvedConversation)
        .mockResolvedValueOnce(reopened);

      prisma.conversation.updateMany.mockResolvedValue({ count: 1 });

      await expect(
        service.updateStatus(
          "conversation-1",
          "admin-1",
          "ADMIN",
          "OPEN",
        ),
      ).resolves.toEqual(reopened);

      expect(prisma.conversation.updateMany).toHaveBeenCalledWith({
        where: {
          id: "conversation-1",
          status: "RESOLVED",
        },
        data: {
          status: "OPEN",
          reopenRequestedAt: null,
          reopenRequestMessage: null,
        },
      });
    });

    it("prevents customers from changing conversation status", async () => {
      prisma.conversation.findUnique.mockResolvedValue(conversation);

      await expect(
        service.updateStatus(
          "conversation-1",
          "customer-1",
          "CUSTOMER",
          "RESOLVED",
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.conversation.updateMany).not.toHaveBeenCalled();
    });

    it("prevents unassigned agents from changing conversation status", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        ...conversation,
        assignedAgentId: null,
      });

      await expect(
        service.updateStatus(
          "conversation-1",
          "agent-2",
          "AGENT",
          "RESOLVED",
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.conversation.updateMany).not.toHaveBeenCalled();
    });

    it("rejects invalid status transitions", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        ...conversation,
        status: "OPEN",
      });

      await expect(
        service.updateStatus(
          "conversation-1",
          "agent-1",
          "AGENT",
          "OPEN",
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.conversation.updateMany).not.toHaveBeenCalled();
    });

    it("rejects a status update when another request changes the status first", async () => {
      prisma.conversation.findUnique.mockResolvedValue(conversation);
      prisma.conversation.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.updateStatus(
          "conversation-1",
          "agent-1",
          "AGENT",
          "RESOLVED",
        ),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("returns not found for a nonexistent conversation", async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus(
          "missing-conversation",
          "admin-1",
          "ADMIN",
          "RESOLVED",
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.conversation.updateMany).not.toHaveBeenCalled();
    });

    it("rejects an unchanged status", async () => {
      prisma.conversation.findUnique.mockResolvedValue(conversation);

      await expect(
        service.updateStatus(
          "conversation-1",
          "agent-1",
          "AGENT",
          "IN_PROGRESS",
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.conversation.updateMany).not.toHaveBeenCalled();
    });
  });

    describe("assignConversation", () => {
    const openConversation = {
      id: "conversation-1",
      status: "OPEN",
      assignedAgentId: null,
    };

    it("allows an admin to assign an unassigned conversation", async () => {
      tx.$queryRaw.mockResolvedValue([{ id: "agent-1" }]);
      tx.conversation.findUnique.mockResolvedValue(openConversation);
      tx.conversation.count.mockResolvedValue(1);
      tx.conversation.updateMany.mockResolvedValue({ count: 1 });

      const assigned = {
        ...openConversation,
        status: "IN_PROGRESS",
        assignedAgentId: "agent-1",
      };

      tx.conversation.findUniqueOrThrow.mockResolvedValue(assigned);

      await expect(
        service.assignConversation(
          "conversation-1",
          "agent-1",
          "ADMIN",
        ),
      ).resolves.toEqual(assigned);

      expect(tx.conversation.updateMany).toHaveBeenCalledWith({
        where: {
          id: "conversation-1",
          assignedAgentId: null,
          status: "OPEN",
        },
        data: {
          assignedAgentId: "agent-1",
          status: "IN_PROGRESS",
        },
      });
    });

    it("rejects non-admin assignment attempts", async () => {
      await expect(
        service.assignConversation(
          "conversation-1",
          "agent-1",
          "AGENT",
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("rejects a user who is not an agent", async () => {
      tx.$queryRaw.mockResolvedValue([]);

      await expect(
        service.assignConversation(
          "conversation-1",
          "customer-1",
          "ADMIN",
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(tx.conversation.updateMany).not.toHaveBeenCalled();
    });

    it("rejects assignment when the target agent has three active conversations", async () => {
      tx.$queryRaw.mockResolvedValue([{ id: "agent-1" }]);
      tx.conversation.findUnique.mockResolvedValue(openConversation);
      tx.conversation.count.mockResolvedValue(3);

      await expect(
        service.assignConversation(
          "conversation-1",
          "agent-1",
          "ADMIN",
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(tx.conversation.updateMany).not.toHaveBeenCalled();
    });

    it("rejects assignment of resolved conversations", async () => {
      tx.$queryRaw.mockResolvedValue([{ id: "agent-1" }]);
      tx.conversation.findUnique.mockResolvedValue({
        ...openConversation,
        status: "RESOLVED",
      });

      await expect(
        service.assignConversation(
          "conversation-1",
          "agent-1",
          "ADMIN",
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(tx.conversation.updateMany).not.toHaveBeenCalled();
    });

    it("rejects assigning a conversation to its existing agent", async () => {
      tx.$queryRaw.mockResolvedValue([{ id: "agent-1" }]);
      tx.conversation.findUnique.mockResolvedValue({
        ...openConversation,
        status: "IN_PROGRESS",
        assignedAgentId: "agent-1",
      });

      await expect(
        service.assignConversation(
          "conversation-1",
          "agent-1",
          "ADMIN",
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(tx.conversation.updateMany).not.toHaveBeenCalled();
    });

    it("rejects assignment if the conversation changes concurrently", async () => {
      tx.$queryRaw.mockResolvedValue([{ id: "agent-1" }]);
      tx.conversation.findUnique.mockResolvedValue(openConversation);
      tx.conversation.count.mockResolvedValue(1);
      tx.conversation.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.assignConversation(
          "conversation-1",
          "agent-1",
          "ADMIN",
        ),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
  describe("requestReopen", () => {
  const resolvedConversation = {
    id: "conversation-1",
    customerId: "customer-1",
    status: "RESOLVED",
    reopenRequestedAt: null,
  };

  const dto = {
    message: "My issue is still unresolved. Please reopen it.",
  };

  it("allows a customer to request reopening", async () => {
    const updatedConversation = {
      ...resolvedConversation,
      reopenRequestedAt: new Date(),
      reopenRequestMessage: dto.message,
    };
    prisma.conversation.updateMany.mockResolvedValue({ count: 1 });
    prisma.conversation.findUnique
      .mockResolvedValueOnce(resolvedConversation)
      .mockResolvedValueOnce(updatedConversation);

    await expect(
      service.requestReopen(
        "conversation-1",
        "customer-1",
        "CUSTOMER",
        dto,
      ),
    ).resolves.toEqual(updatedConversation);

    expect(prisma.conversation.updateMany).toHaveBeenCalledWith({
      where: {
        id: "conversation-1",
        customerId: "customer-1",
        status: "RESOLVED",
        reopenRequestedAt: null,
      },
      data: {
        reopenRequestedAt: expect.any(Date),
        reopenRequestMessage: dto.message,
      },
    });
  });

  it("rejects agents and admins", async () => {
    await expect(
      service.requestReopen(
        "conversation-1",
        "agent-1",
        "AGENT",
        dto,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await expect(
      service.requestReopen(
        "conversation-1",
        "admin-1",
        "ADMIN",
        dto,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.conversation.findUnique).not.toHaveBeenCalled();
  });

  it("rejects requests for another customer's conversation", async () => {
    prisma.conversation.findUnique.mockResolvedValue({
      ...resolvedConversation,
      customerId: "customer-2",
    });

    await expect(
      service.requestReopen(
        "conversation-1",
        "customer-1",
        "CUSTOMER",
        dto,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(prisma.conversation.updateMany).not.toHaveBeenCalled();
  });

  it("returns not found for a missing conversation", async () => {
    prisma.conversation.findUnique.mockResolvedValue(null);

    await expect(
      service.requestReopen(
        "missing-conversation",
        "customer-1",
        "CUSTOMER",
        dto,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects requests for conversations that are not resolved", async () => {
    prisma.conversation.findUnique.mockResolvedValue({
      ...resolvedConversation,
      status: "OPEN",
    });

    await expect(
      service.requestReopen(
        "conversation-1",
        "customer-1",
        "CUSTOMER",
        dto,
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.conversation.updateMany).not.toHaveBeenCalled();
  });

  it("rejects duplicate reopening requests", async () => {
    prisma.conversation.findUnique.mockResolvedValue({
      ...resolvedConversation,
      reopenRequestedAt: new Date(),
    });

    await expect(
      service.requestReopen(
        "conversation-1",
        "customer-1",
        "CUSTOMER",
        dto,
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.conversation.updateMany).not.toHaveBeenCalled();
  });

  it("rejects a concurrent duplicate request", async () => {
    prisma.conversation.findUnique.mockResolvedValue(
      resolvedConversation,
    );
    prisma.conversation.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.requestReopen(
        "conversation-1",
        "customer-1",
        "CUSTOMER",
        dto,
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("rejects an empty reopening reason", async () => {
    await expect(
      service.requestReopen(
        "conversation-1",
        "customer-1",
        "CUSTOMER",
        { message: "   " },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.conversation.findUnique).not.toHaveBeenCalled();
  });
});
});
