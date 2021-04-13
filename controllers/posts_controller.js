const Post = require('../models/Post');
const Comment = require('../models/Comment');

//create a post
module.exports.create = async function(req, res){
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id,
        });
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
            post.remove();

            //delete comments associated with the post
            await Comment.deleteMany({post: req.params.id});
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