import { Router } from 'express';
const router = Router();
import AuthenticationService from '../authentication/authentication.service';
import asyncHandler from './../../middleware/asyncHandler.middleware';
import validate from './../../middleware/validator.middleware';
import { requestResetPassword, resetPassword, signup, changePassword, login, resendOTP, verifyOTP, updateUserAppLanguage } from './authentication.validation';
import auth from './../../middleware/auth.middleware';

router.post(
  '/signup',
  validate('body', signup),
  asyncHandler(AuthenticationService.signup)
);

router.post(
  '/resendOTP',
  validate('body', resendOTP),
  asyncHandler(AuthenticationService.resendOTP)
);

router.post(
  '/verifyOTP',
  validate('body', verifyOTP),
  asyncHandler(AuthenticationService.verifyOTP)
);

router.post(
  '/requestResetPassword',
  validate('body', requestResetPassword),
  asyncHandler(AuthenticationService.requestResetPassword)
);

router.post(
  '/resetPassword',
  validate('body', resetPassword),
  asyncHandler(AuthenticationService.resetPassword)
);

router.post(
  '/login',
  validate('body', login),
  asyncHandler(AuthenticationService.login)
);

router.post(
  '/changePassword',
  auth,
  validate('body', changePassword),
  asyncHandler(AuthenticationService.changePassword)
);

router.post(
  '/update/language',
  auth,
  validate('body', updateUserAppLanguage),
  asyncHandler(AuthenticationService.updateUserAppLanguage)
);

export default router;
