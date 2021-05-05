const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

//create a post
module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id,
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post,
                    post_user: req.user.name,
                },
                message: 'Post created successfully!',
            });
        }

        req.flash('success', 'Post created!');
        return res.redirect('back');
    }catch(err){
        req.flash('error', 'Error in creating the post');
        return res.redirect('back');
    }
}

//delete a post
module.exports.destroy = async function(req, res){
    try{
        //locate post in database
        let post = await Post.findById(req.params.id);

        //authenticate post's owner
        if(post && post.user == req.user.id){

            //delete likes associated with the post and it's comments
            await Like.deleteMany({likeable: post._id, onModel: 'Post'});
            await Like.deleteMany({likeable: {$in: post.comments}, onModel: 'Comment'});

            //delete comments associated with the post
            await Comment.deleteMany({post: req.params.id});
            
            post.remove();
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id,
                    },
                    message: 'Post Deleted Successfully!',
                });
            }

            req.flash('success', 'Post deleted');
            return res.redirect('back');
        }else{
            req.flash('error', 'Cannot find the Post user is trying to delete');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', 'Error in destroying the Post')
        return res.redirect('back');
    }
}