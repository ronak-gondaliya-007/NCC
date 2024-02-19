import Joi from 'joi';
import { USER_ROLE } from '../../utils/const';

export const signup = Joi.object({
  role: Joi.string().valid(USER_ROLE.USER,USER_ROLE.VENDOR).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  country: Joi.string().required(),
  isAcceptPrivacyPolicy: Joi.boolean().required(),
});

export const requestResetPassword = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPassword = Joi.object({
  emailToken: Joi.string().required(),
  email: Joi.string().email().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});