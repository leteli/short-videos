import { IUser } from "../users/types";

export interface IChatsStore {
    chats: IChatInfo[];
    hasMore: boolean;
    cursor?: string | null; 
}
type IChatInfo = IDirectChatInfo | IGroupChatInfo;

export interface IDirectChatInfo {
    id: string;
    type: ChatTypes.direct
    peer: IUser;
    updatedAt: Date;
}

export interface IGroupChatInfo {
    id: string;
    type: ChatTypes.group;
    title?: string;
    participants: IUser[];
    createdAt: number;
}

export interface IDirectChatStore {
    chat: IDirectChatInfo | null;
}
export interface IGroupChatStore {
    chat: IGroupChatInfo | null;
}

export enum ChatTypes {
  direct = 'direct',
  group = 'group',
}

export interface ICreateDirectChatRequest {
    participantId: string;
}
export interface ICreateGroupChatRequest {
    participantIds: string[];
    title?: string;
}

export interface ICreateDirectChatResponse {
    chat: IDirectChatInfo;
}
export interface ICreateGroupChatResponse {
    chat: IGroupChatInfo;
}

export type IGetChatsParams = {
    cursor?: string | null;
    limit?: number;
    searchQuery?: string;
};

export interface IDeletChatResponse {
    id: string;
    cursor?: string | null;
    hasMore: boolean; 
}
