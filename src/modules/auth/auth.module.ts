import { AuthService } from '@/modules/auth/service/auth.service';
import { createAuthRoute } from '@/modules/auth/route/auth.route';
import { userFacade } from '@/modules/user/user.module';

const authService = new AuthService(userFacade);
const authRoute = createAuthRoute(authService);

export { authRoute };
