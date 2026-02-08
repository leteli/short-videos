import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './models/message.model';
import { TextMessage, TextMessageSchema } from './models/text-message.model';
import { MediaMessage, MediaMessageSchema } from './models/media-message.model';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
        discriminators: [
          {
            name: TextMessage.name,
            schema: TextMessageSchema,
          },
          {
            name: MediaMessage.name,
            schema: MediaMessageSchema,
          },
        ],
      },
    ]),
    ChatsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
