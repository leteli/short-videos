import { Request, Response } from 'express';
import { ChatDocument } from 'src/chats/models/chats.model';
import { UserDocument } from 'src/users/users.model';

export interface IRequest extends Request {
  user?: UserDocument;
  signedCookies: Record<string, string> | undefined;
  chat?: ChatDocument;
}
export interface IVerifyResponse extends Response {
  token: string;
}
