const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const opts = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial',
};

passport.use(new JWTStrategy(opts, function(jwtPayload, done){
    User.findById(jwtPayload._id, function(err, user){
        if(err){
            console.log('JWT error', err);
            return done(err);
        }
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })
}));

module.exports = passport;