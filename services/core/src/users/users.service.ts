import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser, UserDocument } from './users.model';
import { SignupDto } from 'src/auth/auth.dto';
import { ApiErrors } from 'src/common/constants/errors.constants';
import { Types } from 'mongoose';
import { escapeRegExp } from 'src/common/utils/common/regex';
import { SearchUsersQuery } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(createUserDto: SignupDto) {
    const user = await this.getUserExists({ email: createUserDto.email });
    if (user) {
      throw new ConflictException(ApiErrors.EmailAlreadyExists);
    }
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }
  async findUserById(
    id: string | Types.ObjectId,
  ): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
  async checkUserById(id: string | Types.ObjectId) {
    return this.userModel.exists({ _id: id });
  }

  async findUser(
    query: Partial<Pick<IUser, 'email' | 'username'>>,
    select?: string,
  ) {
    const options = this.withUsernameLower(query);
    return this.userModel.findOne(options, select);
  }
  async getUserExists(query: Partial<Pick<IUser, 'email' | 'username'>>) {
    const options = this.withUsernameLower(query);
    return this.userModel.exists(options);
  }

  async findUsersByIds(ids: Types.ObjectId[], select: string) {
    return this.userModel.find({ _id: { $in: ids } }, select).lean();
  }

  async searchUsers({
    searchQuery,
    limit,
    page,
    userId,
  }: SearchUsersQuery & {
    userId: Types.ObjectId;
  }) {
    const skip = (page - 1) * limit;
    const users = await this.userModel
      .find(
        {
          _id: { $ne: userId },
          ...(searchQuery && {
            usernameLower: {
              $regex: `^${escapeRegExp(searchQuery?.toLowerCase())}`,
            },
          }),
        },
        '_id username',
      )
      .sort({ usernameLower: 1 })
      .collation({ locale: 'en', strength: 2 })
      .skip(skip)
      .limit(limit)
      .lean();
    return users.map(({ _id, username }) => ({ id: _id.toString(), username }));
  }
  withUsernameLower(query: Partial<IUser>) {
    const { username, ...rest } = query;
    const options: Partial<IUser> = rest;
    if (username) {
      options.usernameLower = username.toLowerCase();
    }
    return options;
  }
}
