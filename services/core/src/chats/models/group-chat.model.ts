import { Chat, IBasicChatDto } from './chats.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, HydratedDocument } from 'mongoose';
import { IBasicUserDto, UserDocument } from 'src/users/users.model';
import { Overwrite } from 'src/common/utils/types';
import { ChatTypes } from './chats.model';

export interface IGroupChatDto extends IBasicChatDto {
  title: string;
  participants: string[];
}
export interface IGroupChatDtoWithUser extends IBasicChatDto {
  title: string;
  participants: IBasicUserDto[];
}
@Schema()
export class GroupChat extends Chat {
  @Prop()
  title: string;

  @Prop({ required: true, ref: 'User', type: [SchemaTypes.ObjectId] })
  participants: Types.ObjectId[];

  toDto({ userId }: { userId: Types.ObjectId }): IGroupChatDto {
    return {
      ...super.toBasicDto(),
      title: this.title,
      participants: this.participants
        .filter((p) => !p.equals(userId))
        .map((p) => p.toString()), // TODO: PAGINATION
    };
  }

  toDtoWithUsers(
    this: PopulatedGroupChatDocument,
    { userId }: { userId: Types.ObjectId },
  ): IGroupChatDtoWithUser {
    return {
      ...super.toBasicDto(),
      title: this.title,
      participants: this.participants
        .filter((p) => !p._id.equals(userId))
        .map((p) => p.toDto()),
    };
  }
}

export type GroupChatDocument = HydratedDocument<GroupChat>;
export type PopulatedGroupChatDocument = Overwrite<
  GroupChatDocument,
  { participants: UserDocument[] }
>;
export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);
GroupChatSchema.loadClass(GroupChat);

GroupChatSchema.index(
  { type: 1, participants: 1, updatedAt: -1 },
  {
    partialFilterExpression: { type: ChatTypes.group },
  },
);
GroupChatSchema.index(
  { type: 1, participants: 1, name: 1 },
  {
    partialFilterExpression: { type: ChatTypes.group },
  },
);
