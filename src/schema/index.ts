import mongoose from "mongoose";
import UserSchema from "./user";
import { UserInterface } from "./../interface/user.interface";
import OTPSchema from "./OTPVerify.mdel";
import { OTPInterface } from "./../interface/OTPVerify.interface";

export default {
    User: mongoose.model<UserInterface & mongoose.Document>('User', UserSchema),
    OTP: mongoose.model<OTPInterface & mongoose.Document>('OTP', OTPSchema)
};