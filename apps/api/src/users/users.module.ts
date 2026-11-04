
import { Module } from '@nestjs/common';

import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [UsersService, RolesGuard],
  controllers: [UsersController],
})
export class UsersModule {}
