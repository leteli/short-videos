import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { IUserDto } from 'src/users/users.model';
import {
  AUTH_COOKIE_KEY,
  AUTH_TOKEN_HEADER,
} from 'src/common/constants/app.constants';
import { ApiErrors } from 'src/common/constants/errors.constants';
import { IRequest, IVerifyResponse } from 'src/common/utils/http/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequest>();

    const jwtToken = this.extractToken(request);

    const { id } = await this.authService.validateToken<IUserDto>(jwtToken);
    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new UnauthorizedException(ApiErrors.Unauthorized);
    }
    request.user = user;
    return true;
  }

  protected extractToken(request: IRequest): string {
    const { signedCookies } = request;
    const token = signedCookies?.[AUTH_COOKIE_KEY];
    if (!token) {
      throw new UnauthorizedException(ApiErrors.Unauthorized);
    }
    return token;
  }
}

@Injectable()
export class VerifyAuthGuard extends AuthGuard {
  constructor(authService: AuthService, usersService: UsersService) {
    super(authService, usersService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);
    if (result) {
      const request = context.switchToHttp().getRequest<IRequest>();
      const response = context.switchToHttp().getResponse<IVerifyResponse>();
      const jwtToken = this.extractToken(request);

      response.setHeader(AUTH_TOKEN_HEADER, jwtToken);
      response.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate',
      );
      response.setHeader('Pragma', 'no-cache');
    }
    return result;
  }
}
