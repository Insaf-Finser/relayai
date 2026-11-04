import { PrismaService } from "../prisma/prisma.service.js";
import { CreateTicketDto } from './dto/create-ticket.dto.js';
export declare class TicketsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTicketDto): import("../generated/prisma/models.js").Prisma__TicketClient<{
        subject: string;
        description: string;
        id: string;
        status: import("../generated/prisma/enums.js").TicketStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findAll(): import("../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        subject: string;
        description: string;
        id: string;
        status: import("../generated/prisma/enums.js").TicketStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        subject: string;
        description: string;
        id: string;
        status: import("../generated/prisma/enums.js").TicketStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
