const Post = require('../models/Post');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id,
    }, function(err, post){
        if(err){
            console.log("Error in creating the Post");
            return;
        }
        return res.redirect('back');
    });

}