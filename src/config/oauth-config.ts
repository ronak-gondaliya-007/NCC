import config  from "../utils/config";

// oauth-config.ts
export const googleConfig = {
    clientID: config.GOOGLE_OAUTH.CLIENT_ID,
    clientSecret: config.GOOGLE_OAUTH.CLIENT_SECRET,
    callbackURL: config.GOOGLE_OAUTH.REDIRECT_URL,
};

export const facebookConfig = {
    clientID: config.FACEBOOK_OAUTH.CLIENT_ID,
    clientSecret: config.FACEBOOK_OAUTH.CLIENT_SECRET,
    callbackURL: config.FACEBOOK_OAUTH.REDIRECT_URL,
};

export const appleConfig = {
    clientID: config.APPLE_OAUTH.CLIENT_ID,
    teamID: config.APPLE_OAUTH.TEAM_ID,
    keyID: config.APPLE_OAUTH.KEY_ID,
    privateKeyPath: config.APPLE_OAUTH.PRIVATE_KEY_PATH,
    callbackURL: config.APPLE_OAUTH.REDIRECT_URL,
};
