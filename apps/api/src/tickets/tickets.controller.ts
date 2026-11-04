import { Body,Controller,Param,Post,Get } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Post()
    create(@Body() dto:CreateTicketDto){
        return this.ticketsService.create(dto);
    }

    @Get()
    findAll(){
        return this.ticketsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string){
        return this.ticketsService.findOne(id);
    }
}
