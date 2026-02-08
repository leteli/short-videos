import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ChatTypes } from '../../chats/models/chats.model';

export enum MessageTypes {
  text = 'text',
  media = 'media',
}

export interface IBasicMessageDto {
  id: string;
  chatId: string;
  chatType: ChatTypes;

  senderId: string;

  type: MessageTypes;

  createdAt: Date;
  updatedAt: Date;
}

export interface ITextMessageDto extends IBasicMessageDto {
  type: MessageTypes.text;
  text: string;
}

@Schema({
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
  versionKey: false,
  discriminatorKey: 'type',
})
export class Message {
  _id: Types.ObjectId;
  type: MessageTypes;

  @Prop({
    required: true,
    ref: 'Chat',
    type: SchemaTypes.ObjectId,
    index: true,
  })
  chatId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(ChatTypes), index: true })
  chatType: ChatTypes;

  @Prop({
    required: true,
    ref: 'User',
    type: SchemaTypes.ObjectId,
    index: true,
  })
  senderId: Types.ObjectId;

  @Prop({
    required: true,
  })
  clientMessageId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  toBasicDto(): IBasicMessageDto {
    return {
      id: this._id.toString(),
      chatId: this.chatId.toString(),
      chatType: this.chatType,
      senderId: this.senderId.toString(),
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ chatId: 1, senderId: 1, createdAt: -1 });
MessageSchema.index({ chatType: 1, chatId: 1, createdAt: -1 });

MessageSchema.loadClass(Message);
