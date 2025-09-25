import {
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiErrors } from 'src/common/constants/errors.constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { IRequest } from 'src/common/utils/http/types';
import { Overwrite } from 'src/common/utils/types';
import { UserDocument } from './users.model';
import { SearchUsersQuery } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('verify-username')
  async getVerifyUsername(@Query('username') username: string) {
    const user = await this.usersService.getUserExists({ username });
    if (user) {
      throw new ConflictException(ApiErrors.UsernameAlreadyExists);
    }
  }
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getUsers(
    @Query() query: SearchUsersQuery,
    @Req() req: Overwrite<IRequest, { user: UserDocument }>,
  ) {
    return this.usersService.searchUsers({
      ...query,
      userId: req.user._id,
    });
  }
}
