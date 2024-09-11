const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require('jsonwebtoken');
const connection = require("./config"); // Ensure this points to your database connection
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Configure the Google Strategy for Passport.js
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.API + "/google/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value; // User's email
        const profilePicture = profile.photos[0].value; // Extract profile picture URL from Google

        // Check if the user exists in the database
        const query = 'SELECT * FROM login WHERE EMAIL = ? AND STATUS = 1';
        connection.query(query, [email], (error, results, fields) => {
            if (error) {
                return done(error);
            }

            if (results.length > 0) {
                const user = results[0];
                user.ROLE = user.ROLE;
                user.NAME = user.NAME;
                user.EMAIL = user.EMAIL;
                user.ID = user.ID;
                user.PROFILE_PICTURE = profilePicture; // Use profile picture from Google

                return done(null, user);
            } else {
                // If the user does not exist, handle the case here (e.g., create a new user)
                return done(null, false, { message: "User not found" });
            }
        });
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.ID);
});

passport.deserializeUser((ID, done) => {
    done(null, ID);
});

module.exports = passport;
