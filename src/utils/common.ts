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

  async validateMobileNumber(mobile: string) {
    // eslint-disable-next-line no-useless-escape
    const re =
    /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
    return re.test(String(mobile));
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
      jwt.sign(payload, config.JWT.JWT_SECRET, { expiresIn: config.JWT.JWT_EXPIRES_IN }, function (error: any, token: string) {
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
