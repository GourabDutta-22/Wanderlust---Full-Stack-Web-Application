const User = require("../models/user.js");


//SignUp
module.exports.renderSignUpForm = (req, res) => {
    res.render("./users/signup.ejs");
};

//SignUp
module.exports.signup = async (req, res) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            req.login(registeredUser, (err) => {
                if(err){
                    return next(err);
                }
                req.flash("success", "Welcome to Wanderlust!");
                res.redirect("/listings");
            });
        }catch(e){
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    };

//LogIn
module.exports.renderLogInForm = (req,res) => {
    res.render("./users/login.ejs");
};

//LogIn
module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back on Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//LogOut
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }else{
            req.flash("success", "You are successfully logged out");
            res.redirect("/listings");
        }
    });
};