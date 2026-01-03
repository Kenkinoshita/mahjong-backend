import type { GetUserForLoginInputDto, GetUserForLoginOutputDto } from '@/modules/user/facade/dto/getUserForLogin.dto';
import type { UserService } from '@/modules/user/service/user.service';

export class UserFacade {
  constructor(private readonly userService: UserService) {}

  async getUserForLogin({ email }: GetUserForLoginInputDto): Promise<GetUserForLoginOutputDto | null> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) return null;

    return {
      id: user.id,
      hashedPassword: user.password,
    };
  }
}
