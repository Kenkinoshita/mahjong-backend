import { UserFacade } from '@/modules/user/facade/user.facade';
import { userRepository } from '@/modules/user/repository/user.repository';
import { createUserRoute } from '@/modules/user/route/user.route';
import { UserService } from '@/modules/user/service/user.service';

const userService = new UserService(userRepository);
const userFacade = new UserFacade(userService);
const userRoute = createUserRoute(userService);

export { userRoute, userFacade };
