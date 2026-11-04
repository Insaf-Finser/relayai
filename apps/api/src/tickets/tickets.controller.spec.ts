import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TicketsController } from "./tickets.controller.js";
import { TicketsService } from "./tickets.service.js";

describe("TicketsController", () => {
  const service = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
  };

  let controller: TicketsController;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [{ provide: TicketsService, useValue: service }],
    }).compile();

    controller = module.get(TicketsController);
  });

  it("delegates ticket creation", async () => {
    const dto = {
      subject: "Login problem",
      description: "Unable to log in",
    };
    service.create.mockResolvedValue({ id: "ticket-1" });

    await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("delegates listing all tickets", async () => {
    service.findAll.mockResolvedValue([]);

    await expect(controller.findAll()).resolves.toEqual([]);
    expect(service.findAll).toHaveBeenCalledOnce();
  });

  it("delegates fetching a ticket by ID", async () => {
    service.findOne.mockResolvedValue({ id: "ticket-1" });

    await controller.findOne("ticket-1");

    expect(service.findOne).toHaveBeenCalledWith("ticket-1");
  });
});