import type { AuthenticatedRequest } from "../auth/authenticated-request.js";
import { ConversationsService } from "./conversations.service.js";
import { CreateConversationDto } from "./dto/create-conversation.dto.js";
import { CreateMessageDto } from "./dto/create-message.dto.js";
import { UpdateConversationStatusDto } from "./dto/update-conversation-status.dto.js";
import { AssignConversationDto } from "./dto/assign-conversation.dto.js";
import { ReopenRequestDto } from "./dto/reopen-request.dto.js";
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    create(dto: CreateConversationDto, req: AuthenticatedRequest): Promise<{
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
    findAll(req: AuthenticatedRequest): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
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
    findUnassigned(req: AuthenticatedRequest): Promise<({
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
    getUnreadCounts(req: AuthenticatedRequest): Promise<{
        conversationId: string;
        unreadCount: number;
    }[]>;
    findOne(id: string, req: AuthenticatedRequest): Promise<{
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
    createMessage(id: string, dto: CreateMessageDto, req: AuthenticatedRequest): Promise<{
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
    claimConversation(id: string, req: AuthenticatedRequest): Promise<{
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
    markAsRead(id: string, req: AuthenticatedRequest): Promise<{
        conversationId: string;
        markedAsRead: number;
    }>;
    updateStatus(id: string, dto: UpdateConversationStatusDto, req: AuthenticatedRequest): Promise<{
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
    assignConversation(id: string, dto: AssignConversationDto, req: AuthenticatedRequest): Promise<{
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
    requestReopen(id: string, dto: ReopenRequestDto, req: AuthenticatedRequest): Promise<{
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
}
