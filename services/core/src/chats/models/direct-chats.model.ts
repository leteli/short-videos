import { Chat, ChatTypes, IBasicChatDto } from './chats.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, HydratedDocument } from 'mongoose';
import { IBasicUserDto, UserDocument } from 'src/users/users.model';
import { Overwrite } from 'src/common/utils/types';

export interface IDirectChatDto extends IBasicChatDto {
  peer: string;
}
export interface IDirectChatDtoWithUser extends IBasicChatDto {
  peer: IBasicUserDto;
}

@Schema()
export class DirectChat extends Chat {
  @Prop({ required: true, ref: 'User', type: SchemaTypes.ObjectId })
  participant1: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: SchemaTypes.ObjectId })
  participant2: Types.ObjectId;

  getPeerId(userId: Types.ObjectId): Types.ObjectId {
    if (this.participant1.equals(userId)) {
      return this.participant2;
    } else if (this.participant2.equals(userId)) {
      return this.participant1;
    }
    throw new Error('User is not a participant of this chat');
  }
  getPeerDoc(
    this: PopulatedDirectChatDocument,
    userId: Types.ObjectId,
  ): UserDocument {
    if (this.participant1._id.equals(userId)) {
      return this.participant2;
    } else if (this.participant2._id.equals(userId)) {
      return this.participant1;
    }
    throw new Error('User is not a participant of this chat');
  }

  toDto({ userId }: { userId: Types.ObjectId }): IDirectChatDto {
    const peerId = this.getPeerId(userId);
    return {
      ...super.toBasicDto(),
      peer: peerId.toString(),
    };
  }

  toDtoWithUsers(
    this: PopulatedDirectChatDocument,
    { userId }: { userId: Types.ObjectId },
  ): IDirectChatDtoWithUser {
    const peer = this.getPeerDoc(userId);
    return {
      ...super.toBasicDto(),
      peer: peer.toDto(),
    };
  }
}

export type DirectChatDocument = HydratedDocument<DirectChat>;
export type PopulatedDirectChatDocument = Overwrite<
  DirectChatDocument,
  { participant1: UserDocument; participant2: UserDocument }
>;

export const DirectChatSchema = SchemaFactory.createForClass(DirectChat);
DirectChatSchema.loadClass(DirectChat);

DirectChatSchema.index(
  { type: 1, participant1: 1, participant2: 1 },
  { unique: true, partialFilterExpression: { type: ChatTypes.direct } },
);

DirectChatSchema.pre('validate', function (next) {
  const a = this.participant1,
    b = this.participant2;
  if (!a || !b) {
    return next(new Error('Direct chat requires two participants'));
  }
  if (a.equals(b)) {
    return next(new Error('Participants must differ'));
  }
  if (String(a) <= String(b)) {
    this.participant1 = a;
    this.participant2 = b;
  } else {
    this.participant1 = b;
    this.participant2 = a;
  }
  next();
});
