import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { IRequest } from 'src/common/utils/http/types';

@Injectable()
export class ChatAccessGuard implements CanActivate {
  constructor(private readonly chatsService: ChatsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequest>();
    const chatId = request.params.chatId;
    const userId = request.user?._id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const chat = await this.chatsService.userHasAccessToChat({
      chatId,
      userId,
    });
    if (!chat) {
      throw new NotFoundException('Chat not found or no access provided');
    }
    request.chat = chat;
    return true;
  }
}
