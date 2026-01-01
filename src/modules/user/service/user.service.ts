import { Transactional } from '@/decorators/transactional';
import type { User } from '@/modules/user/domain/user.entity';
import type { GetUserInputDto, GetUserOutputDto } from '@/modules/user/service/dto/getUser.dto';
import type { Repository } from 'typeorm';

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  @Transactional()
  async getUser({ userId }: GetUserInputDto): Promise<GetUserOutputDto> {
    console.log('Fetching user with ID:', userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user.id, name: user.name, email: user.email };
  }
}
