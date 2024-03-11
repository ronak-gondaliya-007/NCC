import { Router } from 'express';
const router = Router();
import VendorService from '../vendor/vendor.service';
import asyncHandler from './../../middleware/asyncHandler.middleware';
import validate from './../../middleware/validator.middleware';
import { addPersonalDetail, addBusinessDetail, updateSocialMediaLinks } from './vendor.validation';
import auth from './../../middleware/auth.middleware';
import { uploadDocs } from './../../middleware/multer.middleware';

router.post(
    '/onboarding/step/personal',
    auth,
    validate('body', addPersonalDetail),
    asyncHandler(VendorService.addPersonalDetail)
);

router.post(
    '/onboarding/step/business',
    auth,
    validate('body', addBusinessDetail),
    asyncHandler(VendorService.addBusinessDetail)
);

router.post(
    '/onboarding/step/profile',
    auth,
    uploadDocs.fields([{ name: 'ProfilePic', maxCount: 1 }, { name: 'CoverPics', maxCount: 6 }]),
    asyncHandler(VendorService.uploadProfile)
);

router.post(
    '/update/socialMediaLinks',
    auth,
    validate('body', updateSocialMediaLinks),
    asyncHandler(VendorService.updateSocialMediaLinks)
);

export default router;
