import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ChatTypes {
  direct = 'direct',
  group = 'group',
}

export interface IChat {
  type: ChatTypes;
  participants: Types.ObjectId[];
}

export interface IBasicChatDto {
  id: string;
  type: ChatTypes;
}
@Schema({
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
  versionKey: false,
  discriminatorKey: 'type',
})
export class Chat {
  _id: Types.ObjectId;
  type: ChatTypes;

  toBasicDto(): IBasicChatDto {
    return {
      id: this._id.toString(),
      type: this.type,
    };
  }
}

export type ChatDocument = HydratedDocument<Chat>;

export const ChatSchema = SchemaFactory.createForClass(Chat);
ChatSchema.index({ createdAt: -1 });
ChatSchema.loadClass(Chat);
