const Post = require('../models/Post');
const Comment = require('../models/Comment');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(err){
            console.log("Error in finding the post, the user is trying to comment on.");
            return;
        }
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            }, function(err, comment){
                if(err){
                    console.log("Error in creating the comment on the post");
                    return;
                }
                post.comments.push(comment);
                post.save();

                return res.redirect('back');
            });
        }
    })
}