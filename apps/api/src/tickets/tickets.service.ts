import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

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
  findAll(userId: string, role: string) {
    const where =
      role === 'CUSTOMER'
        ? { customerId: userId }
        : {};

    return this.prisma.ticket.findMany({
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
}