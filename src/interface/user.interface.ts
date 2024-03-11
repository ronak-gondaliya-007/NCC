import { Document } from 'mongoose';

export interface UserInterface extends Document {
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    password: string;
    language: string;
    isAcceptPrivacyPolicy: boolean;
    iActive: boolean;
    status: string;
    isVerified: boolean;
    profilePic: string;
    coverPic: string[];
    location: Location;
    address: Address;
    onboardingStep: number;
    businessName?: string;
    category?: string[];
    vendorType?: string[];
    aboutBusiness?: string;
    socialMediaLinks?: {
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
    activationDate: Date;
    deactivationDate: Date;
}

interface Location {
    type: string;
    coordinates: number[];
}

interface Address {
    address: string;
    temporaryAddress: string;
    province: string;
    city: string;
    country: string;
    zipCode: string;
    countryISO: string;
    provinceISO: string;
}
