const User = require('../models/User');


//render the profile page
module.exports.profile = function(req, res){
    return res.render('profile', {
        title: 'Profile',
    });
}

//render the post page
module.exports.posts = function(req, res){
    return res.render('posts', {
        title: 'Posts',
    });
}

//render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up",
    });
}

//render the sign up page
module.exports.signIn = function(req, res){
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

