const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports.toggleLike = async function(req, res){
    try {
        let likeable;
        let isDeleted = false;

        //determine if likeable is a comment or a post and then fetch it from database
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if the like exists in the database
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id,
        });

        //if the like exists, then remove it from the post's or comment's array and delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            isDeleted = true;
        }else{
            //else create a new like 
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type,
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: 'Like toggled',
            data: {
                isDeleted: isDeleted,
            }
        });
    } catch (error) {
        console.log('Error in likes Controller:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}