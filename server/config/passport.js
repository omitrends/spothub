// server/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/User'); // your User schema

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
        user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: 'user' // 🚫 Do NOT allow admin via social login
        });
    }

    // 🔐 Make sure the user stays as 'user'
    if (user.role !== 'user') {
        user.role = 'user';
        await user.save();
    }

    done(null, user);
}));

// // Facebook Strategy (optional)
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//     profileFields: ['id', 'displayName', 'emails']
// }, async (accessToken, refreshToken, profile, done) => {
//     let user = await User.findOne({ facebookId: profile.id });

//     if (!user) {
//         user = await User.create({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             facebookId: profile.id,
//             role: 'user' // 🚫 Prevent admin creation
//         });
//     }

//     if (user.role !== 'user') {
//         user.role = 'user';
//         await user.save();
//     }

//     done(null, user);
// }));
