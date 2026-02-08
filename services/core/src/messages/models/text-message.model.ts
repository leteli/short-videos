import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message, MessageTypes, IBasicMessageDto } from './message.model';
import { MAX_TEXT_MESSAGE_LENGTH } from '../../common/constants/validation.constants';

export interface ITextMessageDto extends IBasicMessageDto {
  type: MessageTypes.text;
  text: string;
}

@Schema()
export class TextMessage extends Message {
  @Prop({ required: true, trim: true, maxlength: MAX_TEXT_MESSAGE_LENGTH })
  text: string;

  toDto(): ITextMessageDto {
    return {
      ...super.toBasicDto(),
      type: MessageTypes.text,
      text: this.text,
    };
  }
}

export type TextMessageDocument = HydratedDocument<TextMessage>;
export const TextMessageSchema = SchemaFactory.createForClass(TextMessage);
TextMessageSchema.loadClass(TextMessage);
