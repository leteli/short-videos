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
}

export interface IUserSearchResponse {
  users: IUser[];
}

export interface IMatchedUsersStore {
  users: IUser[];
  page: number;
}
