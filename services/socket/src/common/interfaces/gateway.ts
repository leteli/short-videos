export interface IMediaMetadata {
  url: string;
  mime?: string;
  size?: number;
  originalName?: string;
  width?: number;
  height?: number;
  durationMs?: number;
}

export interface MessageSentPayload {
  clientMessageId: string;
  chatId: string;
  senderId: string;
  text?: string;
  media?: IMediaMetadata;
  status: MessageStatus;
  createdAtLocal: Date;
}

export enum MessageTypes {
  text = 'text',
  media = 'media',
}

export enum MessageStatus {
  Processing = 'processing',
  Sent = 'sent',
  Failed = 'failed',
}

export interface IMessage {
  id?: string;
  clientMessageId: string;
  chatId: string;

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

export interface IUserJwtPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

export interface IChatJwtPayload {
  chatId: string;
  senderId: string;
}

export interface ICreateMessage {
  message: MessageSentPayload;
}

export enum HandlerStatus {
  Success = 'Success',
  Failed = 'Failed',
}

export interface ICreateMessageResponse {
  message?: IMessage;
  status: HandlerStatus;
  error?: string;
}

export enum ChatTypes {
  direct = 'direct',
  group = 'group',
}

export interface IBasicChatDto {
  id: string;
  type: ChatTypes;
}

export interface IBasicUserDto {
  id: string;
  username: string;
}

export interface IDirectChatDtoWithUser extends IBasicChatDto {
  userId: string;
  peer: IBasicUserDto;
}

export interface IChatCreatedPayload {
  chat: IDirectChatDtoWithUser;
}
