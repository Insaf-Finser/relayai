import { Test } from "@nestjs/testing";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { NotFoundException } from "@nestjs/common";
import { TicketsService } from "./tickets.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("TicketsService", () => {
  const prisma = {
    ticket: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  let service: TicketsService;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(TicketsService);
  });

  it("creates a ticket with the supplied subject and description", async () => {
    const dto = {
      subject: "Login problem",
      description: "Unable to log in",
    };
    const expected = { id: "ticket-1", ...dto };

    prisma.ticket.create.mockResolvedValue(expected);

    await expect(service.create(dto)).resolves.toEqual(expected);

    expect(prisma.ticket.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it("lists tickets newest first", async () => {
    prisma.ticket.findMany.mockResolvedValue([]);

    await expect(service.findAll()).resolves.toEqual([]);

    expect(prisma.ticket.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns a ticket when it exists", async () => {
    const expected = { id: "ticket-1", subject: "Login problem" };
    prisma.ticket.findUnique.mockResolvedValue(expected);

    await expect(service.findOne("ticket-1")).resolves.toEqual(expected);

    expect(prisma.ticket.findUnique).toHaveBeenCalledWith({
      where: { id: "ticket-1" },
    });
  });

  it("throws NotFoundException when the ticket does not exist", async () => {
    prisma.ticket.findUnique.mockResolvedValue(null);

    await expect(service.findOne("missing-ticket"))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});