
import { Test } from "@nestjs/testing";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
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

  const dto = {
    subject: "Login problem",
    description: "Unable to log in",
  };

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

  it("allows customers to create tickets with their own ID", async () => {
    const expected = {
      id: "ticket-1",
      ...dto,
      customerId: "customer-1",
    };

    prisma.ticket.create.mockResolvedValue(expected);

    await expect(
      service.create(dto, "customer-1", "CUSTOMER"),
    ).resolves.toEqual(expected);

    expect(prisma.ticket.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        customerId: "customer-1",
      },
    });
  });

  it.each(["AGENT", "ADMIN"])(
    "prevents %s users from creating customer tickets",
    (role) => {
      expect(() => {
        service.create(dto, "staff-1", role);
      }).toThrow(ForbiddenException);

      expect(prisma.ticket.create).not.toHaveBeenCalled();
    },
  );

  it("lists only the authenticated customer's tickets", async () => {
    prisma.ticket.findMany.mockResolvedValue([]);

    await expect(
      service.findAll("customer-1", "CUSTOMER"),
    ).resolves.toEqual([]);

    expect(prisma.ticket.findMany).toHaveBeenCalledWith({
      where: { customerId: "customer-1" },
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  });

  it.each(["AGENT", "ADMIN"])(
    "allows %s users to list all tickets",
    async (role) => {
      prisma.ticket.findMany.mockResolvedValue([]);

      await expect(
        service.findAll("staff-1", role),
      ).resolves.toEqual([]);

      expect(prisma.ticket.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    },
  );

  it("allows a customer to access their own ticket", async () => {
    const expected = {
      id: "ticket-1",
      ...dto,
      customerId: "customer-1",
    };

    prisma.ticket.findUnique.mockResolvedValue(expected);

    await expect(
      service.findOne("ticket-1", "customer-1", "CUSTOMER"),
    ).resolves.toEqual(expected);

    expect(prisma.ticket.findUnique).toHaveBeenCalledWith({
      where: { id: "ticket-1" },
    });
  });

  it("prevents a customer from accessing another customer's ticket", async () => {
    prisma.ticket.findUnique.mockResolvedValue({
      id: "ticket-1",
      customerId: "customer-2",
    });

    await expect(
      service.findOne("ticket-1", "customer-1", "CUSTOMER"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("prevents customers from accessing legacy tickets without an owner", async () => {
    prisma.ticket.findUnique.mockResolvedValue({
      id: "ticket-1",
      customerId: null,
    });

    await expect(
      service.findOne("ticket-1", "customer-1", "CUSTOMER"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it.each(["AGENT", "ADMIN"])(
    "allows %s users to access tickets regardless of ownership",
    async (role) => {
      const expected = {
        id: "ticket-1",
        ...dto,
        customerId: null,
      };

      prisma.ticket.findUnique.mockResolvedValue(expected);

      await expect(
        service.findOne("ticket-1", "staff-1", role),
      ).resolves.toEqual(expected);
    },
  );

  it("throws NotFoundException when the ticket does not exist", async () => {
    prisma.ticket.findUnique.mockResolvedValue(null);

    await expect(
      service.findOne("missing-ticket", "customer-1", "CUSTOMER"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
