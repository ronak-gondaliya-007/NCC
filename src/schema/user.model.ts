import mongoose from 'mongoose';
import * as validator from 'validator';
import { USER_ROLE } from '../utils/const';
import paginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema(
    {
        googleId: { type: String },
        facebookId: { type: String },
        appleId: { type: String },
        role: { type: String, enum: Object.values(USER_ROLE), required: true },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        email: { type: String, lowercase: true, unique: true },
        mobile: { type: String, unique: true, trim: true, default: '' },
        gender: { type: String },
        dob: { type: Date, default: null },
        password: { type: String },
        iActive: { type: Boolean, default: true },
        isAcceptPrivacyPolicy: { type: Boolean, default: false },
        address: {
            address: { type: String },
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
        referralCode: { type: String },
        onboardingStep: { type: Number },
        businessName: { type: String },
        category: [{ type: String }],
        vendorType: [{ type: String }],
        aboutBusiness: { type: String },
        socialMediaLinks: {
            twitter: { type: String, validate: { validator: validator.isURL, message: 'Invalid URL for Twitter' } },
            linkedin: { type: String, validate: { validator: validator.isURL, message: 'Invalid URL for LinkedIn' } },
            instagram: { type: String, validate: { validator: validator.isURL, message: 'Invalid URL for Instagram' } },
            youtube: { type: String, validate: { validator: validator.isURL, message: 'Invalid URL for YouTube' } },
        },
    },
    { timestamps: true }
);

UserSchema.index({ "address.location": '2dsphere' });

// paginate with this plugin
UserSchema.plugin(paginate);

export default UserSchema;
