const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './env') });

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
 
// Callback route
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/` }), function (req, res) {
    // Includ e the profile picture directly from the Google response
    req.user.token = generateToken(req.user, 600, req.user.NAME, req.user.ROLE, req.user.ID, req.user.EMAIL, req.user.PROFILE_PICTURE);
    console.log("token:", req.user.token);
 
    // Prepare the JSON response with profile picture
    const responseJson = {
        token: req.user.token,
        NAME: req.user.NAME,
        ROLE: req.user.ROLE, 
        ID: req.user.ID,
        EMAIL: req.user.EMAIL,
        PROFILE_PICTURE: req.user.PROFILE_PICTURE // Include profile picture in the response
    };

    // Redirect the user to a specific page with the JSON data as query parameters
    res.redirect(`${process.env.CLIENT_URL}/welcome?data=${encodeURIComponent(JSON.stringify(responseJson))}`);
});

const generateToken = (user, expiresIn, NAME, ROLE, ID, EMAIL, PROFILE_PICTURE) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    return jwt.sign({ NAME: NAME, ROLE: ROLE, ID: ID, EMAIL: EMAIL, PROFILE_PICTURE: PROFILE_PICTURE }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = router;
