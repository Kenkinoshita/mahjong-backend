import type { CreateUserInputDto, CreateUserOutputDto } from '@/modules/user/service/dto/createUser.dto';
import { ApiError } from '@/shared/errors/apiError';
import { User } from '@/modules/user/domain/user.entity';
import type { GetUserInputDto, GetUserOutputDto } from '@/modules/user/service/dto/getUser.dto';
import type { Repository } from 'typeorm';

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  async createUser({ name, email, hashedPassword }: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw ApiError.conflict('Email already registered');

    const user = User.create({ name, email, password: hashedPassword });
    user.hoge();

    const savedUser = await this.userRepository.save(user);
    return { id: savedUser.id };
  }

  async getUser({ userId }: GetUserInputDto): Promise<GetUserOutputDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found');
    return { id: user.id, name: user.name, email: user.email, password: user.password };
  }

  async getUserByEmail(email: string): Promise<GetUserOutputDto | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    user.hoge();
    return { id: user.id, name: user.name, email: user.email, password: user.password };
  }
}
