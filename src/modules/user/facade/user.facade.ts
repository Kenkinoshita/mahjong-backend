import type { UserService } from '@/modules/user/service/user.service';

export class UserFacade {
  constructor(private readonly userService: UserService) {}
}
