import { Request, Response } from 'express';
import CommonService from '../../utils/common';
import { findOne, findOneAndUpdate, insertOne } from '../../utils/db';
import config from '../../utils/config';
import { sendEmail } from '../../utils/email/email.send';
import { IUser } from '../../interface/jwt.interface';

class AuthenticationService {
    /** Create new account for vendor or user */
    async signup(req: Request, res: Response) {
        const payload = req.body;

        // Validate Email Address
        const validate = await CommonService.validateEmail(payload.email);
        if (!validate) {
            return res.status(200).json({ code: 400, message: 'Invalid Email Address.', success: true, data: {} });
        }

        // Verification Password and Confirm Password
        if (payload.password != payload.confirmPassword) {
            return res
                .status(200)
                .json({ code: 400, message: 'Confirm password must be the same as password.', success: true, data: {} });
        }

        const userVerification = await findOne({
            collection: 'User',
            query: { email: payload.email?.toLowerCase() }
        });

        if (userVerification) {
            return res
                .status(200)
                .json({ code: 400, message: 'User already exists with this email. Please use another email address.', success: true, data: {} });
        }

        payload.password = await CommonService.hashPassword(payload.password);

        const user = await insertOne({
            collection: 'User',
            document: payload
        })

        return res
            .status(200)
            .json({ code: 400, message: 'User account created successfully.', success: true, data: user });
    }

    /** Request for reset password mail */
    async requestResetPassword(req: Request, res: Response) {
        const payload = req.body;

        const user = await findOne({
            collection: 'User',
            query: { email: payload.email?.toLowerCase() },
        });

        if (!user) {
            return res.status(200).json({ code: 404, message: 'User not exists at this moment.', success: true, data: {} });
        }

        // To Generate Random Token
        const passwordResetToken: any = await CommonService.generateRandomToken(config.CRYPTO.RANDOM_TOKEN);
        console.log(passwordResetToken);

        await findOneAndUpdate({
            collection: 'User',
            query: { _id: user?._id },
            update: { $set: { forgotPasswordToken: passwordResetToken } },
            options: { new: true },
        });

        // Verification Email With Reset Token
        const verificationLink = `${config.HOST
            }/updatepassword?emailToken=${passwordResetToken}&email=${encodeURIComponent(payload.email)}`;

        const emailOptions = {
            link: verificationLink,
            to: payload.email,
            subject: 'Reset Password Link',
            templatePath: process.cwd() + '/src/utils/email/templates/reset-password-mail.handlebars',
            templateData: {
                username: 'John Doe',
                passwordResetLink: verificationLink,
            },
        };

        // Send Email With verification Link
        sendEmail(emailOptions);

        return res
            .status(200)
            .json({ message: 'Email has been sent successfully.', success: true, data: { email: payload.email?.toLowerCase() } });
    }

    /** Update password via reset password link */
    async resetPassword(req: Request, res: Response) {
        const payload = req.body;

        const user = await findOne({
            collection: 'User',
            query: { email: payload.email?.toLowerCase() },
        });

        if (!user) {
            return res.status(200).json({ code: 404, message: 'User not exists at this moment.', success: true, data: {} });
        }

        if (user?.forgotPasswordToken !== payload.emailToken) {
            return res.status(400).json({ message: 'Reset password link does not exists.', success: true, data: {} });
        }

        const verifiedPassword = await CommonService.comparePassword(payload.newPassword, user?.password);

        if (verifiedPassword) {
            return res
                .status(200)
                .json({ code: 400, message: 'You used that password recently. Choose a different password.', success: true, data: {} });
        }

        if (payload.newPassword !== payload.confirmPassword) {
            return res
                .status(400)
                .json({ message: 'New password must be the same as confirm password.', success: true, data: {} });
        }

        const encrytedPassword: any = await CommonService.hashPassword(payload.newPassword);

        await findOneAndUpdate({
            collection: 'User',
            query: { _id: user?._id },
            update: { $set: { forgotPasswordToken: '', password: encrytedPassword } },
            options: { new: true },
        });

        return res.status(200).json({ message: 'Password changed successfully.', success: true, data: {} });
    }

    /** Login */
    async login(req: Request, res: Response) {
        const payload = req.body;

        // Validate Email Address
        const validate = await CommonService.validateEmail(payload.email?.toLowerCase());
        if (!validate) {
            return res.status(400).json({ message: 'Invalid Email Address.', error: true, data: {} });
        }

        const user = await findOne({
            collection: 'User',
            query: { email: payload.email?.toLowerCase() },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not exists at this moment.', error: true, data: {} });
        }

        const verifyPassword = await CommonService.comparePassword(payload.password, user?.password);

        if (!verifyPassword) {
            return res.status(404).json({ message: 'Email or Password is incorrect.', error: true, data: {} });
        }

        const accessToken = await CommonService.issueToken({
            id: user?._id,
            email: user?.email,
            role: user?.role,
            schoolId: user?.schoolId?._id,
            schoolName: user?.schoolId?.schoolName,
        });
        // const encryptAuthToken = await middleware.encryptAuthData(accessToken);

        const result: object = {
            user,
            accessToken: accessToken,
        };

        return res.status(200).json({ message: 'User login successfully.', success: true, data: result });
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
            return res.status(400).json({ message: 'Old password do not match.', error: true, data: {} });
        }

        const encryptPassword = await CommonService.hashPassword(payload.newPassword);

        let update: object = { password: encryptPassword };

        await findOneAndUpdate({
            collection: 'User',
            query: { _id: request.userId },
            update: { $set: update },
            options: { new: true },
        });

        return res.status(200).json({ message: 'Password Changed Successfully.', success: true, data: {} });
    }
}

export default new AuthenticationService();