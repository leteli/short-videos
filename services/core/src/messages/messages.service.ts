import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { Message, MessageTypes } from './models/message.model';
import { GetChatMessagesQueryDto, UpdateMessageDto } from './messages.dto';
import { ICreateMessage } from 'src/rabbitmq/rabbitmq.interfaces';
import {
  MESSAGES_LIMIT_MAX,
  HAS_MORE_ITEMS_CHECK,
} from 'src/common/constants/search.constants';
import { HandlerStatus } from 'src/common/utils/types';
import { TextMessage } from './models/text-message.model';
import { MediaMessage } from './models/media-message.model';
import { ChatsService } from 'src/chats/chats.service';
import { toObjectId } from 'src/common/utils/mongo/toObjectId';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(TextMessage.name)
    private readonly textMessageModel: Model<TextMessage>,
    @InjectModel(MediaMessage.name)
    private readonly mediaMessageModel: Model<MediaMessage>,
    private readonly chatsService: ChatsService,
  ) {}

  findChatMessages = async (
    chatId: Types.ObjectId,
    query: GetChatMessagesQueryDto,
  ) => {
    const filter: FilterQuery<Partial<Message>> = { chatId };
    if (query.cursor) {
      filter.createdAt = { $lt: query.cursor };
    }
    const limit = query.limit || MESSAGES_LIMIT_MAX;
    const messagesWithExtra = await this.messageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + HAS_MORE_ITEMS_CHECK)
      .lean();
    const messages = messagesWithExtra.slice(0, limit);
    return {
      messages,
      hasMore: messagesWithExtra.length > limit,
      cursor: messages.at(-1)?.createdAt?.toString(),
    };
  };

  createMessage = async ({ message }: ICreateMessage) => {
    try {
      const hasAccess = await this.chatsService.userHasAccessToChat({
        chatId: toObjectId(message.chatId),
        userId: toObjectId(message.senderId),
      });
      if (!hasAccess) {
        throw new NotFoundException('Chat not found');
      }
      const { type, ...data } = message;

      const Message =
        type === MessageTypes.text
          ? this.textMessageModel
          : this.mediaMessageModel;
      const newMessage = new Message({
        ...data,
      });
      const savedMessage = await newMessage.save();
      return {
        message: savedMessage?.toObject(),
        status: HandlerStatus.Success,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        status: HandlerStatus.Failed,
        message,
      };
    }
  };

  editMessage = async (
    messageId: Types.ObjectId,
    updateMessageDto: UpdateMessageDto,
  ) => {
    const updatedMessage = await this.messageModel.findByIdAndUpdate(
      messageId,
      updateMessageDto,
      { new: true },
    );
    return updatedMessage;
  };

  deleteMessage = async (messageId: Types.ObjectId) => {
    await this.messageModel.findByIdAndDelete(messageId);
  };
}
