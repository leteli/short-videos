import { joinUrl } from "@/utils/helpers/joinUrl";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';


const API_VERSION = `${API_URL}/api/v1`;

const API_AUTH = `${API_VERSION}/auth`;
export const API_SIGNUP = `${API_AUTH}/signup`;
export const API_SIGNUP_CONFIRM = `${API_SIGNUP}/confirm`
export const API_LOGIN = `${API_AUTH}/login`;

export const API_USERS = `${API_VERSION}/users`;
export const API_VERIFY_USERNAME = `${API_USERS}/verify-username`;

export const API_CHATS = `${API_VERSION}/chats`;
export const API_DIRECT_CHATS = `${API_CHATS}/direct`;
export const API_GROUP_CHATS = `${API_CHATS}/group`;

export const API_CHAT = (id: string) => joinUrl(API_CHATS, id);

export enum HttpRequestMethods {
    Get = 'get',
    Delete = 'delete',
    Post = 'post',
    Put = 'put',
}

export const AUTH_COOKIE_KEY = 'auth';
