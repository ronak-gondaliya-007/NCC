import Joi from 'joi';
import { LOGIN_TYPE, USER_ROLE } from '../../utils/const';

export const signup = Joi.object({
  role: Joi.string().valid(USER_ROLE.USER, USER_ROLE.VENDOR).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  isAcceptPrivacyPolicy: Joi.boolean().required(),
});

export const resendOTP = Joi.object({
  emailOrMobile: Joi.string().required(),
});

export const verifyOTP = Joi.object({
  emailOrMobile: Joi.string().required(),
  otp: Joi.number().required(),
});

export const requestResetPassword = Joi.object({
  emailOrMobile: Joi.string().required(),
});

export const resetPassword = Joi.object({
  emailOrMobile: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

export const login = Joi.object({
  type: Joi.string().valid(...Object.values(LOGIN_TYPE)).required(),
  emailOrMobile: Joi.string().required(),
  password: Joi.string().required(),
});

export const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

export const updateUserAppLanguage = Joi.object({
  language: Joi.string().required(),
});