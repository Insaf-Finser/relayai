
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import type { Server, Socket } from "socket.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConversationsGateway } from "./conversations.gateway.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("ConversationsGateway", () => {
  let gateway: ConversationsGateway;

  const prisma = {
    user: {
      findUnique: vi.fn(),
    },
    conversation: {
      findUnique: vi.fn(),
    },
  };

  const jwtService = {
    verifyAsync: vi.fn(),
  };

  const roomEmit = vi.fn();

const roomExcept = vi.fn(() => ({
  emit: roomEmit,
}));

const roomBroadcast = vi.fn(() => ({
  except: roomExcept,
  emit: roomEmit,
}));

const server = {
  use: vi.fn(),
  to: vi.fn(() => roomBroadcast()),
} as unknown as Server;

  
beforeEach(async () => {
  vi.clearAllMocks();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ConversationsGateway,
      { provide: PrismaService, useValue: prisma },
      { provide: JwtService, useValue: jwtService },
    ],
  }).compile();

  gateway = module.get<ConversationsGateway>(ConversationsGateway);

  gateway.server = server;

  const state = gateway as unknown as {
    userSockets: Map<string, Set<string>>;
    socketConversationRooms: Map<string, Set<string>>;
    userConversationSockets: Map<
      string,
      Map<string, Set<string>>
    >;
  };

  state.userSockets.clear();
  state.socketConversationRooms.clear();
  state.userConversationSockets.clear();
});


  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  
