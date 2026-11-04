import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

describe("AuthController", () => {
  const authService = {
    register: vi.fn(),
    login: vi.fn(),
  };

  let controller: AuthController;

  beforeEach(async () => {
    vi.resetAllMocks();

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get(AuthController);
  });

  it("passes registration details to AuthService", async () => {
    const dto = {
      name: "Test Customer",
      email: "customer@example.com",
      password: "a-long-test-password",
    };
    const expected = { id: "user-1", email: dto.email };

    authService.register.mockResolvedValue(expected);

    await expect(controller.register(dto)).resolves.toEqual(expected);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it("passes login credentials to AuthService", async () => {
    const dto = {
      email: "customer@example.com",
      password: "a-long-test-password",
    };
    const expected = { accessToken: "test-token" };

    authService.login.mockResolvedValue(expected);

    await expect(controller.login(dto)).resolves.toEqual(expected);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});