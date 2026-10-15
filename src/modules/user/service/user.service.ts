import { hashPassword } from '@/shared/password/hashPassword';
import type { CreateUserInputDto, CreateUserOutputDto } from '@/modules/user/service/dto/createUser.dto';
import { ApiError } from '@/shared/errors/apiError';
import { User } from '@/modules/user/domain/user.entity';
import type { GetUserInputDto, GetUserOutputDto } from '@/modules/user/service/dto/getUser.dto';
import type { GetUsersResponse } from '@common/schemas/users/response/getUsersResponseSchema';
import type { Repository } from 'typeorm';

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  async createUser({ name, email, password }: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw ApiError.conflict('Email already registered');

    const hashedPassword = await hashPassword(password);
    const user = User.create({ name, email, password: hashedPassword });
    const savedUser = await this.userRepository.save(user);
    return { id: savedUser.id };
  }

  async getUser({ userId }: GetUserInputDto): Promise<GetUserOutputDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found');
    return { id: user.id, name: user.name, email: user.email, password: user.password };
  }

  async getUsers(): Promise<GetUsersResponse> {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email'],
      order: { id: 'ASC' },
    });
    return users.map(({ id, name, email }) => ({ id, name, email }));
  }

  async deleteUser(userId: number): Promise<void> {
    const result = await this.userRepository.delete({ id: userId });
    if (!result.affected) throw ApiError.notFound('User not found');
  }

  async getUserByEmail(email: string): Promise<GetUserOutputDto | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email, password: user.password };
  }
}
