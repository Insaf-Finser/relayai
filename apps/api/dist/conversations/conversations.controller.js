var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Post, Req, UseGuards, Patch, } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { ConversationsService } from "./conversations.service.js";
import { CreateConversationDto } from "./dto/create-conversation.dto.js";
import { CreateMessageDto } from "./dto/create-message.dto.js";
import { UpdateConversationStatusDto } from "./dto/update-conversation-status.dto.js";
import { AssignConversationDto } from "./dto/assign-conversation.dto.js";
import { ReopenRequestDto } from "./dto/reopen-request.dto.js";
let ConversationsController = class ConversationsController {
    conversationsService;
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    create(dto, req) {
        return this.conversationsService.create(dto, req.user.userId, req.user.role);
    }
    findAll(req) {
        return this.conversationsService.findAll(req.user.userId, req.user.role);
    }
    findUnassigned(req) {
        return this.conversationsService.findUnassigned(req.user.userId, req.user.role);
    }
    getUnreadCounts(req) {
        return this.conversationsService.getUnreadCounts(req.user.userId, req.user.role);
    }
    findOne(id, req) {
        return this.conversationsService.findOne(id, req.user.userId, req.user.role);
    }
    createMessage(id, dto, req) {
        return this.conversationsService.createMessage(id, dto, req.user.userId, req.user.role);
    }
    claimConversation(id, req) {
        return this.conversationsService.claimConversation(id, req.user.userId, req.user.role);
    }
    markAsRead(id, req) {
        return this.conversationsService.markAsRead(id, req.user.userId, req.user.role);
    }
    updateStatus(id, dto, req) {
        return this.conversationsService.updateStatus(id, req.user.userId, req.user.role, dto.status);
    }
    assignConversation(id, dto, req) {
        return this.conversationsService.assignConversation(id, dto.agentId, req.user.role);
    }
    requestReopen(id, dto, req) {
        return this.conversationsService.requestReopen(id, req.user.userId, req.user.role, dto);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateConversationDto, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "findAll", null);
__decorate([
    Get("queue/unassigned"),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "findUnassigned", null);
__decorate([
    Get("unread-counts"),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "getUnreadCounts", null);
__decorate([
    Get(":id"),
    __param(0, Param("id")),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "findOne", null);
__decorate([
    Post(":id/messages"),
    __param(0, Param("id")),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateMessageDto, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "createMessage", null);
__decorate([
    Post(":id/claim"),
    __param(0, Param("id")),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "claimConversation", null);
__decorate([
    Post(":id/read"),
    __param(0, Param("id")),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "markAsRead", null);
__decorate([
    Patch(":id/status"),
    __param(0, Param("id")),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateConversationStatusDto, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "updateStatus", null);
__decorate([
    Patch(":id/assign"),
    __param(0, Param("id")),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AssignConversationDto, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "assignConversation", null);
__decorate([
    Post(":id/reopen-request"),
    __param(0, Param("id")),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReopenRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "requestReopen", null);
ConversationsController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller("conversations"),
    __metadata("design:paramtypes", [ConversationsService])
], ConversationsController);
export { ConversationsController };
//# sourceMappingURL=conversations.controller.js.map