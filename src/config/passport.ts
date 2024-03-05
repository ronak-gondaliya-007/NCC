// src/config/passport.ts
import passport, { DoneCallback } from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import AppleStrategy from 'passport-apple';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { appleConfig, facebookConfig, googleConfig } from './oauth-config';

// Configure Google OAuth strategy
passport.use(new GoogleStrategy(googleConfig, (accessToken: string, refreshToken: string, profile: any, done: DoneCallback) => {
    const userData = {
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
    };

    // User.findOne({ googleId: profile.id }, (err, user) => {
    //   if (err) {
    //     return done(err);
    //   }

    //   if (!user) {
    //     User.create(userData, (err, newUser) => {
    //       if (err) {
    //         return done(err);
    //       }
    //       return done(null, newUser);
    //     });
    //   } else {
    //     return done(null, user);
    //   }
    // });
}));

// Configure Facebook OAuth strategy
passport.use(new FacebookStrategy(facebookConfig, (accessToken: string, refreshToken: string, profile: any, done: DoneCallback) => {
    const userData = {
        username: profile.displayName,
        email: profile.emails[0].value,
        facebookId: profile.id,
    };

    // User.findOne({ facebookId: profile.id }, (err, user) => {
    //   if (err) {
    //     return done(err);
    //   }

    //   if (!user) {
    //     User.create(userData, (err, newUser) => {
    //       if (err) {
    //         return done(err);
    //       }
    //       return done(null, newUser);
    //     });
    //   } else {
    //     return done(null, user);
    //   }
    // });
}));

// Configure Apple OAuth strategy
passport.use(new AppleStrategy(appleConfig, (req: any, accessToken: string, refreshToken: string, profile: any, done: DoneCallback) => {
    const userData = {
        username: profile.displayName,
        email: profile.email,
        appleId: profile.id,
    };

    // User.findOne({ appleId: profile.id }, (err, user) => {
    //   if (err) {
    //     return done(err);
    //   }

    //   if (!user) {
    //     User.create(userData, (err, newUser) => {
    //       if (err) {
    //         return done(err);
    //       }
    //       return done(null, newUser);
    //     });
    //   } else {
    //     return done(null, user);
    //   }
    // });
}));

passport.use(new LocalStrategy({ usernameField: 'email' }, (email: string, password: string, done: DoneCallback) => {
    //   User.findOne({ email: email }, (err, user) => {
    //     if (err) {
    //       return done(err);
    //     }
    //     if (!user) {
    //       return done(null, false, { message: 'Incorrect email.' });
    //     }
    //     bcrypt.compare(password, user.password, (err, result) => {
    //       if (err) {
    //         return done(err);
    //       }
    //       if (result) {
    //         return done(null, user);
    //       } else {
    //         return done(null, false, { message: 'Incorrect password.' });
    //       }
    //     });
    //   });
}));

passport.serializeUser((user: any, done: DoneCallback) => {
    done(null, user.id);
});

passport.deserializeUser((id: string, done: DoneCallback) => {
    // User.findById(id, (err, user) => {
    //     done(err, user);
    // });
});
