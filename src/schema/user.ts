import mongoose from 'mongoose';
import { USER_ROLE } from '../utils/const';

const UserSchema = new mongoose.Schema(
    {
        role: { type: String, enum: Object.values(USER_ROLE), required: true },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        email: { type: String, lowercase: true, unique: true },
        mobile: { type: String, unique: true, trim: true, default: '' },
        gender: { type: String, default: '' },
        dob: { type: Date, default: null },
        password: { type: String, default: '' },
        iActive: { type: Boolean, default: true },
        isAcceptPrivacyPolicy: { type: Boolean, default: false },
        onboardingStep: { type: Number, default: 0 },
        address: {
            address: { type: String },
            temproryAddress: { type: String },
            province: { type: String },
            city: { type: String },
            country: { type: String },
            zipCode: { type: String },
            countryISO: { type: String },
            stateISO: { type: String },
            location: {
                type: { type: String, default: "Point" },
                coordinates: { type: [Number], default: [0, 0] },
            },
        },
        profilePic: { type: String, default: '' },
        referralCode: { type: String, default: '' },
    },
    { timestamps: true }
);

UserSchema.index({ "address.location": '2dsphere' });

export default UserSchema;
