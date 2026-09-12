import { describe, expect, it, vi } from 'vitest';
import type { Repository } from 'typeorm';
import { User } from '@/modules/user/domain/user.entity';
import { UserService } from '@/modules/user/service/user.service';

vi.mock('@/shared/decorators/transactional', () => ({ Transactional: () => () => {} }));

const input = { name: 'Test User', email: 'test@example.com', hashedPassword: 'hashed-password' };

function setup() {
  const repository = {
    findOne: vi.fn<Repository<User>['findOne']>().mockResolvedValue(null),
    save: vi.fn().mockResolvedValue({ id: 42 }),
  };
  return { repository, service: new UserService(repository as unknown as Repository<User>) };
}

describe('UserService.createUser', () => {
  it('creates a user when the email is available', async () => {
    const { repository, service } = setup();
    expect(await service.createUser(input)).toEqual({ id: 42 });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { email: input.email } });
    expect(repository.save).toHaveBeenCalledWith(
      User.create({
        name: input.name,
        email: input.email,
        password: input.hashedPassword,
      }),
    );
  });

  it('rejects a duplicate email without saving', async () => {
    const { repository, service } = setup();
    repository.findOne.mockResolvedValue(
      User.create({ name: input.name, email: input.email, password: input.hashedPassword }),
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
