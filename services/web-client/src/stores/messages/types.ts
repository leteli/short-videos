import { ChatTypes } from "../chats/types";

export enum MessageStatus {
  Processing = 'processing',
  Sent = 'sent',
  Failed = 'failed',
}

export interface IMessage {
  _id?: string;
  clientMessageId: string;
  chatId: string;
  chatType: ChatTypes;

  senderId: string;

  type: MessageTypes;
  text?: string;
  media?: IMediaMetadata;
  status: MessageStatus;

  createdAt?: Date;
  createdAtLocal?: Date;
  updatedAt?: Date;
  isRead?: boolean;
}

export interface IMessagesStore {
  messages: IMessage[];
  hasMore: boolean;
  cursor?: string;
}

export enum MessageTypes {
  text = 'text',
  media = 'media',
}

export enum MediaTypes {
  image = 'image',
  audio = 'audio',
  video = 'video',
}

export interface IMediaMetadata {
  url: string;
  mime?: string;
  size?: number;
  originalName?: string;
  width?: number;
  height?: number;
  durationMs?: number;
}

export interface GetMessagesQuery {
  cursor?: string;
  limit?: number;
}

export interface GetMessagesResponse {
  messages: IMessage[];
  hasMore: boolean;
  cursor: string | undefined;
}

export interface SendMessagePayload {
  text?: string;
  media?: IMediaMetadata;
}

export interface ReceiveMessagePayload {
  message: IMessage;
}

export interface SendMessageResult {
  message: IMessage;
  error?: string;
  ok: boolean;
}
