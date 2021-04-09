const Post = require('../models/Post');
const Comment = require('../models/Comment');

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

module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log('Error in finding the post, user is trying to delete');
            return;
        }
        if(post && post.user == req.user.id){
            post.remove();
            Comment.deleteMany({post: req.params.id}, function(err){
                if(err){
                    console.log('Error in deleting the comments associated with the post');
                    return;
                }
                return res.redirect('back');
            });
        }else{
            console.log('Cannot find the Post user is trying to delete');
            return res.redirect('back');
        }
    });
}