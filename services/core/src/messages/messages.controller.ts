import {
  Controller,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MessagesService } from './messages.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { GetChatMessagesQueryDto, UpdateMessageDto } from './messages.dto';
import { ChatAccessGuard } from 'src/chats/chat.guard';

@UseGuards(AuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(ChatAccessGuard)
  @Get('/:chatId')
  @HttpCode(HttpStatus.OK)
  async getChatMessages(
    @Param('chatId', ParseObjectIdPipe) chatId: Types.ObjectId,
    @Query() query: GetChatMessagesQueryDto,
  ) {
    const res = await this.messagesService.findChatMessages(chatId, query);
    return res;
  }

  @Put('/:messageId')
  @HttpCode(HttpStatus.OK)
  async editMessage(
    @Param('messageId', ParseObjectIdPipe) messageId: Types.ObjectId,
    @Body() data: UpdateMessageDto,
  ) {
    return this.messagesService.editMessage(messageId, data);
  }

  @Delete('/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(
    @Param('messageId', ParseObjectIdPipe) messageId: Types.ObjectId,
  ) {
    return this.messagesService.deleteMessage(messageId);
  }
}
