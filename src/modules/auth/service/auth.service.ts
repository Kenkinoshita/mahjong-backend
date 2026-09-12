import type { RegisterInputDto, RegisterOutputDto } from '@/modules/auth/service/dto/register.dto';
import { hashPassword } from '@/shared/password/hashPassword';
import { ApiError } from '@/shared/errors/apiError';
import type { LoginInputDto, LoginOutputDto } from '@/modules/auth/service/dto/login.dto';
import type { UserFacade } from '@/modules/user/facade/user.facade';
import { AuthTokenManager } from '@/shared/token/auth-token-manager';
import { verifyPassword } from '@/shared/password/verifyPassword';

export class AuthService {
  constructor(private readonly userFacade: UserFacade) {}

  async register(input: RegisterInputDto): Promise<RegisterOutputDto> {
    const hashedPassword = await hashPassword(input.password);
    const newUser = await this.userFacade.createUser({ name: input.name, email: input.email, hashedPassword });
    const tokenManager = new AuthTokenManager();
    const token = await tokenManager.generateSignedAccessTokens({ userId: newUser.id });
    return { accessToken: token, userId: newUser.id };
  }

  async login(input: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.userFacade.getUserForLogin({ email: input.email });
    if (!user) throw ApiError.unauthorized('Invalid credentials');

    const isSamePassword = await verifyPassword(user.hashedPassword, input.password);
    if (!isSamePassword) throw ApiError.unauthorized('Invalid credentials');

    const tokenManager = new AuthTokenManager();
    const token = await tokenManager.generateSignedAccessTokens({ userId: user.id });

    return { accessToken: token, userId: user.id };
  }
}
