import { Document } from 'mongoose';

export interface UserInterface extends Document {
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    dob: string;
    password: string;
    isAcceptPrivacyPolicy: boolean;
    iActive: boolean;
    profilePic: string;
    location: Location;
    address: Address;
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
    stateISO: string;
}
