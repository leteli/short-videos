import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { SignupDto, ConfirmSignupDto, LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { VerifyAuthGuard } from './auth.guard';
import { IRequest } from 'src/common/utils/http/types';

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
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async postLogin(@Body() payload: LoginDto, @Res() res: Response) {
    const { id, username, token } = await this.authService.login(payload);
    this.authService.setCookie(res, token);
    res.json({ id, username });
  }
  @UseGuards(VerifyAuthGuard)
  @Get('/verify')
  @HttpCode(HttpStatus.OK)
  getVerify(@Req() req: IRequest) {
    return req.user?.toDto();
  }
}
