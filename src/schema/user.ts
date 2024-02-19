import mongoose from 'mongoose';
import config from '../utils/config';
import { USER_ROLE } from '../utils/const';

const UserSchema = new mongoose.Schema(
    {
        role: { type: String, enum: [USER_ROLE.USER, USER_ROLE.VENDOR, USER_ROLE.SUPER_ADMIN], required: true },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        email: { type: String, unique: true, sparse: true, lowercase: true, required: true },
        mobile: { type: String, unique: true, required: true },
        gender: { type: String, default: '' },
        dob: { type: Date, default: '' },
        type: { type: String, default: '' },
        password: { type: String, required: true },
        isAcceptPrivacyPolicy: { type: Boolean, default: false },
        forgotPasswordToken: { type: String },
        location: { type: { type: String, default: "Point" }, coordinates: [Number] },
        address: {
            address: { type: String, default: '' },
            temproryAddress: { type: String, default: '' },
            province: { type: String, default: '' },
            city: { type: String, default: '' },
            country: { type: String, default: '' },
            zipCode: { type: String, default: '' },
            countryISO: { type: String, default: '' },
            stateISO: { type: String, default: '' },
        },
        profilePic: { type: String, default: '' },
    },
    { timestamps: true }
);

export default UserSchema;
