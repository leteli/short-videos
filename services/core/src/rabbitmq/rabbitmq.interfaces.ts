import { IDirectChatDtoWithUser } from 'src/chats/models/direct-chats.model';
import { MessageTypes } from 'src/messages/models/message.model';

export interface IMediaMetadata {
  url: string;
  mime?: string;
  size?: number;
  originalName?: string;
  width?: number;
  height?: number;
  durationMs?: number;
}

export enum MessageStatus {
  Processing = 'processing',
  Sent = 'sent',
  Failed = 'failed',
}

export interface MessageSentPayload {
  clientMessageId: string;
  chatId: string;
  senderId: string;
  text?: string;
  media?: IMediaMetadata;
  type: MessageTypes;
  status: MessageStatus;
  createdAtLocal: Date;
}

export interface ICreateMessage {
  message: MessageSentPayload;
}

export interface ISendEmailPayload {
  to: string;
  subject: string;
  text: string;
}

export interface IChatCreatedPayload {
  chat: IDirectChatDtoWithUser;
}
