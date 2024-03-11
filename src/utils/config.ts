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
  GOOGLE_OAUTH:{
    CLIENT_ID: String(process.env.G_CLIENT_ID),
    CLIENT_SECRET: String(process.env.G_CLIENT_SECRET),
    AUTHENTICATION_URL: String(process.env.G_AUTHENTICATION_URL),
    TOKEN_URL: String(process.env.G_TOKEN_URL),
    REDIRECT_URL: String(process.env.G_REDIRECT_URL),
  },
  FACEBOOK_OAUTH:{
    CLIENT_ID: String(process.env.F_CLIENT_ID),
    CLIENT_SECRET: String(process.env.F_CLIENT_SECRET),
    REDIRECT_URL: String(process.env.F_REDIRECT_URL),
  },
  APPLE_OAUTH:{
    CLIENT_ID: String(process.env.A_CLIENT_ID),
    TEAM_ID: String(process.env.A_TEAM_ID),
    KEY_ID: String(process.env.A_KEY_ID),
    PRIVATE_KEY_PATH: String(process.env.A_KEY_PATH),
    REDIRECT_URL: String(process.env.A_REDIRECT_URL),
  },
  AWS: {
    S3_URL: String(process.env.S3_URL),
    S3_BUCKET_URL: String(process.env.S3_BUCKET_URL),
    ACCESS_KEY: String(process.env.ACCESS_KEY),
    SECRET_KEY: String(process.env.SECRET_KEY),
    REGION: String(process.env.REGION),
  },
  DOCUMENT_SIZE: {
    PROFILE: Number(process.env.PROFILE_SIZE),
    COVER: Number(process.env.COVER_SIZE)
  },
  DOCUMENT:{
    PROFILE: process.env.PROFILE.split(','),
    COVER: process.env.COVER.split(',')
  }
};
