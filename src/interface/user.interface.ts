import { Document } from 'mongoose';

export interface UserInterface extends Document {
    role: string;
    email: string;
    mobile: string;
    password: string;
    country: string;
    isAcceptPrivacyPolicy: boolean;
    forgotPasswordToken: string;
}