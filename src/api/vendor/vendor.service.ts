import { Request, Response } from 'express';
import CommonService from '../../utils/common';
import { findOne, findOneAndUpdate } from '../../utils/db';
import { IUser } from '../../interface/jwt.interface';
import { DOCUMENT, DOCUMENT_SIZE, VENDOR_ACCOUNT_STATUS } from '../../utils/const';
import { uploadToS3, validateFile } from '../../middleware/multer.middleware';
import config from '../../utils/config';

class VendorService {
    /** Create new account for vendor personal detail */
    async addPersonalDetail(req: Request & { user: IUser }, res: Response) {
        const request = req.user;
        const payload = req.body;

        const user = await findOne({
            collection: 'User',
            query: { _id: request.userId }
        });

        if (!user) {
            return res
                .status(200)
                .json({ code: 404, message: `User not found.`, success: true, data: {} });
        }

        if (payload.email?.toLowerCase() != user.email) {
            // Validate Email Address
            const validate = await CommonService.validateEmail(payload.email);
            const query = { email: payload.email?.toLowerCase() };

            if (!validate) {
                return res.status(200).json({ code: 400, message: `Invalid email address already in use.`, success: true, data: {} });
            }

            const userVerification = await findOne({
                collection: 'User',
                query
            });

            if (userVerification) {
                return res
                    .status(200)
                    .json({ code: 400, message: `User already exists with this email. Please use another email.`, success: true, data: {} });
            }
        }

        if (payload.mobile != user.mobile) {
            // Validate Email Address
            const validate = await CommonService.validateMobileNumber(payload.mobile);
            const query = { mobile: payload.mobile };

            if (!validate) {
                return res.status(200).json({ code: 400, message: `Invalid mobile number already in use.`, success: true, data: {} });
            }

            const userVerification = await findOne({
                collection: 'User',
                query
            });

            if (userVerification) {
                return res
                    .status(200)
                    .json({ code: 400, message: `User already exists with this mobile number. Please use another mobile number.`, success: true, data: {} });
            }
        }

        payload.address = {
            address: payload.address,
            country: payload.country,
            countryISO: payload.countryISO,
            province: payload.province,
            provinceISO: payload.provinceISO,
            city: payload.city,
            zipCode: payload.zipCode,
            // location: { type: 'Point', coordinates: [payload.long, payload.lat] }
        }

        payload.onboardingStep = 1;

        const personalInformation = await findOneAndUpdate({
            collection: 'User',
            query: { _id: request.userId },
            update: { $set: payload },
            options: { new: true }
        })

        return res
            .status(200)
            .json({ code: 200, message: 'User account personal detail added successfully.', success: true, data: personalInformation });
    }

    /** Create new account for vendor business detail */
    async addBusinessDetail(req: Request & { user: IUser }, res: Response) {
        const request = req.user;
        const payload = req.body;

        const user = await findOne({
            collection: 'User',
            query: { _id: request.userId }
        });

        if (!user) {
            return res
                .status(200)
                .json({ code: 404, message: `User not found.`, success: true, data: {} });
        }

        payload.onboardingStep = 2;

        const businessInformation = await findOneAndUpdate({
            collection: 'User',
            query: { _id: request.userId },
            update: { $set: payload },
            options: { new: true }
        });

        return res
            .status(200)
            .json({ code: 200, message: 'User account business detail added successfully.', success: true, data: businessInformation });
    }

