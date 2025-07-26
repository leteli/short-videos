import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SignupDto, ConfirmSignupDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup/confirm')
  @HttpCode(HttpStatus.CREATED)
  async postConfirmSignup(
    @Body() payload: ConfirmSignupDto,
    @Res() res: Response,
  ) {
    const { id, username, token } =
      await this.authService.confirmSignupRequest(payload);
    this.authService.setCookie(res, token);
    res.json({ id, username });
  }
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async postSignup(@Body() payload: SignupDto) {
    return this.authService.requestSignup(payload);
  }
}
