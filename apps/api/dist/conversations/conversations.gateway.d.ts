import { OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import type { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service.js";
export declare class ConversationsGateway implements OnGatewayInit, OnGatewayDisconnect {
    private readonly prisma;
    private readonly jwtService;
    server: Server;
    private readonly userSockets;
    private readonly socketConversationRooms;
    private readonly userConversationSockets;
    constructor(prisma: PrismaService, jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinConversation(payload: {
        conversationId?: unknown;
    }, client: Socket): Promise<void>;
    handleLeaveConversation(payload: {
        conversationId?: unknown;
    }, client: Socket): Promise<void>;
    private removeSocketFromConversation;
    emitNewMessage(conversationId: string, message: unknown, recipientIds: string[]): void;
}
