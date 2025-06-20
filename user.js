const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

//SignUp
router
    .route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signup));

//LogIn
router
    .route("/login")
    .get(userController.renderLogInForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", 
        {failureRedirect: "/login", 
            failureFlash: true,
        }), 
        wrapAsync(userController.login));

//LogOut
router.get("/logout", userController.logout);


module.exports = router;