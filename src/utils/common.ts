import crypto from 'crypto';
import Bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from './config';

class CommonService {
  async validateEmail(email: string) {
    // eslint-disable-next-line no-useless-escape
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async hashPassword(password: any) {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(password, config.BCRYPT_SALT, (error: any, passwordHash: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(passwordHash);
        }
      });
    });
  }

  async generateRandomToken(length: number) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, function (error: any, buffer: any) {
        if (error) {
          reject(error);
        } else {
          resolve(buffer.toString('hex'));
        }
      });
    });
  }

  async comparePassword(pw: string, hash: string) {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(pw, hash, function (err: any, res: string) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  async issueToken(payload: object) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, config.JWT_SECRET, { expiresIn: '30d' }, function (error: any, token: string) {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  }
}

export default new CommonService();
