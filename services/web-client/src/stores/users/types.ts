import { FetchItemshModes } from "@/constants/http";

export interface IUser {
    id: string;
    username: string;
}

export interface IVerifyUsername {
  username: string;
}

export interface IUserSearchQuery {
  searchQuery?: string;
  limit?: number;
  page?: number;
  mode?: FetchItemshModes;
}

export interface IUserSearchResponse {
  users: IUser[];
  page: number;
  hasMore: boolean;
}

export interface IMatchedUsersStore {
  users: IUser[];
  page: number;
  hasMore: boolean;
}
