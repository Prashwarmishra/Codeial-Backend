const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/User');

//initialise passport
passport.use(new googleStrategy(
    {
        clientID: '853925351392-bcbu6jlkf3g8c2r846jrem7bm8oiff3d.apps.googleusercontent.com',
        clientSecret: 'mqwfIEpRD6i2sWEownL_4x9V',
        callbackURL: 'http://localhost:8000/users/auth/google/callback',
    }, 

    //callback function, accessToken gives access while refresh token is a special kind of token 
    //that can be used to obtain a renewed access token when it expires, without having to log in 
    //the user again
    function(accessToken, refreshToken, profile, done){

        //find the user in db
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('error in google-authentication:', err);
                return done(err);
            }
            console.log(profile);
            //if user found, set up req.user
            if(user){
                return done(null, user);
            }else{
                //if user not found in database, create user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                }, function(err, user){
                    if(err){
                        console.log('Error in creating user during google authentication');
                        return;
                    }
                    return done(null, user);
                });
            }
        })
    }
));


module.exports = passport;