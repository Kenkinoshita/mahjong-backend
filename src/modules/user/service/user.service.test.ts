import { verifyPassword } from '@/shared/password/verifyPassword';
import { describe, expect, it, vi } from 'vitest';
import type { Repository } from 'typeorm';
import { User } from '@/modules/user/domain/user.entity';
import { UserService } from '@/modules/user/service/user.service';

vi.mock('@/shared/decorators/transactional', () => ({ Transactional: () => () => {} }));

const input = { name: 'Test User', email: 'test@example.com', password: 'password123' };

function setup() {
  const repository = {
    findOne: vi.fn<Repository<User>['findOne']>().mockResolvedValue(null),
    find: vi.fn<Repository<User>['find']>().mockResolvedValue([]),
    save: vi.fn().mockResolvedValue({ id: 42 }),
  };
  return { repository, service: new UserService(repository as unknown as Repository<User>) };
}

describe('UserService.createUser', () => {
  it('creates a user when the email is available', async () => {
    const { repository, service } = setup();
    expect(await service.createUser(input)).toEqual({ id: 42 });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { email: input.email } });
    const saved = repository.save.mock.calls[0][0] as User;
    expect(saved.name).toBe(input.name);
    expect(saved.email).toBe(input.email);
    expect(saved.password).not.toBe(input.password);
    expect(await verifyPassword(saved.password, input.password)).toBe(true);
  });

  it('rejects a duplicate email without saving', async () => {
    const { repository, service } = setup();
    repository.findOne.mockResolvedValue(
      User.create({ name: input.name, email: input.email, password: 'existing-hash' }),
    );
    await expect(service.createUser(input)).rejects.toMatchObject({ code: 'CONFLICT' });
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('propagates other database errors', async () => {
    const { repository, service } = setup();
    const error = new Error('Database unavailable');
    repository.save.mockRejectedValue(error);
    await expect(service.createUser(input)).rejects.toBe(error);
  });
});

describe('UserService.getUsers', () => {
  it('returns only public fields in ID order', async () => {
    const { repository, service } = setup();
    repository.find.mockResolvedValue([
      { id: 2, name: '佐藤', email: 'sato@example.com', password: 'secret' } as User,
      { id: 3, name: '田中', email: 'tanaka@example.com', password: 'secret' } as User,
    ]);

    await expect(service.getUsers()).resolves.toEqual([
      { id: 2, name: '佐藤', email: 'sato@example.com' },
      { id: 3, name: '田中', email: 'tanaka@example.com' },
    ]);
    expect(repository.find).toHaveBeenCalledWith({
      select: ['id', 'name', 'email'],
      order: { id: 'ASC' },
    });
  });

  it('returns an empty array when no users exist', async () => {
    const { service } = setup();
    await expect(service.getUsers()).resolves.toEqual([]);
  });
});
