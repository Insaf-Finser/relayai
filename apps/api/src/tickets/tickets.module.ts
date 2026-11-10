import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { TicketsController } from './tickets.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [PrismaModule, AiModule],
  providers: [TicketsService],
  controllers: [TicketsController]
})
export class TicketsModule {}
