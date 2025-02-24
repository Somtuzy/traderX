import { Request, Response, NextFunction } from 'express';
import {
  sendResponse,
  decodeUser,
  extractHeader,
  extractCookie
} from '@utils';
import { MESSAGES } from '@configs';
import { IUser } from '@interfaces';

export default async (req: Request, res: Response, next: NextFunction) => {
  const accessTokenHeader = await extractHeader(req, 'Authorization')
  const accessTokenCookie = await extractCookie(req, "accessToken")

  const accessToken = accessTokenHeader || accessTokenCookie

  if (!accessToken) {
    return sendResponse(res, 403, false, MESSAGES.NOT_LOGGED_IN)
  }

  const user = await decodeUser(accessToken)

  req.user = user.toJSON() as unknown as IUser;
  console.log({ authenticatedUser: req.user });

  next();
}