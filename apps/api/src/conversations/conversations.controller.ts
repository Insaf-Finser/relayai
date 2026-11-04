
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import type { AuthenticatedRequest } from "../auth/authenticated-request.js";
import { ConversationsService } from "./conversations.service.js";
import { CreateConversationDto } from "./dto/create-conversation.dto.js";
import { CreateMessageDto } from "./dto/create-message.dto.js";
import { UpdateConversationStatusDto } from "./dto/update-conversation-status.dto.js";
import { AssignConversationDto } from "./dto/assign-conversation.dto.js";
import { ReopenRequestDto } from "./dto/reopen-request.dto.js";

@UseGuards(JwtAuthGuard)
@Controller("conversations")
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateConversationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationsService.create(
      dto,
      req.user.userId,
      req.user.role,
    );
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.conversationsService.findAll(
      req.user.userId,
      req.user.role,
    );
  }

  @Get("queue/unassigned")
  findUnassigned(@Req() req: AuthenticatedRequest) {
    return this.conversationsService.findUnassigned(
      req.user.userId,
      req.user.role,
    );
  }

  @Get("unread-counts")
  getUnreadCounts(@Req() req: AuthenticatedRequest) {
    return this.conversationsService.getUnreadCounts(
      req.user.userId,
      req.user.role,
    );
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationsService.findOne(
      id,
      req.user.userId,
      req.user.role,
    );
  }

  @Post(":id/messages")
  createMessage(
    @Param("id") id: string,
    @Body() dto: CreateMessageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationsService.createMessage(
      id,
      dto,
      req.user.userId,
      req.user.role,
    );
  }

  

  @Post(":id/claim")
  claimConversation(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationsService.claimConversation(
      id,
      req.user.userId,
      req.user.role,
    );
  }

  @Post(":id/read")
  markAsRead(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationsService.markAsRead(
      id,
      req.user.userId,
      req.user.role,
    );
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateConversationStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationsService.updateStatus(
      id,
      req.user.userId,
      req.user.role,
      dto.status,
    );
  }


  @Patch(":id/assign")
  assignConversation(
    @Param("id") id: string,
    @Body() dto: AssignConversationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationsService.assignConversation(
      id,
      dto.agentId,
      req.user.role,
    );
  }

  @Post(":id/reopen-request")
  requestReopen(
    @Param("id") id: string,
    @Body() dto: ReopenRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.conversationsService.requestReopen(
      id,
      req.user.userId,
      req.user.role,
      dto,
    );
  }
}
