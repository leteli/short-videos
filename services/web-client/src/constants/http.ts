export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const API_VERSION = `${API_URL}/api/v1`;

// auth
const API_AUTH = `${API_VERSION}/auth`;
export const API_SIGNUP = `${API_AUTH}/signup`;
export const API_SIGNUP_CONFIRM = `${API_SIGNUP}/confirm`

export const API_LOGIN = `${API_AUTH}/login`;

// users
const API_USERS = `${API_VERSION}/users`;
export const API_VERIFY_USERNAME = `${API_USERS}/verify-username`;

export enum HttpRequestMethods {
    Get = 'get',
    Delete = 'delete',
    Post = 'post',
    Put = 'put',
}

export const AUTH_COOKIE_KEY = 'auth';
