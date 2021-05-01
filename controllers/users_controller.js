const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');
const passwordResetMailer = require('../mailers/password_reset_mailer');
const queue = require('../config/kue');
const resetPasswordEmailWorker = require('../workers/reset_password_email_worker');

//render the profile page
module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        if(user){
            return res.render('profile', {
                title: 'Profile',
                user_profile: user,
            });
        }else{
            req.flash('error', 'user not found');
            return res.redirect('back');
        } 
    }catch(err){
        req.flash('error', 'Error in loading user profile');
        return;
    }  
}

//create a controller for updating user's profile
module.exports.update = async function(req, res) {
    try{

        //authenticate user
        if(req.user.id == req.params.id){

            //find User's details and update
            let user = await User.findById(req.params.id);

            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('****Multer error', err);
                    return;
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    //delete if a previous avatar exists in the storage
                    if(user.avatar){
                        let avatarLocation = path.join(__dirname, '..', user.avatar);

                        //delete only if the file is present so errors dont come up when the storage is accidently wiped out.
                        if(fs.existsSync(avatarLocation)){
                            fs.unlinkSync(avatarLocation);
                        }
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'Profile Updated Successfully!');
                return res.redirect('back');
            });
        }else{
            return res.status(401).send('Unauthorized Access');
        }
    }catch(err){
        req.flash('error', 'Error in updating user profile');
        return;
    }
}

//render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up",
    });
}

//render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In",
    });
}

//create a user database
module.exports.create = async function(req, res){
    try{
        //handle password mismatch
        if(req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }

        //find user in db
        let user = await User.findOne({email: req.body.email});

        //if user not found, create user
        if(!user){
            await User.create(req.body);
            req.flash('success', 'Profile created, please sign in');
            return res.redirect('/users/sign-in');
        }else{
            
            //if user found, redirect to sign-in page
            req.flash('error', 'Account with the email exists already');
            return res.redirect('/users/sign-in');
        }
    }catch(err){
        req.flash('error', 'Error while creating user in database');
        return;
    }
}


//create session for logging in the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Successfully Logged In!');
    return res.redirect('/');
}

//create a controller to sign out user
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Successfully Logged Out!');
    return res.redirect('/users/sign-in');
}

//create controller to render forget-password page
module.exports.forgotPassword = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('back');
    }
    return res.render('forgot_password', {
        title: 'Forget Password',
    })
}

//create controller to locate user by their email and send accessToken on their email
module.exports.sendPasswordResetToken = async function(req, res){
    try {
        let user =  await User.findOne({email: req.body.email});
        if(user){

            //if user found, create a password reset token 
            let token = await PasswordResetToken.create({
                accessToken: crypto.randomBytes(20).toString('hex'),
                user: user,
                isValid: true,
            });

            //Enqueue the token in kue for it to be mailed
            let job = await queue.create('reset-password-token', token).save(function(err){
                if(err){
                    console.log('Error in enqueueing a job: ', err);
                    return;
                }
                console.log('job enqueued:', job.id);
            })
            //render reset information
            return res.render('reset_password_link', {
                title: 'Account Recovery',                    
            })
        }else{
            return res.render('user_not_found', {
                title: 'User not found',
            });
        }
    } catch (error) {
        console.log('Error in creating accessToken: ', error);
        req.flash('error', 'Internal Server Error');
        return res.redirect('back');
    }
}

//constroller to validate access token and render a reset password form
module.exports.resetPassword = async function(req, res){
    try {
        //check if the token exists in the database
        let token = await PasswordResetToken.findOne({accessToken: req.params.token});

        //if token is valid, render password reset form
        if(token && token.isValid){
            return res.render('reset_password', {
                title: 'Reset Password',
                user_token: token,
            })
        }else{

            //else render 404
            return res.render('fourOfour', {
                title: '404'
            });
        }
    } catch (error) {
        console.log('Error in validating access token, ', err);
        req.flash('error', 'Internal Server Error');
        return res.redirect('back');
    }
}

//controller to update new password
module.exports.updatePassword = async function(req, res){
    try {
        //validate the new password with the new confirm password
        if(req.body.new_password != req.body.confirm_new_password){
            req.flash('error', 'Password and Confirm Password did not match');
            return res.redirect('back');
        }

        //Find user in database
        let user = await User.findById(req.body.user_id);
        
        //if user found, update password
        if(user){
            user.password = req.body.new_password;
            user.save();
            let token = await PasswordResetToken.findById(req.body.token_id);
            
            //Also invalidate the token so the link becomes useless after one use
            token.isValid = false;
            token.save();
            req.flash('success', 'Password changed Successfully!');
            return res.redirect('/users/sign-in');
        }else{
            return res.render('fourOfour', {
                title: '404',
            })
        }
    } catch (error) {
        console.log('Error in changing user password: ', error);
        req.flash('error', 'Internal Server Error');
        return res.redirect('back');
    }
}
