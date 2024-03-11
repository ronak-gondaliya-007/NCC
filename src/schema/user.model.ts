import mongoose from 'mongoose';
import * as validator from 'validator';
import { USER_ROLE, VENDOR_ACCOUNT_STATUS } from '../utils/const';
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
        password: { type: String },
        language: { type: String, default: 'English' },
        isActive: { type: Boolean, default: false },
        status: { type: String, enum: Object.values(VENDOR_ACCOUNT_STATUS) },
        isVerified: { type: Boolean },
        isAcceptPrivacyPolicy: { type: Boolean, default: false },
        address: {
            address: { type: String },
            province: { type: String },
            city: { type: String },
            country: { type: String },
            zipCode: { type: String },
            countryISO: { type: String },
            provinceISO: { type: String },
            location: {
                type: { type: String, default: "Point" },
                coordinates: { type: [Number], default: [0, 0] },
            },
        },
        profilePic: { type: String, default: '' },
        coverPic: [{ type: String }],
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
        activationDate: { type: Date, default: null },
        deactivationDate: { type: Date, default: null },
    },
    { timestamps: true }
);

UserSchema.pre('save', function (next) {
    if (this.role == USER_ROLE.VENDOR) {
        this.onboardingStep = 0;
        this.businessName = '';
        this.category = [];
        this.vendorType = [];
        this.aboutBusiness = '';
        this.socialMediaLinks.twitter = '';
        this.socialMediaLinks.linkedin = '';
        this.socialMediaLinks.instagram = '';
        this.socialMediaLinks.youtube = '';
        this.status = VENDOR_ACCOUNT_STATUS.PENDING;
    } else if (this.role == USER_ROLE.USER) {
        this.coverPic = undefined;
        this.category = undefined;
        this.vendorType = undefined;
        this.socialMediaLinks = undefined;
        this.isVerified = false;
        this.isActive = true;
    }
    next();
});

UserSchema.index({ "address.location": '2dsphere' });

// paginate with this plugin
UserSchema.plugin(paginate);

export default UserSchema;
