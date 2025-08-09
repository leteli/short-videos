import { Request, Response } from 'express';
import { UserDocument } from 'src/users/users.model';

export interface IRequest extends Request {
  user?: UserDocument;
  signedCookies: Record<string, string> | undefined;
}
export interface IVerifyResponse extends Response {
  token: string;
}
