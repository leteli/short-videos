import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser, UserDocument } from './users.model';
import { SignupDto } from 'src/auth/auth.dto';
import { ApiErrors } from 'src/common/constants/errors.constants';
import { Types } from 'mongoose';
import { escapeRegExp } from 'src/common/utils/common/regex';
import { SearchUsersQuery } from './users.dto';
import { Chat, ChatTypes } from 'src/chats/models/chats.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}
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
    const extraItemsCount = 1;
    const skip = (page - 1) * limit;
    const [directChatPeers] = await this.getDirectChatPeersForUser(userId);

    const usersWithExtra = await this.userModel
      .find(
        {
          _id: {
            $ne: userId,
            ...(directChatPeers?.ids && { $nin: directChatPeers.ids }),
          },
          ...(searchQuery && {
            usernameLower: {
              $regex: `^${escapeRegExp(searchQuery?.toLowerCase())}`,
            },
          }),
        },
        '_id username',
      )
      .sort({ usernameLower: 1 })
      .skip(skip)
      .limit(limit + extraItemsCount)
      .lean();
    const users = usersWithExtra.slice(0, limit);
    return {
      users: users.slice(0, limit).map(({ _id, username }) => ({
        id: _id.toString(),
        username,
      })),
      page,
      hasMore: usersWithExtra.length > limit,
    };
  }
  withUsernameLower(query: Partial<IUser>) {
    const { username, ...rest } = query;
    const options: Partial<IUser> = rest;
    if (username) {
      options.usernameLower = username.toLowerCase();
    }
    return options;
  }
  async getDirectChatPeersForUser(userId: Types.ObjectId) {
    return this.chatModel.aggregate<{ ids: Types.ObjectId[] }>([
      {
        $match: {
          type: ChatTypes.direct,
          $or: [{ participant1: userId }, { participant2: userId }],
        },
      },
      {
        $project: {
          _id: 0,
          peer: {
            $cond: {
              if: { $eq: ['$participant1', userId] },
              then: '$participant2',
              else: '$participant1',
            },
          },
        },
      },
      { $group: { _id: null, ids: { $addToSet: '$peer' } } },
    ]);
  }
}
