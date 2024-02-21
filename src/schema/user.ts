import mongoose from 'mongoose';
import { USER_ROLE } from '../utils/const';

const UserSchema = new mongoose.Schema(
    {
        role: { type: String, enum: Object.values(USER_ROLE), required: true },
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String, lowercase: true, required: true },
        mobile: { type: String, unique: true, trim: true, required: true },
        gender: { type: String },
        dob: { type: Date },
        password: { type: String, required: true },
        isAcceptPrivacyPolicy: { type: Boolean, default: false },
        forgotPasswordToken: { type: String },
        address: {
            address: { type: String },
            temproryAddress: { type: String },
            province: { type: String },
            city: { type: String },
            country: { type: String },
            zipCode: { type: String },
            countryISO: { type: String },
            stateISO: { type: String },
            location: { type: { type: String, default: "Point" }, coordinates: [Number] },
        },
        profilePic: { type: String, default: '' },
    },
    { timestamps: true }
);

UserSchema.index({ "address.location": '2dsphere' });

export default UserSchema;
