import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConversationsController } from "./conversations.controller.js";
import { ConversationsService } from "./conversations.service.js";
import type { AuthenticatedRequest } from "../auth/authenticated-request.js";

describe("ConversationsController", () => {
  const service = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    createMessage: vi.fn(),
    findUnassigned: vi.fn(),
    claimConversation: vi.fn(),
    requestReopen: vi.fn(),
  };

  let controller: ConversationsController;

  const request = {
    user: { userId: "customer-1", role: "CUSTOMER" },
  } as AuthenticatedRequest;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        { provide: ConversationsService, useValue: service },
      ],
    }).compile();

    controller = module.get(ConversationsController);
  });

  it("creates a conversation using the authenticated customer's identity", async () => {
    const dto = { subject: "Cannot access my account" };
    service.create.mockResolvedValue({ id: "conversation-1" });

    await controller.create(dto, request);

    expect(service.create).toHaveBeenCalledWith(
      dto,
      "customer-1",
      "CUSTOMER",
    );
  });

  it("lists conversations for the authenticated user", async () => {
    service.findAll.mockResolvedValue([]);

    await expect(controller.findAll(request)).resolves.toEqual([]);

    expect(service.findAll).toHaveBeenCalledWith(
      "customer-1",
      "CUSTOMER",
    );
  });

  it("fetches a conversation with the authenticated identity", async () => {
    service.findOne.mockResolvedValue({ id: "conversation-1" });

    await controller.findOne("conversation-1", request);

    expect(service.findOne).toHaveBeenCalledWith(
      "conversation-1",
      "customer-1",
      "CUSTOMER",
    );
  });

  it("creates a message without accepting a client-supplied sender identity", async () => {
    const dto = { content: "I need help" };
    service.createMessage.mockResolvedValue({ id: "message-1" });

    await controller.createMessage("conversation-1", dto, request);

    expect(service.createMessage).toHaveBeenCalledWith(
      "conversation-1",
      dto,
      "customer-1",
      "CUSTOMER",
    );
  });

  it("requests the unassigned queue for the current user", async () => {
    service.findUnassigned.mockResolvedValue([]);

    await expect(controller.findUnassigned(request)).resolves.toEqual([]);

    expect(service.findUnassigned).toHaveBeenCalledWith(
      "customer-1",
      "CUSTOMER",
    );
  });

  it("claims a conversation using the authenticated identity", async () => {
    const agentRequest = {
      user: { userId: "agent-1", role: "AGENT" },
    } as AuthenticatedRequest;

    service.claimConversation.mockResolvedValue({
      id: "conversation-1",
    });

    await controller.claimConversation("conversation-1", agentRequest);

    expect(service.claimConversation).toHaveBeenCalledWith(
      "conversation-1",
      "agent-1",
      "AGENT",
    );
  });
  it("requests conversation reopening using the authenticated customer's identity", async () => {
    const dto = {
      message: "My issue has returned and I need further assistance.",
    };

    service.requestReopen.mockResolvedValue({
      id: "conversation-1",
      reopenRequestMessage: dto.message,
    });

    await controller.requestReopen("conversation-1", dto, request);

    expect(service.requestReopen).toHaveBeenCalledWith(
      "conversation-1",
      "customer-1",
      "CUSTOMER",
      dto,
    );
  });
});