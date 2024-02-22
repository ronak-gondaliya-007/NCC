import Joi from 'joi';
import { LOGIN_TYPE, USER_ROLE } from '../../utils/const';

export const addPersonalDetail = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile:Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  isAcceptPrivacyPolicy: Joi.boolean().required()
});