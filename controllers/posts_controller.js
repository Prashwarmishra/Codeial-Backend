const Post = require('../models/Post');
const Comment = require('../models/Comment');

//create a post
module.exports.create = async function(req, res){
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id,
        });
        return res.redirect('back');
    }catch(err){
        console.log('Error in creating the post', err);
        return;
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
            return res.redirect('back');
        }else{
            console.log('Cannot find the Post user is trying to delete');
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error in destroying the Post');
        return;
    }
}