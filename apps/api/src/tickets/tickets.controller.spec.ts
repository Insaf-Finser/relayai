
import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TicketsController } from "./tickets.controller.js";
import { TicketsService } from "./tickets.service.js";
import type { AuthenticatedRequest } from "../auth/authenticated-request.js";

describe("TicketsController", () => {
  const service = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
  };

  const customerRequest = {
    user: {
      userId: "customer-1",
      role: "CUSTOMER",
    },
  } as AuthenticatedRequest;

  let controller: TicketsController;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [{ provide: TicketsService, useValue: service }],
    }).compile();

    controller = module.get(TicketsController);
  });

  it("delegates ticket creation with authenticated user details", async () => {
    const dto = {
      subject: "Login problem",
      description: "Unable to log in",
    };

    service.create.mockResolvedValue({ id: "ticket-1" });

    await controller.create(dto, customerRequest);

    expect(service.create).toHaveBeenCalledWith(
      dto,
      "customer-1",
      "CUSTOMER",
    );
  });

  it("delegates ticket listing with authenticated user details", async () => {
    service.findAll.mockResolvedValue([]);

    await expect(controller.findAll(customerRequest)).resolves.toEqual([]);

    expect(service.findAll).toHaveBeenCalledWith(
      "customer-1",
      "CUSTOMER",
    );
  });

  it("delegates fetching a ticket by ID with authenticated user details", async () => {
    service.findOne.mockResolvedValue({ id: "ticket-1" });

    await controller.findOne("ticket-1", customerRequest);

    expect(service.findOne).toHaveBeenCalledWith(
      "ticket-1",
      "customer-1",
      "CUSTOMER",
    );
  });
});