    /** Create new account for vendor upload profile */
    async uploadProfile(req: any & { user: IUser }, res: Response) {
        const request = req.user;
        const files = req.files;

        const userExists = await findOne({
            collection: 'User',
            query: { _id: request?.userId },
        });

        if (!userExists) {
            return res.status(200).json({ code: 404, message: 'User not found.', error: true, data: {} });
        }

        if (!files || files.length === 0) {
            return res.status(200).json({ code: 400, message: 'No files uploaded.', error: true, data: {} });
        }

        // Check if any of the files is invalid
        const isValidProfilePic = await Promise.all(
            files?.ProfilePic.map(async (file: any) => {
                return {
                    file: file.originalname,
                    error: await validateFile(res, file, file.fieldname, DOCUMENT.PROFILE, DOCUMENT_SIZE.PROFILE),
                };
            })
        );

        const isValidCoverPics = await Promise.all(
            files?.CoverPics.map(async (file: any) => {
                return {
                    file: file.originalname,
                    error: await validateFile(res, file, file.fieldname, DOCUMENT.COVER, DOCUMENT_SIZE.COVER),
                };
            })
        );

        const totalInvalidProfilePics = isValidProfilePic.filter((error) => error.error !== undefined);
        const totalInvalidCoverPics = isValidCoverPics.filter((error) => error.error !== undefined);

        if (totalInvalidProfilePics.length || totalInvalidCoverPics.length) {
            const validationErrorMessage = `Invalid files: ${totalInvalidProfilePics?.length} profile picture's, ${totalInvalidCoverPics?.length} cover picture's.`;
            const invalidFiles = [...totalInvalidProfilePics, ...totalInvalidCoverPics];
            return res.status(200).json({ code: 400, message: validationErrorMessage, error: true, data: { invalidFiles } });
        }

        // Process each profile photos
        const profilePromises = files?.ProfilePic.map(async (file: any) => {
            file.id = request?.userId;
            file.role = request?.role;
            return uploadToS3(file, file.fieldname);
        });

        // Process each cover photos
        const coverPromises = files?.CoverPics.map(async (file: any) => {
            file.id = request?.userId;
            file.role = request?.role;
            return uploadToS3(file, file.fieldname);
        });

        const profilePic = await Promise.all(profilePromises);
        const coverPics = await Promise.all(coverPromises);

        // Check for invalid files
        if (profilePic.some((result) => result.code === 400) || coverPics.some((result) => result.code === 400)) {
            return res.status(200).json({
                code: 400,
                message: 'Invalid file(s) detected.',
                error: true,
                data: { profilePic, coverPics },
            });
        }

        const userProfile = await findOneAndUpdate({
            collection: 'User',
            query: { _id: request.userId },
            update: { $set: { profilePic: profilePic[0]?.Key, coverPic: coverPics.map((result: any) => result.Key), onboardingStep: 3 } },
            options: { new: true }
        });

        userProfile.profilePic = config.AWS.S3_URL + userProfile.profilePic;
        userProfile.coverPic = userProfile.coverPic?.map((ele: any) => config.AWS.S3_URL + ele);

        return res.status(200).json({
            code: 200,
            message: `Files have been uploaded successfully.`,
            success: true,
            data: userProfile,
        });
    }

    /** Vendor social media links update */
    async updateSocialMediaLinks(req: Request & { user: IUser }, res: Response) {
        const request = req.user;
        const payload = req.body;

        const userExists = await findOne({
            collection: 'User',
            query: { _id: request?.userId },
        });

        if (!userExists) {
            return res.status(200).json({ code: 404, message: 'User not found.', error: true, data: {} });
        }

        if (userExists.status != VENDOR_ACCOUNT_STATUS.APPROVED) {
            return res.status(200).json({ code: 400, message: `Your account approval ${userExists.status}. Please await confirmation from the administrator.`, error: true, data: {} });
        }

        if (!userExists.isActive) {
            return res.status(200).json({ code: 400, message: 'Your account has been temporary disabled by the administrator.', error: true, data: {} });
        }

        const updateSocialMediaDetail = await findOneAndUpdate({
            collection: 'User',
            query: { _id: request.userId },
            update: { $set: payload },
            options: { new: true }
        });

        return res.status(200).json({
            code: 200,
            message: `Your account social media links updated successfully.`,
            success: true,
            data: updateSocialMediaDetail,
        });
    }
}

export default new VendorService();