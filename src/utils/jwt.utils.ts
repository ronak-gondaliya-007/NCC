import jwt from 'jsonwebtoken';
import config from './config';

class JwtUtil {
  verify(token: string): any {
    return jwt.verify(token, config.JWT.JWT_SECRET);
  }

  sign(data: object) {
    return jwt.sign(data, config.JWT.JWT_SECRET, { expiresIn: config.JWT.JWT_EXPIRES_IN });
  }
}

export default new JwtUtil();
