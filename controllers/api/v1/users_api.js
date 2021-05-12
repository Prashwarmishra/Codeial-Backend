const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});   
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: 'Invalid Username/Password',
            });
        }
        if(user){
            return res.status(200).json({
                message: 'Logged in successfully, here is your token',
                data: {
                    token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '1000000'}),
                }
            });
        }
    }catch(error){
        console.log('error', error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}