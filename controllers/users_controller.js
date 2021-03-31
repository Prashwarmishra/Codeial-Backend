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