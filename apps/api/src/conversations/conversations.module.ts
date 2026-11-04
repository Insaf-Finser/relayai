import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service.js';
import { ConversationsController } from './conversations.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ConversationsGateway } from './conversations.gateway.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports:[PrismaModule , AuthModule],
  providers: [ConversationsService, ConversationsGateway],
  controllers: [ConversationsController]
})
export class ConversationsModule {}
