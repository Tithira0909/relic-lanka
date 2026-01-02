import jwt from 'jsonwebtoken';
import { ENV } from './env';

interface TokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};
