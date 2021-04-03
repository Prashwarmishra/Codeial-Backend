const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    }, 
    function(email, password, done){
        User.findOne({email: email}, function(err, user){
            if(err){console.log("Error in finding the user in database"); 
            return done(err);
            }
            if(!user || user.password != password){
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


module.exports = passport;