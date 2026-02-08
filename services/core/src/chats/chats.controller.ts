import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Req,
  Query,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateGroupChatDto } from './chats.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IRequest } from 'src/common/utils/http/types';
import { UserDocument } from 'src/users/users.model';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/common/pipes/parse-object-id-array.pipe';
import { RabbitMqService } from 'src/rabbitmq/rabbitmq.service';
import { ChatAccessGuard } from './chat.guard';
import { ChatDocument } from './models/chats.model';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private queuePubService: RabbitMqService,
  ) {}

  @Post('/direct')
  @HttpCode(HttpStatus.CREATED)
  public async postDirectChat(
    @Body('participantId', ParseObjectIdPipe)
    participantId: Types.ObjectId,
    @Req() req: IRequest & { user: UserDocument },
  ) {
    const userId = req.user._id;
    const chat = await this.chatsService.createDirectChat({
      userId,
      participantId,
    });
    const populatedChat = await chat.populate<{
      participant1: UserDocument;
      participant2: UserDocument;
    }>('participant1 participant2');

    const chatDtoForPeer = populatedChat.toDtoWithUsers({
      userId: participantId,
    });
    this.queuePubService.handleChatCreated({
      chat: chatDtoForPeer,
    });
    return {
      chat: populatedChat.toDtoWithUsers({ userId }),
    };
  }

  @Post('/group')
  @HttpCode(HttpStatus.CREATED)
  public async postGroupChat(
    @Body() createChatDto: CreateGroupChatDto,
    @Body('participantIds', ParseObjectIdArrayPipe)
    participantIds: Types.ObjectId[],
    @Req() req: IRequest & { user: UserDocument },
  ) {
    return this.chatsService.createGroupChat({
      userId: req.user._id,
      participantIds: participantIds,
      title: createChatDto.title,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getChats(
    @Req() req: IRequest & { user: UserDocument },
    @Query('cursor', ParseObjectIdPipe) cursor?: Types.ObjectId,
    @Query('limit') limit?: number,
  ) {
    return this.chatsService.findAllUserChats({
      userId: req.user._id,
      cursor,
      limit,
    });
  }

  @UseGuards(ChatAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getChat(@Req() req: IRequest & { chat: ChatDocument }) {
    return req.chat;
  }

  @UseGuards(ChatAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteChat(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.chatsService.removeChat(id);
  }
}
