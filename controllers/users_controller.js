module.exports.profile = function(req, res){
    return res.render('profile', {
        title: 'Profile',
    });
}

module.exports.posts = function(req, res){
    return res.render('posts', {
        title: 'Posts',
    });
}