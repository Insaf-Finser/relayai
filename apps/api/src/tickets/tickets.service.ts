import { Injectable,NotFoundException } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service.js";
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) {}

    create(dto: CreateTicketDto){
        return this.prisma.ticket.create({
            data:{
                subject:dto.subject,
                description:dto.description
            },
        });
    }

    findAll(){
        return this.prisma.ticket.findMany({
            orderBy:{
                createdAt: 'desc',
            }
        });
    }

    async findOne(id: string){
        const ticket = await this.prisma.ticket.findUnique({
            where:{id},
        });

        if(!ticket){
            throw new NotFoundException(`Ticket with id ${id} not found`);
        }

        return ticket;
    }
}
