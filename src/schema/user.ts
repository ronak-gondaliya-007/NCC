import mongoose from 'mongoose';
import { USER_ROLE } from '../utils/const';

const UserSchema = new mongoose.Schema(
    {
        role: { type: String, enum: [USER_ROLE.USER, USER_ROLE.VENDOR, USER_ROLE.SUPER_ADMIN], required: true },
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String, lowercase: true, required: true },
        mobile: { type: String, required: true },
        gender: { type: String },
        dob: { type: Date },
        password: { type: String, required: true },
        isAcceptPrivacyPolicy: { type: Boolean, default: false },
        forgotPasswordToken: { type: String },
        location: { type: { type: String, default: "Point" }, coordinates: [Number] },
        address: {
            address: { type: String },
            temproryAddress: { type: String },
            province: { type: String },
            city: { type: String },
            country: { type: String },
            zipCode: { type: String },
            countryISO: { type: String },
            stateISO: { type: String },
        },
        profilePic: { type: String, default: '' },
    },
    { timestamps: true }
);

export default UserSchema;
