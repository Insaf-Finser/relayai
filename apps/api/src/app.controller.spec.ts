import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppController } from "./app.controller.js";
import { PrismaService } from "./prisma/prisma.service.js";

describe("AppController", () => {
  const prisma = {
    $queryRaw: vi.fn(),
  };

  let controller: AppController;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    controller = module.get(AppController);
  });

  it("returns healthy status when the database query succeeds", async () => {
    prisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    await expect(controller.check()).resolves.toEqual({
      status: "ok",
      database: "connected",
      service: "relayai-api",
    });

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it("propagates database failures instead of reporting healthy status", async () => {
    const error = new Error("Database unavailable");
    prisma.$queryRaw.mockRejectedValue(error);

    await expect(controller.check()).rejects.toBe(error);
  });
});