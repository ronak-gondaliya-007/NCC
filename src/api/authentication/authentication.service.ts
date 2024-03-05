import { Request, Response } from 'express';
import CommonService from '../../utils/common';
import { deleteMany, findOne, findOneAndDelete, findOneAndUpdate, insertOne } from '../../utils/db';
import { sendEmail } from '../../utils/email/email.send';
import { IUser } from '../../interface/jwt.interface';
import { LOGIN_TYPE } from '../../utils/const';

class AuthenticationService {
    /** Create new account for vendor */
    async signup(req: Request, res: Response) {
        const payload = req.body;

        // Validate Email Address
        const validate = await CommonService.validateEmail(payload.email);
        const query = { email: payload.email?.toLowerCase(), mobile: payload.mobile };

        if (!validate) {
            return res.status(200).json({ code: 400, message: `Invalid email address or mobile number already in use.`, success: true, data: {} });
        }

        // Verification Password and Confirm Password
        if (payload.password != payload.confirmPassword) {
            return res
                .status(200)
                .json({ code: 400, message: 'Confirm password must be the same as password.', success: true, data: {} });
        }

        payload.password = await CommonService.hashPassword(payload.password);

        const userVerification = await findOne({
            collection: 'User',
            query
        });

        if (userVerification) {
            return res
                .status(200)
                .json({ code: 400, message: `User already exists with this email or mobile number. Please use another email or mobile number.`, success: true, data: {} });
        }

        const user = await insertOne({
            collection: 'User',
            document: payload
        });

        return res
            .status(200)
            .json({ code: 200, message: 'User account created successfully.', success: true, data: user });
    }

    /** Resend OTP */
    async resendOTP(req: Request, res: Response) {
        const payload = req.body;

        const validEmail = await CommonService.validateEmail(payload.emailOrMobile);
        const validMobile = await CommonService.validateMobileNumber(payload.emailOrMobile);

        if (!validEmail && !validMobile) {
            return res.status(200).json({ code: 400, message: `Invalid email address or mobile number.`, success: true, data: {} });
        }

        const user = await findOne({
            collection: 'User',
            query: { $or: [{ email: payload.emailOrMobile?.toLowerCase() }, { mobile: payload.emailOrMobile }] }
        });

        if (!user) {
            return res.status(200).json({ code: 404, message: `User not found.`, success: true, data: {} });
        }

        await deleteMany({ collection: 'OTP', query: { user_id: user._id } });

        const randomOTP = Math.floor(Math.random() * 9000) + 1000;

        const otpData = await insertOne({
            collection: 'OTP',
            document: {
                user_id: user._id,
                otp: randomOTP
            }
        });

        return res.status(200).json({ code: 200, message: "OTP sent Successfully", success: true, data: {} });

    }

    /** Verification user OTP */
    async verifyOTP(req: Request, res: Response) {
        const payload = req.body;

        const validEmail = await CommonService.validateEmail(payload.emailOrMobile);
        const validMobile = await CommonService.validateMobileNumber(payload.emailOrMobile);

        if (!validEmail && !validMobile) {
            return res.status(200).json({ code: 400, message: `Invalid email address or mobile number.`, success: true, data: {} });
        }

        const verifyUser = await findOne({
            collection: 'User',
            query: { $or: [{ email: payload.emailOrMobile?.toLowerCase() }, { mobile: payload.emailOrMobile }] }
        });

        if (!verifyUser) {
            return res.status(200).json({ code: 404, message: `User not found.`, success: true, data: {} });
        }

        const verifyOTP = await findOne({
            collection: 'OTP',
            query: { user_id: verifyUser._id, otp: payload.otp }
        });

        if (!verifyOTP) {
            return res.status(200).json({ code: 400, message: `OTP invalid or expired.`, success: true, data: {} });
        }

        let query: any = {};
        let updateQuery: any = {};
        if (verifyOTP.type == 0) {
            query = { _id: verifyUser._id, onboardingStep: 0 }
            updateQuery = { $set: { onboardingStep: 1 } }
        } else {
            query = { _id: verifyUser._id }
        }

        await findOneAndUpdate({
            collection: 'User',
            query,
            update: updateQuery,
            options: { new: true }
        });

        await findOneAndDelete({ collection: 'OTP', query: { user_id: verifyUser._id, otp: payload.otp } });
        return res.status(200).json({ code: 200, message: "OTP verified Successfully", success: true, data: {} });
    }

