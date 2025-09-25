import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto, SignupDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { milliseconds } from 'date-fns';
import { IBasicUserDto } from 'src/users/users.model';
import { UnauthorizedException } from '@nestjs/common';
import { ApiErrors } from 'src/common/constants/errors.constants';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/common/config';
import { Response } from 'express';
import { AUTH_COOKIE_KEY } from 'src/common/constants/app.constants';
import { QueuePublisherService } from 'src/queue-publisher/queue-publisher.service';
import { RegistrationRequestService } from 'src/registrationRequest/registrationRequest.service';
import { EmailTypes, getEmailContent } from 'src/common/utils/email';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private queueService: QueuePublisherService,
    private registrationRequestService: RegistrationRequestService,
  ) {}
  async requestSignup(data: SignupDto) {
    const user = await this.usersService.getUserExists({ email: data.email });
    if (user) {
      throw new ConflictException(ApiErrors.EmailAlreadyExists);
    }
    const { code, expiresAt } =
      await this.registrationRequestService.createOrUpdateRegistrationRequest(
        data,
      );
    const emailContent = getEmailContent({
      type: EmailTypes.registration,
      registrationParams: {
        code,
        username: data.username,
      },
    });
    if (emailContent) {
      this.queueService.sendEmail({
        to: data.email,
        ...emailContent,
      });
    }
    return { expiresAt };
  }
  async confirmSignupRequest({ email, code }: { email: string; code: string }) {
    const { username, password } =
      await this.registrationRequestService.validateRegistrationRequest({
        email,
        code,
      });
    const newUser = await this.usersService.createUser({
      username,
      email,
      password,
    });
    const { id } = newUser.toDto();
    const token = await this.generateJwtToken<IBasicUserDto>({
      id,
      username,
    });
    return { id, username, token };
  }

  async generateJwtToken<T extends object>(payload: T) {
    return this.jwtService.signAsync(payload);
  }

  async validateToken<T extends object>(token: string): Promise<T> {
    try {
      return this.jwtService.verifyAsync<T>(token);
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException(ApiErrors.Unauthorized);
    }
  }
  setCookie(res: Response, token: string) {
    const auth = this.configService.get<Config['auth']>('auth');
    const isLocal = this.configService.get<Config['isLocal']>('isLocal');
    const maxAge = milliseconds({ days: auth?.jwtTokenExpiresInDays });
    res.cookie(AUTH_COOKIE_KEY, token, {
      maxAge,
      httpOnly: true,
      sameSite: 'lax',
      secure: !isLocal,
      signed: true,
    });
  }
  async login(payload: LoginDto) {
    const user = await this.usersService.findUser({
      username: payload.username,
    });
    if (!user || !(await user.isPasswordValid(payload.password))) {
      throw new UnauthorizedException(ApiErrors.InvalidCredentials);
    }
    const { id, username } = user.toDto();
    const token = await this.generateJwtToken<IBasicUserDto>({ id, username });
    return { id, username, token };
  }
}
