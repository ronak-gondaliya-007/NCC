import dotenv from "dotenv";
import * as path from 'path';

// Determine the path to the environment file
const envFilePath = process.env.ENV_FILE
  ? path.resolve(process.cwd(), process.env.ENV_FILE)
  : path.resolve(process.cwd(), '.env');

dotenv.config({ path: envFilePath });

export default {
  MONGODB: {
    URL: String(process.env.MONGOURI),
    NAME: String(process.env.MONGODBNAME),
  },
  SERVER: {
    ENVIRONMENT: String(process.env.ENVIRONMENT),
    PORT: Number(process.env.PORT),
  },
  SSL: {
    KEY: String(process.env.KEY),
    CERTIFICATE: String(process.env.CERTIFICATE),
  },
  CRYPTO: {
    RANDOM_TOKEN: Number(process.env.RANDOM_TOKEN),
    CRYPTO_PRIVATE_KEY: String(process.env.CRYPTO_PRIVATE_KEY),
  },
  NODEMAILER: {
    EMAIL: String(process.env.EMAIL),
    PASSWORD: String(process.env.PASSWORD),
  },
  BCRYPT_SALT:  Number(process.env.BCRYPT_SALT),
  PRIVATE_KEY: String(process.env.PRIVATE_KEY),
  JWT:{
    JWT_SECRET: String(process.env.JWT_SECRET),
    JWT_EXPIRES_IN: String(process.env.JWT_EXPIRES_IN),
  },
  HOST: process.env.HOST,
  OAUTH:{
    CLIENT_ID: String(process.env.CLIENT_ID),
    CLIENT_SECRET: String(process.env.CLIENT_SECRET),
    AUTHENTICATION_URL: String(process.env.AUTHENTICATION_URL),
    TOKEN_URL: String(process.env.TOKEN_URL),
  },
};
