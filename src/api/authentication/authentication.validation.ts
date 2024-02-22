import Joi from 'joi';
import { LOGIN_TYPE, USER_ROLE } from '../../utils/const';

export const signup = Joi.object({
  role: Joi.string().valid(USER_ROLE.USER, USER_ROLE.VENDOR).required(),
  type: Joi.string().valid(...Object.values(LOGIN_TYPE)).required(),
  email: Joi.when('type', {
    is: 'Email',
    then: Joi.string().email().required(),
    otherwise: Joi.forbidden(),
  }),
  mobile: Joi.when('type', {
    is: 'Email',
    then: Joi.forbidden(),
    otherwise: Joi.string(),
  }),
  password: Joi.when('type', {
    is: 'Email',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  confirmPassword: Joi.when('type', {
    is: 'Email',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  isAcceptPrivacyPolicy: Joi.when('type', {
    is: 'Email',
    then: Joi.boolean().required(),
    otherwise: Joi.forbidden(),
  }),
  referralCode: Joi.when('type', {
    is: 'Mobile',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden(),
  }),
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
  emailOrMobile: Joi.string().required(),
  password: Joi.string().required(),
});

export const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});