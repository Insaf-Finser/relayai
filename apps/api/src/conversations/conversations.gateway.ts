
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import type { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service.js";

type SocketUser = {
  userId: string;
  role: string;
};

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
  },
})
export class ConversationsGateway
  implements OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  // All active sockets belonging to each user.
  private readonly userSockets = new Map<string, Set<string>>();

  // Conversation rooms joined by each individual socket.
  private readonly socketConversationRooms = new Map<
    string,
    Set<string>
  >();

  // Sockets currently viewing each conversation, grouped by user.
  private readonly userConversationSockets = new Map<
    string,
    Map<string, Set<string>>
  >();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    server.use(async (client, next) => {
      try {
        const token = client.handshake.auth?.token;

        if (typeof token !== "string" || !token) {
          return next(new Error("Unauthorized"));
        }

        const payload = await this.jwtService.verifyAsync<{
          sub: string;
        }>(token);

        if (!payload.sub) {
          return next(new Error("Unauthorized"));
        }

        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: { id: true, role: true },
        });

        if (!user) {
          return next(new Error("Unauthorized"));
        }

        client.data.user = {
          userId: user.id,
          role: user.role,
        } satisfies SocketUser;

        await client.join(`user:${user.id}`);

        next();
      } catch {
        next(new Error("Unauthorized"));
      }
    });
  }

  handleConnection(client: Socket) {
    const user = client.data.user as SocketUser | undefined;

    if (!user) {
      client.disconnect(true);
      return;
    }

    let sockets = this.userSockets.get(user.userId);

    if (!sockets) {
      sockets = new Set<string>();
      this.userSockets.set(user.userId, sockets);
    }

    sockets.add(client.id);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as SocketUser | undefined;

    if (!user) return;

    // Remove this socket from every conversation it was viewing.
    const conversationIds = [
      ...(this.socketConversationRooms.get(client.id) ?? []),
    ];

    for (const conversationId of conversationIds) {
      this.removeSocketFromConversation(
        user.userId,
        client.id,
        conversationId,
      );
    }

    this.socketConversationRooms.delete(client.id);

    const sockets = this.userSockets.get(user.userId);

    if (!sockets) return;

    sockets.delete(client.id);

    if (sockets.size === 0) {
      this.userSockets.delete(user.userId);
    }
  }

  @SubscribeMessage("conversation:join")
  async handleJoinConversation(
    @MessageBody() payload: { conversationId?: unknown },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as SocketUser | undefined;

    if (!user) {
      client.emit("conversation:error", {
        message: "Unauthorized",
      });
      return;
    }

    const conversationId =
      typeof payload?.conversationId === "string"
        ? payload.conversationId.trim()
        : "";

    if (!conversationId) {
      client.emit("conversation:error", {
        message: "conversationId is required",
      });
      return;
    }

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        customerId: true,
        assignedAgentId: true,
      },
    });

    if (!conversation) {
      client.emit("conversation:error", {
        message: "Conversation not found",
      });
      return;
    }

    const allowed =
      user.role === "ADMIN" ||
      conversation.customerId === user.userId ||
      conversation.assignedAgentId === user.userId;

    if (!allowed) {
      client.emit("conversation:error", {
        message: "You cannot access this conversation",
      });
      return;
    }

    const room = `conversation:${conversationId}`;

    let socketRooms = this.socketConversationRooms.get(client.id);

    if (!socketRooms) {
      socketRooms = new Set<string>();
      this.socketConversationRooms.set(client.id, socketRooms);
    }

    const alreadyJoined = socketRooms.has(conversationId);

    if (!alreadyJoined) {
      await client.join(room);

      socketRooms.add(conversationId);

      let userRooms = this.userConversationSockets.get(user.userId);

      if (!userRooms) {
        userRooms = new Map<string, Set<string>>();
        this.userConversationSockets.set(user.userId, userRooms);
      }

      let conversationSockets = userRooms.get(conversationId);

      if (!conversationSockets) {
        conversationSockets = new Set<string>();
        userRooms.set(conversationId, conversationSockets);
      }

      const wasAlreadyViewing = conversationSockets.size > 0;

      conversationSockets.add(client.id);

      // Notify other participants only when this is the user's
      // first socket viewing this conversation.
      if (!wasAlreadyViewing) {
        this.server.to(room).except(client.id).emit("user:presence", {
          userId: user.userId,
          online: true,
        });
      }
    }

    // Send the current viewing state of the participants to this socket.
    const participantIds = [
      conversation.customerId,
      conversation.assignedAgentId,
    ];

    for (const participantId of new Set(participantIds)) {
      if (!participantId) continue;

      client.emit("user:presence", {
        userId: participantId,
        online:
          (this.userConversationSockets
            .get(participantId)
            ?.get(conversationId)?.size ?? 0) > 0,
      });
    }

    client.emit("conversation:joined", { conversationId });
  }

  @SubscribeMessage("conversation:leave")
  async handleLeaveConversation(
    @MessageBody() payload: { conversationId?: unknown },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user as SocketUser | undefined;

    if (!user) {
      client.emit("conversation:error", {
        message: "Unauthorized",
      });
      return;
    }

    const conversationId =
      typeof payload?.conversationId === "string"
        ? payload.conversationId.trim()
        : "";

    if (!conversationId) {
      client.emit("conversation:error", {
        message: "conversationId is required",
      });
      return;
    }

    const socketRooms = this.socketConversationRooms.get(client.id);

    // A socket can only leave a room it previously joined.
    if (!socketRooms?.has(conversationId)) {
      client.emit("conversation:left", { conversationId });
      return;
    }

    await client.leave(`conversation:${conversationId}`);

    this.removeSocketFromConversation(
      user.userId,
      client.id,
      conversationId,
    );

    client.emit("conversation:left", { conversationId });
  }

  private removeSocketFromConversation(
    userId: string,
    socketId: string,
    conversationId: string,
  ) {
    const socketRooms = this.socketConversationRooms.get(socketId);

    socketRooms?.delete(conversationId);

    if (socketRooms?.size === 0) {
      this.socketConversationRooms.delete(socketId);
    }

    const userRooms = this.userConversationSockets.get(userId);
    const conversationSockets = userRooms?.get(conversationId);

    if (!conversationSockets) return;

    conversationSockets.delete(socketId);

    // Another tab/device is still viewing this conversation.
    if (conversationSockets.size > 0) return;

    userRooms!.delete(conversationId);

    if (userRooms!.size === 0) {
      this.userConversationSockets.delete(userId);
    }

    // This was the user's final socket in this conversation.
    this.server
      .to(`conversation:${conversationId}`)
      .emit("user:presence", {
        userId,
        online: false,
      });
  }

  emitNewMessage(
    conversationId: string,
    message: unknown,
    recipientIds: string[],
  ) {
    this.server
      .to(`conversation:${conversationId}`)
      .emit("message:new", message);

    for (const userId of new Set(recipientIds)) {
      this.server
        .to(`user:${userId}`)
        .except(`conversation:${conversationId}`)
        .emit("message:new", message);
    }
  }
}
