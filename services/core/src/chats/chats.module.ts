import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './models/chats.model';
import { UsersModule } from 'src/users/users.module';
import { DirectChat, DirectChatSchema } from './models/direct-chats.model';
import { GroupChat, GroupChatSchema } from './models/group-chat.model';
import { ChatTypes } from './models/chats.model';
import { ChatAccessGuard } from './chat.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
        discriminators: [
          {
            name: DirectChat.name,
            schema: DirectChatSchema,
            value: ChatTypes.direct,
          },
          {
            name: GroupChat.name,
            schema: GroupChatSchema,
            value: ChatTypes.group,
          },
        ],
      },
    ]),
    UsersModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatAccessGuard],
  exports: [ChatsService, ChatAccessGuard],
})
export class ChatsModule {}
