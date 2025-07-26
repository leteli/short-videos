import {
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiErrors } from 'src/common/constants/errors.constants';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('verify-username')
  async getVerifyUsername(@Query('username') username: string) {
    const user = await this.usersService.findUser({ username });
    if (user) {
      throw new ConflictException(ApiErrors.UsernameAlreadyExists);
    }
  }
}
