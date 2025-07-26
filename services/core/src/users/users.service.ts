import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser } from './users.model';
import { SignupDto } from 'src/auth/auth.dto';
import { ApiErrors } from 'src/common/constants/errors.constants';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(createUserDto: SignupDto) {
    const user = await this.findUser({ email: createUserDto.email });
    if (user) {
      throw new ConflictException(ApiErrors.EmailAlreadyExists);
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }
  async findUserById(id: string) {
    return this.userModel.findById(id);
  }

  async findUser(options: Partial<Pick<IUser, 'email' | 'username'>>) {
    return this.userModel.findOne(options);
  }
}
