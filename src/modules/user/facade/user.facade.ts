import type { UserService } from '@/modules/user/service/user.service';
import type { GetUserInputDto, GetUserOutputDto } from '@/modules/user/facade/dto/getUser.dto';

export class UserFacade {
  constructor(private readonly userService: UserService) {}

  async getUser(input: GetUserInputDto): Promise<GetUserOutputDto> {
    const serviceInput = { userId: input.userId };
    const serviceOutput = await this.userService.getUser(serviceInput);

    return {
      id: serviceOutput.id,
      name: serviceOutput.name,
      email: serviceOutput.email,
    };
  }
}
