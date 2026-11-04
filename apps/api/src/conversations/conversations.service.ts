
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateConversationDto } from "./dto/create-conversation.dto.js";
import { CreateMessageDto } from "./dto/create-message.dto.js";
import { ConversationsGateway } from "./conversations.gateway.js";
import { AssignConversationDto } from "./dto/assign-conversation.dto.js";
import { ReopenRequestDto } from "./dto/reopen-request.dto.js";

@Injectable()
export class ConversationsService {
    constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ConversationsGateway,
    ) {}

    async create(
        dto: CreateConversationDto,
        userId: string,
        role: string,
        ) {
        if (role !== "CUSTOMER") {
            throw new ForbiddenException(
            "Only customers can create conversations",
            );
        }

        return this.prisma.conversation.create({
            data: {
            subject: dto.subject,
            customerId: userId,
            },
            include: {
            customer: {
                select: {
                id: true,
                name: true,
                email: true,
                },
            },
            },
        });
    }

    findAll(userId: string, role: string) {
        const where =
            role === "ADMIN"
            ? {}
            : role === "AGENT"
                ? { assignedAgentId: userId }
                : { customerId: userId };

        return this.prisma.conversation.findMany({
            where,
            include: {
            customer: {
                select: { id: true, name: true, email: true },
            },
            _count: {
                select: { messages: true },
            },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findOne(id: string, userId: string, role: string) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id },
            include: {
            customer: {
                select: { id: true, name: true, email: true },
            },
            assignedAgent: {
                select: { id: true, name: true, email: true },
            },
            messages: {
                orderBy: { createdAt: "asc" },
                include: {
                sender: {
                    select: { id: true, name: true, role: true },
                },
                },
            },
            },
        });

        if (!conversation) {
            throw new NotFoundException("Conversation not found");
        }

        const allowed =
            role === "ADMIN" ||
            conversation.customerId === userId ||
            conversation.assignedAgentId === userId;

        if (!allowed) {
            throw new ForbiddenException(
            "You cannot access this conversation",
            );
        }

        return conversation;
    }

  
    async createMessage(
    conversationId: string,
    dto: CreateMessageDto,
    senderId: string,
    role: string,
    ) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: {
                id: true,
                customerId: true,
                assignedAgentId: true,
                status: true,
            },
        });

        if (!conversation) {
            throw new NotFoundException("Conversation not found");
        }

        const allowed =
            role === "ADMIN" ||
            conversation.customerId === senderId ||
            conversation.assignedAgentId === senderId;

        if (!allowed) {
            throw new ForbiddenException(
            "You cannot send messages in this conversation",
            );
        }

        if (conversation.status === "RESOLVED") {
            throw new ConflictException(
                "This conversation is resolved. Reopen it before sending new messages.",
            );
        }

        const message = await this.prisma.message.create({
            data: {
            content: dto.content,
            conversationId: conversation.id,
            senderId,
            },
            include: {
            sender: {
                select: {
                id: true,
                name: true,
                role: true,
                },
            },
            },
        });

        const recipientIds = [
        conversation.customerId,
        conversation.assignedAgentId,
        ].filter(
        (userId): userId is string =>
            userId !== null && userId !== senderId,
        );

        this.gateway.emitNewMessage(
        conversation.id,
        message,
        recipientIds,
        );

        return message;
    }


    async findUnassigned(userId: string, role: string) {
    if (role !== "AGENT" && role !== "ADMIN") {
        throw new ForbiddenException(
        "Only agents and administrators can view the unassigned queue",
        );
    }

    return this.prisma.conversation.findMany({
        where: {
        assignedAgentId: null,
        status: "OPEN",
        },
        include: {
        customer: {
            select: {
            id: true,
            name: true,
            email: true,
            },
        },
        _count: {
            select: {
            messages: true,
            },
        },
        },
        orderBy: {
        createdAt: "asc",
        },
    });
    }

    async markAsRead(
        conversationId: string,
        userId: string,
        role: string,
    ) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: {
            id: true,
            customerId: true,
            assignedAgentId: true,
            },
        });

        if (!conversation) {
            throw new NotFoundException("Conversation not found");
        }

        const allowed =
            role === "ADMIN" ||
            conversation.customerId === userId ||
            conversation.assignedAgentId === userId;

        if (!allowed) {
            throw new ForbiddenException(
            "You cannot access this conversation",
            );
        }

        // Only mark messages sent by someone else as read.
        const result = await this.prisma.messageRead.createMany({
            data: await this.prisma.message.findMany({
            where: {
                conversationId,
                senderId: { not: userId },
                reads: {
                none: { userId },
                },
            },
            select: {
                id: true,
            },
            }).then((messages) =>
            messages.map((message) => ({
                messageId: message.id,
                userId,
            })),
            ),
            skipDuplicates: true,
        });

        return {
            conversationId,
            markedAsRead: result.count,
        };
    }

    async getUnreadCounts(userId: string, role: string) {
        if (role !== "CUSTOMER" && role !== "AGENT") {
            throw new ForbiddenException(
            "Unread counts are available to customers and agents",
            );
        }

        const conversations = await this.prisma.conversation.findMany({
            where:
            role === "CUSTOMER"
                ? { customerId: userId }
                : { assignedAgentId: userId },
            select: {
            id: true,
            _count: {
                select: {
                messages: {
                    where: {
                    senderId: { not: userId },
                    reads: {
                        none: { userId },
                    },
                    },
                },
                },
            },
            },
        });

        return conversations.map((conversation) => ({
            conversationId: conversation.id,
            unreadCount: conversation._count.messages,
        }));
    }

    async claimConversation(
    conversationId: string,
    agentId: string,
    role: string,
    ) {
    if (role !== "AGENT") {
        throw new ForbiddenException(
        "Only agents can claim conversations",
        );
    }

    return this.prisma.$transaction(async (tx) => {
        // Serialize claims made by this agent.
        const agent = await tx.$queryRaw<{ id: string }[]>`
        SELECT "id"
        FROM "User"
        WHERE "id" = ${agentId}
        FOR UPDATE
        `;

        if (agent.length === 0) {
        throw new ForbiddenException("Agent not found");
        }

        // Count this agent's active workload while holding the lock.
        const activeCount = await tx.conversation.count({
        where: {
            assignedAgentId: agentId,
            status: {
            in: ["OPEN", "IN_PROGRESS"],
            },
        },
        });

        if (activeCount >= 3) {
        throw new ConflictException(
            "You have reached the limit of 3 active conversations",
        );
        }

        // Claim only if the conversation is still available.
        const result = await tx.conversation.updateMany({
        where: {
            id: conversationId,
            assignedAgentId: null,
            status: "OPEN",
        },
        data: {
            assignedAgentId: agentId,
            status: "IN_PROGRESS",
        },
        });

        if (result.count === 0) {
        const conversation = await tx.conversation.findUnique({
            where: { id: conversationId },
            select: { id: true },
        });

        if (!conversation) {
            throw new NotFoundException(
            "Conversation not found",
            );
        }

        throw new ConflictException(
            "This conversation is no longer available to claim",
        );
        }

        return tx.conversation.findUniqueOrThrow({
        where: { id: conversationId },
        include: {
            customer: {
            select: {
                id: true,
                name: true,
                email: true,
            },
            },
            assignedAgent: {
            select: {
                id: true,
                name: true,
                email: true,
            },
            },
        },
        });
    });
    }

    async requestReopen(
    conversationId: string,
    userId: string,
    role: string,
    dto: ReopenRequestDto,
    ) {
    if (role !== "CUSTOMER") {
        throw new ForbiddenException(
        "Only customers can request conversation reopening",
        );
    }

    const message = dto.message.trim();

    if (!message) {
        throw new BadRequestException(
        "A reason for reopening is required",
        );
    }

    const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        select: {
        id: true,
        customerId: true,
        status: true,
        reopenRequestedAt: true,
        },
    });

    if (!conversation) {
        throw new NotFoundException("Conversation not found");
    }

    if (conversation.customerId !== userId) {
        throw new ForbiddenException(
        "You cannot request reopening for this conversation",
        );
    }

    if (conversation.status !== "RESOLVED") {
        throw new ConflictException(
        "Only resolved conversations can be reopened",
        );
    }

    if (conversation.reopenRequestedAt) {
        throw new ConflictException(
        "A reopening request has already been submitted",
        );
    }

    const result = await this.prisma.conversation.updateMany({
        where: {
        id: conversationId,
        customerId: userId,
        status: "RESOLVED",
        reopenRequestedAt: null,
        },
        data: {
        reopenRequestedAt: new Date(),
        reopenRequestMessage: message,
        },
    });

    if (result.count === 0) {
        throw new ConflictException(
        "A reopening request already exists or the conversation has changed",
        );
    }

    return this.prisma.conversation.findUnique({
        where: { id: conversationId },
    });
    }

    async updateStatus(
        conversationId: string,
        userId: string,
        role: string,
        newStatus: "OPEN" | "IN_PROGRESS" | "RESOLVED",
    ) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            select: {
            id: true,
            status: true,
            assignedAgentId: true,
            },
        });

        if (!conversation) {
            throw new NotFoundException("Conversation not found");
        }

        // Only admins or the assigned agent can change status.
        const isAdmin = role === "ADMIN";
        const isAssignedAgent =
            role === "AGENT" &&
            conversation.assignedAgentId === userId;

        if (!isAdmin && !isAssignedAgent) {
            throw new ForbiddenException(
            "Only the assigned agent or an administrator can update status",
            );
        }

        const currentStatus = conversation.status;

        if (currentStatus === newStatus) {
            throw new BadRequestException(
            "Conversation already has this status",
            );
        }

        const allowedTransitions: Record<
            string,
            string[]
        > = {
            OPEN: ["IN_PROGRESS", "RESOLVED"],
            IN_PROGRESS: ["RESOLVED"],
            RESOLVED: ["OPEN", "IN_PROGRESS"],
        };

        if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
            throw new BadRequestException(
            `Cannot change conversation status from ${currentStatus} to ${newStatus}`,
            );
        }

        // Agents cannot resolve an unclaimed conversation.
        if (
            newStatus === "RESOLVED" &&
            !isAdmin &&
            !conversation.assignedAgentId
        ) {
            throw new ForbiddenException(
            "An agent must claim the conversation before resolving it",
            );
        }

        const result = await this.prisma.conversation.updateMany({
            where: {
                id: conversationId,
                status: currentStatus,
                ...(isAdmin ? {} : { assignedAgentId: userId }),
            },
            data: {
                status: newStatus,

                // Clear the previous reopening request when staff reopens the conversation.
                ...(currentStatus === "RESOLVED" &&
                (newStatus === "OPEN" || newStatus === "IN_PROGRESS")
                    ? {
                        reopenRequestedAt: null,
                        reopenRequestMessage: null,
                    }
                    : {}),
            },
        });

        if (result.count === 0) {
            throw new ConflictException(
            "Conversation status changed. Please refresh and try again.",
            );
        }

        return this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
    }

    async assignConversation(
        conversationId: string,
        agentId: string,
        role: string,
    ) {
        if (role !== "ADMIN") {
            throw new ForbiddenException(
            "Only administrators can assign conversations",
            );
        }

        return this.prisma.$transaction(async (tx) => {
            // Lock the target agent to serialize workload checks.
            const agents = await tx.$queryRaw<{ id: string }[]>`
            SELECT "id"
            FROM "User"
            WHERE "id" = ${agentId}
                AND "role" = 'AGENT'
            FOR UPDATE
            `;

            if (agents.length === 0) {
            throw new NotFoundException("Agent not found");
            }

            const conversation = await tx.conversation.findUnique({
            where: { id: conversationId },
            select: {
                id: true,
                status: true,
                assignedAgentId: true,
            },
            });

            if (!conversation) {
            throw new NotFoundException("Conversation not found");
            }

            if (conversation.status === "RESOLVED") {
            throw new ConflictException(
                "Resolved conversations cannot be assigned",
            );
            }

            if (conversation.assignedAgentId === agentId) {
            throw new ConflictException(
                "This agent is already assigned to the conversation",
            );
            }

            const activeCount = await tx.conversation.count({
            where: {
                assignedAgentId: agentId,
                status: {
                in: ["OPEN", "IN_PROGRESS"],
                },
            },
            });

            if (activeCount >= 3) {
            throw new ConflictException(
                "This agent has reached the limit of 3 active conversations",
            );
            }

            const result = await tx.conversation.updateMany({
            where: {
                id: conversationId,
                assignedAgentId: conversation.assignedAgentId,
                status: conversation.status,
            },
            data: {
                assignedAgentId: agentId,
                status: "IN_PROGRESS",
            },
            });

            if (result.count === 0) {
            throw new ConflictException(
                "Conversation assignment changed. Please refresh and try again.",
            );
            }

            return tx.conversation.findUniqueOrThrow({
            where: { id: conversationId },
            include: {
                customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
                },
                assignedAgent: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
                },
            },
            });
        });
    }
}
