import { Router } from 'express';
const router = Router();
import VendorService from '../vendor/vendor.service';
import asyncHandler from './../../middleware/asyncHandler.middleware';
import validate from './../../middleware/validator.middleware';
import { addPersonalDetail } from './vendor.validation';
import auth from './../../middleware/auth.middleware';

router.post(
    '/onboarding/step/1',
    validate('body', addPersonalDetail),
    asyncHandler(VendorService.addPersonalDetail)
);


export default router;
