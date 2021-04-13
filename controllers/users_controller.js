const User = require('../models/User');

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
            return res.redirect('back');
        } 
    }catch(err){
        console.log('Error in loading user profile');
        return;
    }  
}

//create a controller for updating user's profile
module.exports.update = async function(req, res) {
    try{

        //authenticate user
        if(req.user.id == req.params.id){

            //find User's details and update
            await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('back');
        }else{
            return res.status(401).send('Unauthorized Access');
        }
    }catch(err){
        if(err){
            console.log('Error in updating user profile');
            return;
        }
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
            return res.redirect('/users/sign-in');
        }else{
            
            //if user found, redirect to sign-in page
            return res.redirect('/users/sign-in');
        }
    }catch(err){
        console.log('Error while creating user in database');
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