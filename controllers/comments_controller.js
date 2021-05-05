const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentsEmailWorker = require('../workers/comments_email_worker');

//create a controller for adding a comment on a post
module.exports.create = async function(req, res){
    try{
        //find the post on which comment has to be added
        let post = await Post.findById(req.body.post);

        //if post is found, create comment in db
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });

            //push comment id to post schema's array of comments
            post.comments.push(comment);
            post = await post.populate('user', 'name, email').execPopulate();
            comment = await comment.populate('user', 'name').execPopulate();
            post.save();
            // commentsMailer.newComment(post, comment);
            let job = queue.create('emails', {post: post, comment: comment}).save(function(err){
                if(err){
                    console.log('Error in enqueuing job: ', err);
                    return;
                }
                console.log('Job enqueued: ', job.id);
            });

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment,
                        comment_user: req.user.name,
                    }, 
                    message: 'Comment created successfully!',
                });
            }

            req.flash('success', 'Comment Added!');
            return res.redirect('back');
        }else{

            //if post not found, redirect back
            req.flash('error', 'Post on which the user is trying to comment is not found');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', 'Error in adding comments on the Post');
        return;
    }
}

//create a controller for deleting the comment
module.exports.destroy = async function(req, res){
    try{
        //locate comment in database
        let comment = await Comment.findById(req.params.id);

        //authenticate comment's owner
        if(comment.user == req.user.id){
            let postId = comment.post;

            //delete all the likes associated with the comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            comment.remove();

            //delete comment's id from the post comments array in post Schema
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id,
                    },
                    message: 'Comment deleted successfully',
                })
            }

            req.flash('success', 'Comment Deleted');
            return res.redirect('back');
        }else{

            //if comment not found, redirect back
            req.flash('error', 'Comment not found');
            return res.redirect('back');
        }
    } catch(err){
        req.flash('error', 'Error in deleting the comment');
        return;
    }
}