describe("presence tracking", () => {
  function makeTrackedSocket(
    userId: string,
    socketId: string,
    role = "CUSTOMER",
  ) {
    const state = gateway as unknown as {
      userSockets: Map<string, Set<string>>;
    };

    let sockets = state.userSockets.get(userId);

    if (!sockets) {
      sockets = new Set<string>();
      state.userSockets.set(userId, sockets);
    }

    sockets.add(socketId);

    return {
      id: socketId,
      data: { user: { userId, role } },
      emit: vi.fn(),
      join: vi.fn().mockResolvedValue(undefined),
      leave: vi.fn().mockResolvedValue(undefined),
    } as unknown as Socket & {
      emit: ReturnType<typeof vi.fn>;
      leave: ReturnType<typeof vi.fn>;
    };
  }

  function getState() {
    return gateway as unknown as {
      userSockets: Map<string, Set<string>>;
      socketConversationRooms: Map<string, Set<string>>;
      userConversationSockets: Map<
        string,
        Map<string, Set<string>>
      >;
    };
  }

  async function joinConversation(
    client: Socket,
    conversationId = "conversation-1",
    customerId = "customer-1",
  ) {
    prisma.conversation.findUnique.mockResolvedValue({
      id: conversationId,
      customerId,
      assignedAgentId: null,
    });

    await gateway.handleJoinConversation(
      { conversationId },
      client,
    );
  }

  it("tracks a conversation separately for each socket", async () => {
    const client = makeTrackedSocket(
      "customer-1",
      "socket-1",
    );

    await joinConversation(client);

    const state = getState();

    expect(
      state.socketConversationRooms.get("socket-1"),
    ).toContain("conversation-1");

    expect(
      state.userConversationSockets
        .get("customer-1")
        ?.get("conversation-1"),
    ).toContain("socket-1");
  });

  it("leaves a conversation and marks the user offline", async () => {
    const client = makeTrackedSocket(
      "customer-1",
      "socket-1",
    );

    await joinConversation(client);

    await gateway.handleLeaveConversation(
      { conversationId: "conversation-1" },
      client,
    );

    const state = getState();

    expect(client.leave).toHaveBeenCalledWith(
      "conversation:conversation-1",
    );

    expect(
      state.socketConversationRooms.has("socket-1"),
    ).toBe(false);

    expect(
      state.userConversationSockets.has("customer-1"),
    ).toBe(false);

    expect(roomEmit).toHaveBeenCalledWith("user:presence", {
      userId: "customer-1",
      online: false,
    });
  });

  it("does not mark a user offline while another socket views the conversation", async () => {
    const first = makeTrackedSocket(
      "customer-1",
      "socket-1",
    );

    const second = makeTrackedSocket(
      "customer-1",
      "socket-2",
    );

    await joinConversation(first);
    await joinConversation(second);

    roomEmit.mockClear();

    await gateway.handleLeaveConversation(
      { conversationId: "conversation-1" },
      first,
    );

    const state = getState();

    expect(
      state.userConversationSockets
        .get("customer-1")
        ?.get("conversation-1"),
    ).toEqual(new Set(["socket-2"]));

    expect(roomEmit).not.toHaveBeenCalledWith(
      "user:presence",
      expect.objectContaining({ online: false }),
    );
  });

  it("marks the user offline when the final viewing socket leaves", async () => {
    const first = makeTrackedSocket(
      "customer-1",
      "socket-1",
    );

    const second = makeTrackedSocket(
      "customer-1",
      "socket-2",
    );

    await joinConversation(first);
    await joinConversation(second);

    await gateway.handleLeaveConversation(
      { conversationId: "conversation-1" },
      first,
    );

    roomEmit.mockClear();

    await gateway.handleLeaveConversation(
      { conversationId: "conversation-1" },
      second,
    );

    expect(roomEmit).toHaveBeenCalledWith("user:presence", {
      userId: "customer-1",
      online: false,
    });
  });

  it("cleans up all conversation rooms when a socket disconnects", async () => {
    const client = makeTrackedSocket(
      "customer-1",
      "socket-1",
    );

    await joinConversation(
      client,
      "conversation-1",
    );

    await joinConversation(
      client,
      "conversation-2",
    );

    roomEmit.mockClear();

    gateway.handleDisconnect(client);

    const state = getState();

    expect(
      state.socketConversationRooms.has("socket-1"),
    ).toBe(false);

    expect(
      state.userConversationSockets.has("customer-1"),
    ).toBe(false);

    expect(roomEmit).toHaveBeenCalledTimes(2);
  });

  
it("keeps the user online when another socket remains connected", async () => {
  const first = makeTrackedSocket(
    "customer-1",
    "socket-1",
  );

  const second = makeTrackedSocket(
    "customer-1",
    "socket-2",
  );

  await joinConversation(first);
  await joinConversation(second);

  roomEmit.mockClear();

  gateway.handleDisconnect(first);

  const state = getState();

  // The second socket remains globally connected.
  expect(state.userSockets.get("customer-1")).toEqual(
    new Set(["socket-2"]),
  );

  // The second socket still views the conversation.
  expect(
    state.userConversationSockets
      .get("customer-1")
      ?.get("conversation-1"),
  ).toEqual(new Set(["socket-2"]));

  // No offline event should be broadcast.
  expect(roomEmit).not.toHaveBeenCalledWith(
    "user:presence",
    {
      userId: "customer-1",
      online: false,
    },
  );

  expect(state.userSockets.has("customer-1")).toBe(true);
});


  it("does not allow a socket to leave a conversation it never joined", async () => {
    const client = makeTrackedSocket(
      "customer-1",
      "socket-1",
    );

    await gateway.handleLeaveConversation(
      { conversationId: "conversation-1" },
      client,
    );

    expect(client.leave).not.toHaveBeenCalled();
    expect(roomEmit).not.toHaveBeenCalled();
  });
});


  describe("connection authentication", () => {
    async function runMiddleware(token?: string) {
      const use = vi.fn();
      const server = { use } as unknown as Server;

      gateway.afterInit(server);

      const middleware = use.mock.calls[0]?.[0] as
        | ((client: Socket, next: (error?: Error) => void) => void)
        | undefined;

      if (!middleware) {
        throw new Error("Socket.IO middleware was not registered");
      }

      const rooms = new Set<string>();

      const client = {
        handshake: { auth: token ? { token } : {} },
        data: {},
        rooms,
        join: vi.fn().mockImplementation(async (room: string) => {
          rooms.add(room);
        }),
      } as unknown as Socket;

      const next = vi.fn<(error?: Error) => void>();

      await middleware(client, next);

      return { client, next };
    }

    it("rejects a missing token", async () => {
      const { next } = await runMiddleware();

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it("rejects an invalid token", async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error("Invalid JWT"));

      const { next } = await runMiddleware("invalid-token");

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("rejects a token whose user no longer exists", async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: "deleted-user" });
      prisma.user.findUnique.mockResolvedValue(null);

      const { next } = await runMiddleware("valid-signature-token");

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("loads the current database role and accepts a valid user", async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: "agent-1" });
      prisma.user.findUnique.mockResolvedValue({
        id: "agent-1",
        role: "AGENT",
      });

      const { client, next } = await runMiddleware("valid-token");

      expect(next).toHaveBeenCalledWith();
      expect(client.data.user).toEqual({
        userId: "agent-1",
        role: "AGENT",
      });
      expect(client.join).toHaveBeenCalledWith("user:agent-1");
      expect(client.rooms).toContain("user:agent-1");
    });
  });

  describe("conversation room authorization", () => {
    function makeSocket(user: { userId: string; role: string }) {
      const rooms = new Set<string>();

      return {
        id: `socket-${user.userId}`,
        rooms,
        data: { user },
        emit: vi.fn(),
        join: vi.fn().mockImplementation(async (room: string) => {
          rooms.add(room);
        }),
        disconnect: vi.fn(),
      } as unknown as Socket & {
        emit: ReturnType<typeof vi.fn>;
        join: ReturnType<typeof vi.fn>;
        rooms: Set<string>;
      };
    }

    it("allows a customer to join their own conversation", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: "conversation-1",
        customerId: "customer-1",
        assignedAgentId: null,
      });

      const client = makeSocket({
        userId: "customer-1",
        role: "CUSTOMER",
      });

      await gateway.handleJoinConversation(
        { conversationId: "conversation-1" },
        client,
      );

      expect(client.join).toHaveBeenCalledWith(
        "conversation:conversation-1",
      );
      expect(client.emit).toHaveBeenCalledWith(
        "conversation:joined",
        { conversationId: "conversation-1" },
      );
    });

    it("rejects a customer trying to join another customer's room", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: "conversation-1",
        customerId: "customer-1",
        assignedAgentId: null,
      });

      const client = makeSocket({
        userId: "customer-2",
        role: "CUSTOMER",
      });

      await gateway.handleJoinConversation(
        { conversationId: "conversation-1" },
        client,
      );

      expect(client.join).not.toHaveBeenCalled();
      expect(client.emit).toHaveBeenCalledWith(
        "conversation:error",
        expect.objectContaining({
          message: "You cannot access this conversation",
        }),
      );
    });

    it("allows the assigned agent to join", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: "conversation-1",
        customerId: "customer-1",
        assignedAgentId: "agent-1",
      });

      const client = makeSocket({
        userId: "agent-1",
        role: "AGENT",
      });

      await gateway.handleJoinConversation(
        { conversationId: "conversation-1" },
        client,
      );

      expect(client.join).toHaveBeenCalledWith(
        "conversation:conversation-1",
      );
    });

    it("rejects an unassigned agent", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: "conversation-1",
        customerId: "customer-1",
        assignedAgentId: null,
      });

      const client = makeSocket({
        userId: "agent-1",
        role: "AGENT",
      });

      await gateway.handleJoinConversation(
        { conversationId: "conversation-1" },
        client,
      );

      expect(client.join).not.toHaveBeenCalled();
    });

    it("rejects a nonexistent conversation", async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);

      const client = makeSocket({
        userId: "customer-1",
        role: "CUSTOMER",
      });

      await gateway.handleJoinConversation(
        { conversationId: "missing" },
        client,
      );

      expect(client.join).not.toHaveBeenCalled();
      expect(client.emit).toHaveBeenCalledWith(
        "conversation:error",
        { message: "Conversation not found" },
      );
    });
  });
});
