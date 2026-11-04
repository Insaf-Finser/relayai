
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

describe("AuthService", () => {
  let service: AuthService;

  const prisma = {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  const jwt = {
    signAsync: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe("register", () => {
    it("creates a customer with a bcrypt-hashed password", async () => {
      prisma.user.create.mockImplementation(async ({ data }) => ({
        id: "customer-1",
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: new Date(),
      }));

      const result = await service.register({
        name: "Test Customer",
        email: "customer@example.com",
        password: "a-long-test-password",
      });

      expect(prisma.user.create).toHaveBeenCalledTimes(1);

      const call = prisma.user.create.mock.calls[0]?.[0];
      expect(call.data.role).toBe("CUSTOMER");
      expect(call.data.email).toBe("customer@example.com");
      expect(call.data.passwordHash).not.toBe(
        "a-long-test-password",
      );
      expect(
        await bcrypt.compare(
          "a-long-test-password",
          call.data.passwordHash,
        ),
      ).toBe(true);

      expect(result).not.toHaveProperty("passwordHash");
      expect(result).toMatchObject({
        id: "customer-1",
        name: "Test Customer",
        role: "CUSTOMER",
      });
    });
  });

  describe("login", () => {
    it("normalizes the email and returns a JWT and correct user profile", async () => {
      const passwordHash = await bcrypt.hash(
        "a-long-test-password",
        4,
      );

      prisma.user.findUnique.mockResolvedValue({
        id: "customer-1",
        name: "Test Customer",
        email: "customer@example.com",
        passwordHash,
        role: "CUSTOMER",
      });

      jwt.signAsync.mockResolvedValue("test-access-token");

      const result = await service.login({
        email: "  CUSTOMER@EXAMPLE.COM ",
        password: "a-long-test-password",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "customer@example.com" },
      });

      expect(jwt.signAsync).toHaveBeenCalledWith({
        sub: "customer-1",
        role: "CUSTOMER",
      });

      expect(result).toEqual({
        accessToken: "test-access-token",
        tokenType: "Bearer",
        expiresIn: 900,
        user: {
          id: "customer-1",
          name: "Test Customer",
          email: "customer@example.com",
          role: "CUSTOMER",
        },
      });
    });

    it("rejects an email that does not exist", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: "missing@example.com",
          password: "a-long-test-password",
        }),
      ).rejects.toMatchObject({ status: 401 });

      expect(jwt.signAsync).not.toHaveBeenCalled();
    });

    it("rejects an incorrect password", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "customer-1",
        name: "Test Customer",
        email: "customer@example.com",
        passwordHash: await bcrypt.hash(
          "correct-test-password",
          4,
        ),
        role: "CUSTOMER",
      });

      await expect(
        service.login({
          email: "customer@example.com",
          password: "incorrect-test-password",
        }),
      ).rejects.toMatchObject({ status: 401 });

      expect(jwt.signAsync).not.toHaveBeenCalled();
    });

    it("rejects a user without a password hash", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "customer-1",
        name: "Test Customer",
        email: "customer@example.com",
        passwordHash: null,
        role: "CUSTOMER",
      });

      await expect(
        service.login({
          email: "customer@example.com",
          password: "a-long-test-password",
        }),
      ).rejects.toMatchObject({ status: 401 });

      expect(jwt.signAsync).not.toHaveBeenCalled();
    });
  });
});
