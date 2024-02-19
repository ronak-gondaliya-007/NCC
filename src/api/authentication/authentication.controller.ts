import { Router } from 'express';
const router = Router();
import AuthenticationService from '../authentication/authentication.service';
import asyncHandler from './../../middleware/asyncHandler.middleware';
import validate from './../../middleware/validator.middleware';
import { requestResetPassword, resetPassword, signup, changePassword, login } from './authentication.validation';

router.post(
  '/signup',
  validate('body', signup),
  asyncHandler(AuthenticationService.signup)
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
  validate('body', changePassword),
  asyncHandler(AuthenticationService.changePassword)
);

export default router;
