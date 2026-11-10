import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { calculateTicketSimilarity } from './ticket-similarity.js';
import { AiService } from '../ai/ai.service.js';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    ) {}

  // Only customers can create tickets.
  // Ownership always comes from the authenticated user.
  create(dto: CreateTicketDto, userId: string, role: string) {
    if (role !== 'CUSTOMER') {
      throw new ForbiddenException(
        'Only customers can create tickets',
      );
    }

    return this.prisma.ticket.create({
      data: {
        subject: dto.subject,
        description: dto.description,
        customerId: userId,
      },
    });
  }

  // Customers see their own tickets.
  // Agents and admins see all tickets.
  async findAll(userId: string, role: string) {
    const where =
        role === 'CUSTOMER'
        ? { customerId: userId }
        : {};

    const tickets = await this.prisma.ticket.findMany({
        where,
        orderBy: {
        createdAt: 'desc',
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

    // Customers only receive their own tickets.
    // Duplicate detection is reserved for staff.
    if (role === 'CUSTOMER') {
        return tickets;
    }

    const unresolvedTickets = await this.prisma.ticket.findMany({
        where: {
            status: {
            in: ['OPEN', 'IN_PROGRESS'],
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        });

        return tickets.map((ticket) => {
        const ticketText = `${ticket.subject} ${ticket.description}`;

        const possibleDuplicates = unresolvedTickets
            .filter((candidate) => candidate.id !== ticket.id)
            .map((candidate) => {
            const candidateText =
                `${candidate.subject} ${candidate.description}`;

            const similarity = calculateTicketSimilarity(
                ticketText,
                candidateText,
            );

            return {
                id: candidate.id,
                subject: candidate.subject,
                status: candidate.status,
                similarity,
            };
            })
            .filter((candidate) => candidate.similarity >= 0.5)
            .sort((a, b) => b.similarity - a.similarity);

        return {
            ...ticket,
            possibleDuplicates,
        };
        });
    }

  // Customers can only access their own tickets.
  // Agents and admins can access all tickets.
  async findOne(id: string, userId: string, role: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException(
        `Ticket with id ${id} not found`,
      );
    }

    if (
      role === 'CUSTOMER' &&
      ticket.customerId !== userId
    ) {
      throw new ForbiddenException(
        'You do not have access to this ticket',
      );
    }

    return ticket;
  }

    // Only agents and admins can generate AI ticket summaries.
  async summarize(
    id: string,
    userId: string,
    role: string,
  ) {
    if (role !== 'AGENT' && role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only agents and admins can generate ticket summaries',
      );
    }

    const ticket = await this.findOne(id, userId, role);

    const summary = await this.aiService.summarizeTicket(
      ticket.subject,
      ticket.description,
    );

    return {
      ticketId: ticket.id,
      summary,
    };
  }

  // Only agents and admins can generate AI-suggested replies.
    async suggestReply(
    id: string,
    userId: string,
    role: string,
    ) {
    if (role !== 'AGENT' && role !== 'ADMIN') {
        throw new ForbiddenException(
        'Only agents and admins can generate suggested replies',
        );
    }

    const ticket = await this.findOne(id, userId, role);

    const reply = await this.aiService.suggestReply(
        ticket.subject,
        ticket.description,
    );

    return {
        ticketId: ticket.id,
        reply,
    };
    }
}