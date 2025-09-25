import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatTypes } from './models/chats.model';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/users.model';
import { ApiErrors } from 'src/common/constants/errors.constants';
import {
  DirectChat,
  PopulatedDirectChatDocument,
} from './models/direct-chats.model';
import {
  GroupChat,
  PopulatedGroupChatDocument,
} from './models/group-chat.model';
import {
  HAS_MORE_ITEMS_CHECK,
  LIMIT_DEFAULT,
} from 'src/common/constants/search.constants';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(DirectChat.name) private directChatModel: Model<DirectChat>,
    @InjectModel(GroupChat.name) private groupChatModel: Model<GroupChat>,
    private usersService: UsersService,
  ) {}
  async createDirectChat({
    userId,
    participantId,
  }: {
    userId: Types.ObjectId;
    participantId: Types.ObjectId;
  }) {
    if (userId.equals(participantId)) {
      throw new ConflictException(ApiErrors.CannotAddYourselfToChat);
    }
    const participant = await this.usersService.checkUserById(participantId);
    if (!participant) {
      throw new NotFoundException(ApiErrors.UserNotFound);
    }
    const newChat = this.directChatModel.create({
      type: ChatTypes.direct,
      participant1: userId,
      participant2: participantId,
    });
    return newChat;
  }

  async createGroupChat({
    userId,
    participantIds,
    title,
  }: {
    userId: Types.ObjectId;
    participantIds: Types.ObjectId[];
    title?: string;
  }) {
    const users = await this.usersService.findUsersByIds(participantIds, '_id');
    if (participantIds.length > users.length) {
      throw new NotFoundException(ApiErrors.UserNotFound);
    }
    const participants = [userId, ...participantIds];
    return this.groupChatModel.create({
      type: ChatTypes.group,
      title,
      participants,
    });
  }

  async findAllUserChats({
    userId,
    cursor,
    limit = LIMIT_DEFAULT,
  }: {
    userId: Types.ObjectId;
    cursor?: Types.ObjectId;
    limit?: number;
  }) {
    const itemsWithExtra = await this.chatModel
      .find({
        ...(cursor && { _id: { $lt: cursor } }),
        $or: [
          { participant1: userId },
          { participant2: userId },
          { participants: userId },
        ],
      })
      .sort({ updatedAt: -1 })
      .limit(limit + HAS_MORE_ITEMS_CHECK);
    const chats = itemsWithExtra.slice(0, limit);
    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        if (chat.type === ChatTypes.direct) {
          const populated = (await chat.populate<{
            participant1: UserDocument;
            participant2: UserDocument;
          }>('participant1 participant2')) as PopulatedDirectChatDocument;

          return populated.toDtoWithUsers({ userId });
        } else if (chat.type === ChatTypes.group) {
          const populated = (await chat.populate<{
            participants: UserDocument[];
          }>('participant1 participant2')) as PopulatedGroupChatDocument;
          return populated.toDtoWithUsers({ userId });
        } else {
          return chat.toBasicDto();
        }
      }),
    );
    return {
      chats: populatedChats,
      cursor: chats.at(-1)?._id?.toString(),
      hasMore: itemsWithExtra.length > limit,
    };
  }

  async findChatById(id: Types.ObjectId, select?: string) {
    return this.chatModel.findById(id, select).lean();
  }

  async removeChat(_id: Types.ObjectId) {
    return this.chatModel.deleteOne({ _id });
  }
}
