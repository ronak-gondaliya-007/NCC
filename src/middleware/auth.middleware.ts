import { Response, NextFunction } from 'express';
import jwt from '../utils/jwt.utils';

async function auth(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.headers['Authorization'] || req.headers['authorization'];
    
    // const decryptToken = await middleaware.decryptAuthData(token);

    req.user = await jwt.verify(token?.toString());
    next();
  } catch (error) {
    res.status(401).send('Unauthorized!');
  }
}
export default auth;
