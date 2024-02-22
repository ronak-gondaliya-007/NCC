import { Document } from 'mongoose';

export interface OTPInterface extends Document {
    user_id: string;
    otp: Number;
    type: Number;
    generatedAt: Date;
}