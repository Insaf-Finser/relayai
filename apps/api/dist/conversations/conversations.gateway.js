var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service.js";
let ConversationsGateway = class ConversationsGateway {
    prisma;
    jwtService;
    server;
    userSockets = new Map();
    socketConversationRooms = new Map();
    userConversationSockets = new Map();
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    afterInit(server) {
        server.use(async (client, next) => {
            try {
                const token = client.handshake.auth?.token;
                if (typeof token !== "string" || !token) {
                    return next(new Error("Unauthorized"));
                }
                const payload = await this.jwtService.verifyAsync(token);
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
                };
                await client.join(`user:${user.id}`);
                next();
            }
            catch {
                next(new Error("Unauthorized"));
            }
        });
    }
    handleConnection(client) {
        const user = client.data.user;
        if (!user) {
            client.disconnect(true);
            return;
        }
        let sockets = this.userSockets.get(user.userId);
        if (!sockets) {
            sockets = new Set();
            this.userSockets.set(user.userId, sockets);
        }
        sockets.add(client.id);
    }
    handleDisconnect(client) {
        const user = client.data.user;
        if (!user)
            return;
        const conversationIds = [
            ...(this.socketConversationRooms.get(client.id) ?? []),
        ];
        for (const conversationId of conversationIds) {
            this.removeSocketFromConversation(user.userId, client.id, conversationId);
        }
        this.socketConversationRooms.delete(client.id);
        const sockets = this.userSockets.get(user.userId);
        if (!sockets)
            return;
        sockets.delete(client.id);
        if (sockets.size === 0) {
            this.userSockets.delete(user.userId);
        }
    }
    async handleJoinConversation(payload, client) {
        const user = client.data.user;
        if (!user) {
            client.emit("conversation:error", {
                message: "Unauthorized",
            });
            return;
        }
        const conversationId = typeof payload?.conversationId === "string"
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
        const allowed = user.role === "ADMIN" ||
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
            socketRooms = new Set();
            this.socketConversationRooms.set(client.id, socketRooms);
        }
        const alreadyJoined = socketRooms.has(conversationId);
        if (!alreadyJoined) {
            await client.join(room);
            socketRooms.add(conversationId);
            let userRooms = this.userConversationSockets.get(user.userId);
            if (!userRooms) {
                userRooms = new Map();
                this.userConversationSockets.set(user.userId, userRooms);
            }
            let conversationSockets = userRooms.get(conversationId);
            if (!conversationSockets) {
                conversationSockets = new Set();
                userRooms.set(conversationId, conversationSockets);
            }
            const wasAlreadyViewing = conversationSockets.size > 0;
            conversationSockets.add(client.id);
            if (!wasAlreadyViewing) {
                this.server.to(room).except(client.id).emit("user:presence", {
                    userId: user.userId,
                    online: true,
                });
            }
        }
        const participantIds = [
            conversation.customerId,
            conversation.assignedAgentId,
        ];
        for (const participantId of new Set(participantIds)) {
            if (!participantId)
                continue;
            client.emit("user:presence", {
                userId: participantId,
                online: (this.userConversationSockets
                    .get(participantId)
                    ?.get(conversationId)?.size ?? 0) > 0,
            });
        }
        client.emit("conversation:joined", { conversationId });
    }
    async handleLeaveConversation(payload, client) {
        const user = client.data.user;
        if (!user) {
            client.emit("conversation:error", {
                message: "Unauthorized",
            });
            return;
        }
        const conversationId = typeof payload?.conversationId === "string"
            ? payload.conversationId.trim()
            : "";
        if (!conversationId) {
            client.emit("conversation:error", {
                message: "conversationId is required",
            });
            return;
        }
        const socketRooms = this.socketConversationRooms.get(client.id);
        if (!socketRooms?.has(conversationId)) {
            client.emit("conversation:left", { conversationId });
            return;
        }
        await client.leave(`conversation:${conversationId}`);
        this.removeSocketFromConversation(user.userId, client.id, conversationId);
        client.emit("conversation:left", { conversationId });
    }
    removeSocketFromConversation(userId, socketId, conversationId) {
        const socketRooms = this.socketConversationRooms.get(socketId);
        socketRooms?.delete(conversationId);
        if (socketRooms?.size === 0) {
            this.socketConversationRooms.delete(socketId);
        }
        const userRooms = this.userConversationSockets.get(userId);
        const conversationSockets = userRooms?.get(conversationId);
        if (!conversationSockets)
            return;
        conversationSockets.delete(socketId);
        if (conversationSockets.size > 0)
            return;
        userRooms.delete(conversationId);
        if (userRooms.size === 0) {
            this.userConversationSockets.delete(userId);
        }
        this.server
            .to(`conversation:${conversationId}`)
            .emit("user:presence", {
            userId,
            online: false,
        });
    }
    emitNewMessage(conversationId, message, recipientIds) {
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
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Function)
], ConversationsGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage("conversation:join"),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], ConversationsGateway.prototype, "handleJoinConversation", null);
__decorate([
    SubscribeMessage("conversation:leave"),
    __param(0, MessageBody()),
    __param(1, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], ConversationsGateway.prototype, "handleLeaveConversation", null);
ConversationsGateway = __decorate([
    WebSocketGateway({
        cors: {
            origin: "http://localhost:3000",
        },
    }),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], ConversationsGateway);
export { ConversationsGateway };
//# sourceMappingURL=conversations.gateway.js.map