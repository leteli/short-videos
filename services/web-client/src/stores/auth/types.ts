import { IUser } from "../users/types";

export interface ISignupRequest {
    email: string;
    username: string;
    password: string;
}

export interface ISignupResponse {
    expiresAt: number;
}

export interface IConfirmSignupRequest {
    email: string;
    code: string;
}

export interface IConfirmSignupResponse {
    id: string;
    username: string;
}

export interface IAuthStore {
    user: IUser | null;
}

export interface ILoginRequest {
    username: string;
    password: string;
}

export interface ILoginResponse {
    id: string;
    username: string;
}

export interface IAuthSearchParams {
  searchParams: Promise<IUser>;
}
