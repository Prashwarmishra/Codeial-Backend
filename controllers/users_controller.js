const User = require('../models/User');
const fs = require('fs');
const path = require('path');

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