    /** Request for reset password mail */
    async requestResetPassword(req: Request, res: Response) {
        const payload = req.body;

        const validEmail = await CommonService.validateEmail(payload.emailOrMobile);
        const validMobile = await CommonService.validateMobileNumber(payload.emailOrMobile);

        if (!validEmail && !validMobile) {
            return res.status(200).json({ code: 400, message: `Invalid email address or mobile number.`, success: true, data: {} });
        }

        const user = await findOne({
            collection: 'User',
            query: { $or: [{ email: payload.emailOrMobile?.toLowerCase() }, { mobile: payload.emailOrMobile }] },
        });

        if (!user) {
            return res.status(200).json({ code: 404, message: 'User not found.', success: true, data: {} });
        }

        await deleteMany({ collection: 'OTP', query: { user_id: user._id } });

        const randomOTP = Math.floor(Math.random() * 9000) + 1000;

        await insertOne({
            collection: 'OTP',
            document: {
                user_id: user._id,
                otp: randomOTP
            }
        });

        const emailOptions = {
            link: randomOTP,
            to: payload.emailOrMobile,
            subject: 'Reset Password Link',
            templatePath: process.cwd() + '/src/utils/email/templates/reset-password-mail.handlebars',
            templateData: {
                username: 'John Doe',
                passwordResetLink: randomOTP,
            },
        };

        // Send Email With verification Link
        sendEmail(emailOptions);

        return res
            .status(200)
            .json({ code: 200, message: 'Email has been sent successfully.', success: true, data: { email: payload.email?.toLowerCase() } });
    }

    /** Update password via reset password link */
    async resetPassword(req: Request, res: Response) {
        const payload = req.body;

        const validEmail = await CommonService.validateEmail(payload.emailOrMobile);
        const validMobile = await CommonService.validateMobileNumber(payload.emailOrMobile);

        if (!validEmail && !validMobile) {
            return res.status(200).json({ code: 400, message: `Invalid email address or mobile number.`, success: true, data: {} });
        }

        const user = await findOne({
            collection: 'User',
            query: { $or: [{ email: payload.emailOrMobile?.toLowerCase() }, { mobile: payload.emailOrMobile }] },
        });

        if (!user) {
            return res.status(200).json({ code: 404, message: 'User not found.', success: true, data: {} });
        }

        const verifiedPassword = await CommonService.comparePassword(payload.newPassword, user?.password);

        if (verifiedPassword) {
            return res
                .status(200)
                .json({ code: 400, message: 'You used that password recently. Choose a different password.', success: true, data: {} });
        }

        if (payload.newPassword !== payload.confirmPassword) {
            return res
                .status(200)
                .json({ code: 400, message: 'New password must be the same as confirm password.', success: true, data: {} });
        }

        const encrytedPassword: any = await CommonService.hashPassword(payload.newPassword);

        await findOneAndUpdate({
            collection: 'User',
            query: { _id: user?._id },
            update: { $set: { password: encrytedPassword } },
            options: { new: true },
        });

        return res.status(200).json({ code: 200, message: 'Password changed successfully.', success: true, data: {} });
    }

    /** Login */
    async login(req: Request, res: Response) {
        const payload = req.body;

        const validEmail = await CommonService.validateEmail(payload.emailOrMobile);
        const validMobile = await CommonService.validateMobileNumber(payload.emailOrMobile);

        if (!validEmail && !validMobile) {
            return res.status(200).json({ code: 400, message: `Invalid email address or mobile number.`, success: true, data: {} });
        }

        const user = await findOne({
            collection: 'User',
            query: { $or: [{ email: payload.emailOrMobile?.toLowerCase() }, { mobile: payload.emailOrMobile }] },
        });

        if (!user) {
            return res.status(200).json({ code: 404, message: 'User not exists at this moment.', error: true, data: {} });
        }

        const verifyPassword = await CommonService.comparePassword(payload.password, user?.password);

        if (!verifyPassword) {
            return res.status(200).json({ code: 404, message: 'Email or Password is incorrect.', error: true, data: {} });
        }

        const accessToken = await CommonService.issueToken({
            userId: user?._id,
            username: user?.fullName,
            email: user?.email,
            mobile: user?.mobile,
            role: user?.role,
        });
        // const encryptAuthToken = await middleware.encryptAuthData(accessToken);

        const result: object = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile,
            profilePic: user.profilePic,
            accessToken: accessToken,
        };

        return res.status(200).json({ code: 200, message: 'User login successfully.', success: true, data: result });
    }

    /** Change password */
    async changePassword(req: Request & { user: IUser }, res: Response) {
        const request = req.user;
        const payload = req.body;

        if (payload.oldPassword == payload.newPassword) {
            return res
                .status(200)
                .json({ code: 400, message: 'New password can not be the same as old password.', error: true, data: {} });
        }

        if (payload.newPassword != payload.confirmPassword) {
            return res
                .status(200)
                .json({ code: 400, message: 'Confirm password must be the same as new password.', error: true, data: {} });
        }

        const user = await findOne({
            collection: 'User',
            query: { _id: request.userId },
        });

        if (!user) {
            return res.status(200).json({ code: 404, message: 'User not exists at this moment.', error: true, data: {} });
        }

        const verifyPassword = await CommonService.comparePassword(payload.oldPassword, user?.password);

        if (!verifyPassword) {
            return res.status(200).json({ cd: 400, message: 'Old password do not match.', error: true, data: {} });
        }

        const encryptPassword = await CommonService.hashPassword(payload.newPassword);

        let update: object = { password: encryptPassword };

        await findOneAndUpdate({
            collection: 'User',
            query: { _id: request.userId },
            update: { $set: update },
            options: { new: true },
        });

        return res.status(200).json({ code: 200, message: 'Password Changed Successfully.', success: true, data: {} });
    }
}

export default new AuthenticationService();