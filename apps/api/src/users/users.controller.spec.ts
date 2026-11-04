
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    createAgent: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    usersService = {
      createAgent: vi.fn(),
      findAll: vi.fn(),
    };

    controller = new UsersController(
      usersService as unknown as UsersService,
    );
  });

  it('delegates agent creation to the service', async () => {
    const dto = {
      name: 'Test Agent',
      email: 'agent@example.test',
      password: 'StrongPassword123!',
    };
    const expected = {
      id: 'agent-1',
      name: dto.name,
      email: dto.email,
      role: 'AGENT',
    };

    usersService.createAgent.mockResolvedValue(expected);

    await expect(controller.createAgent(dto)).resolves.toEqual(expected);
    expect(usersService.createAgent).toHaveBeenCalledWith(dto);
  });

  it('delegates listing users to the service', async () => {
    const expected = [{ id: 'user-1', role: 'CUSTOMER' }];
    usersService.findAll.mockResolvedValue(expected);

    await expect(controller.findAll()).resolves.toEqual(expected);
    expect(usersService.findAll).toHaveBeenCalledOnce();
  });
});
