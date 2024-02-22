import { Request, Response } from 'express';
import CommonService from '../../utils/common';
import { deleteMany, findOne, findOneAndDelete, findOneAndUpdate, insertOne } from '../../utils/db';
import { sendEmail } from '../../utils/email/email.send';
import { IUser } from '../../interface/jwt.interface';
import { LOGIN_TYPE } from '../../utils/const';

class VendorService {
    /** Create new account for vendor or user */
    async addPersonalDetail(req: Request, res: Response) {
        const payload = req.body;

        return res
            .status(200)
            .json({ code: 200, message: 'User account created successfully.', success: true, data: {} });
    }

}

export default new VendorService();