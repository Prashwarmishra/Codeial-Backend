const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

//set up passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    }, 
    function(req, email, password, done){
        User.findOne({email: email}, function(err, user){
            if(err){
                req.flash('error', 'Internal Server error');
                return done(err);
            }
            if(!user || user.password != password){
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//serialize passport for encrypting the user.id
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserialize passport for decrypting the user.id
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log("Error in deserializing passport for user id");
            return done(err);
        }
        done(null, user);
    })
});

//use this middleware to check if the user is logged in
passport.checkAuthentication = function(req, res, next){
    //if user is authenticated, pass to the next step
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not authenticated, pass them to the sign in page
    return res.redirect('/users/sign-in');
}

//set information for views if the user is authenticated
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;