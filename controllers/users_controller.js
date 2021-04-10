const User = require('../models/User');


//render the profile page
module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log('Error in finding user profile');
            return;
        }
        if(user){
            return res.render('profile', {
                title: 'Profile',
                user_profile: user,
            });
        }else{
            return res.redirect('back');
        }
    })
}

//create a controller for updating user's profile
module.exports.update = function(req, res) {
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            if(err){
                console.log('Error updating user details');
                return;
            }
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorized Access');
    }
}

//render the post page
module.exports.posts = function(req, res){
    return res.render('posts', {
        title: 'Posts',
    });
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

//render the sign up page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In",
    });
}

//create a user database
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log("Error in locating the user in database"); return;}
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log("Error in creating the user account"); return;}
                return res.redirect('/users/sign-in');
            })
        }
    })
}


//create session for logging in the user
module.exports.createSession = function(req, res){
    return res.redirect('/');
}

//create a controller to sign out user
module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/users/sign-in');
}