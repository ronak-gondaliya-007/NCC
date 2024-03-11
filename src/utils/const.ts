import config from "./config";

export const USER_ROLE = Object.freeze({
    SUPER_ADMIN: 'Super Admin',
    USER: 'User',
    VENDOR: 'Vendor',
});

export const LOGIN_TYPE = Object.freeze({
    EMAIL: 'Email',
    MOBILE: 'Mobile',
    APPLE: 'Apple',
});

export const VENDOR_ACCOUNT_STATUS = Object.freeze({
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
});

export const DOCUMENT_SIZE = Object.freeze({
    PROFILE: config.DOCUMENT_SIZE.PROFILE,
    COVER: config.DOCUMENT_SIZE.COVER,
});

export const DOCUMENT = Object.freeze({
    PROFILE: config.DOCUMENT.PROFILE,
    COVER: config.DOCUMENT.COVER,
});