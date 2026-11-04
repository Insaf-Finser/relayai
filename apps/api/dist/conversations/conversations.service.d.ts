import { PrismaService } from "../prisma/prisma.service.js";
import { CreateConversationDto } from "./dto/create-conversation.dto.js";
import { CreateMessageDto } from "./dto/create-message.dto.js";
import { ConversationsGateway } from "./conversations.gateway.js";
import { ReopenRequestDto } from "./dto/reopen-request.dto.js";
export declare class ConversationsService {
    private readonly prisma;
    private readonly gateway;
    constructor(prisma: PrismaService, gateway: ConversationsGateway);
    create(dto: CreateConversationDto, userId: string, role: string): Promise<{
        customer: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        subject: string;
        status: import("../generated/prisma/enums.js").ConversationStatus;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
        customerId: string;
        assignedAgentId: string | null;
    }>;
    findAll(userId: string, role: string): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        customer: {
            id: string;
            name: string;
            email: string;
        };
        _count: {
            messages: number;
        };
    } & {
        id: string;
        subject: string;
        status: import("../generated/prisma/enums.js").ConversationStatus;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
        customerId: string;
        assignedAgentId: string | null;
    })[]>;
    findOne(id: string, userId: string, role: string): Promise<{
        customer: {
            id: string;
            name: string;
            email: string;
        };
        assignedAgent: {
            id: string;
            name: string;
            email: string;
        } | null;
        messages: ({
            sender: {
                id: string;
                name: string;
                role: import("../generated/prisma/enums.js").UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            content: string;
        })[];
    } & {
        id: string;
        subject: string;
        status: import("../generated/prisma/enums.js").ConversationStatus;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
        customerId: string;
        assignedAgentId: string | null;
    }>;
    createMessage(conversationId: string, dto: CreateMessageDto, senderId: string, role: string): Promise<{
        sender: {
            id: string;
            name: string;
            role: import("../generated/prisma/enums.js").UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string;
    }>;
    findUnassigned(userId: string, role: string): Promise<({
        customer: {
            id: string;
            name: string;
            email: string;
        };
        _count: {
            messages: number;
        };
    } & {
        id: string;
        subject: string;
        status: import("../generated/prisma/enums.js").ConversationStatus;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
        customerId: string;
        assignedAgentId: string | null;
    })[]>;
    markAsRead(conversationId: string, userId: string, role: string): Promise<{
        conversationId: string;
        markedAsRead: number;
    }>;
    getUnreadCounts(userId: string, role: string): Promise<{
        conversationId: string;
        unreadCount: number;
    }[]>;
    claimConversation(conversationId: string, agentId: string, role: string): Promise<{
        customer: {
            id: string;
            name: string;
            email: string;
        };
        assignedAgent: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        id: string;
        subject: string;
        status: import("../generated/prisma/enums.js").ConversationStatus;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
        customerId: string;
        assignedAgentId: string | null;
    }>;
    requestReopen(conversationId: string, userId: string, role: string, dto: ReopenRequestDto): Promise<{
        id: string;
        subject: string;
        status: import("../generated/prisma/enums.js").ConversationStatus;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
        customerId: string;
        assignedAgentId: string | null;
    } | null>;
    updateStatus(conversationId: string, userId: string, role: string, newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED"): Promise<{
        id: string;
        subject: string;
        status: import("../generated/prisma/enums.js").ConversationStatus;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
        customerId: string;
        assignedAgentId: string | null;
    } | null>;
    assignConversation(conversationId: string, agentId: string, role: string): Promise<{
        customer: {
            id: string;
            name: string;
            email: string;
        };
        assignedAgent: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        id: string;
        subject: string;
        status: import("../generated/prisma/enums.js").ConversationStatus;
        createdAt: Date;
        updatedAt: Date;
        reopenRequestedAt: Date | null;
        reopenRequestMessage: string | null;
        customerId: string;
        assignedAgentId: string | null;
    }>;
}
