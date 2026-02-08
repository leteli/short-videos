import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message, MessageTypes, IBasicMessageDto } from './message.model';

export enum MediaTypes {
  image = 'image',
  audio = 'audio',
  video = 'video',
}

export class MediaMetadata {
  @Prop({ required: true })
  url: string;

  @Prop()
  mime?: string;

  @Prop()
  size?: number;

  @Prop()
  originalName?: string;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop()
  durationMs?: number;
}

export interface IMediaMessageDto extends IBasicMessageDto {
  type: MessageTypes.media;
  media: MediaMetadata;
}

@Schema()
export class MediaMessage extends Message {
  @Prop({ required: true, type: MediaMetadata })
  media: MediaMetadata;

  toDto(): IMediaMessageDto {
    return {
      ...super.toBasicDto(),
      type: MessageTypes.media,
      media: this.media,
    };
  }
}

export type MediaMessageDocument = HydratedDocument<MediaMessage>;
export const MediaMessageSchema = SchemaFactory.createForClass(MediaMessage);
MediaMessageSchema.loadClass(MediaMessage);
