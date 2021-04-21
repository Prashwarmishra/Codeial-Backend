const Post = require('../../../models/Post');
const Comment = require('../../../models/Comment');

module.exports.index = async function(req, res){
    let posts = await Post.find({})
    .populate('user')
    .sort('-createdAt')
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            options: {sort: {position: -1}},
        }
    })

    return res.json(200, {
        message: 'Index of Posts',
        posts: posts,
    })
}

//delete a post
module.exports.destroy = async function(req, res){
    try{
        //locate post in database
        let post = await Post.findById(req.params.id);

        post.remove();
            
        //delete comments associated with the post
        await Comment.deleteMany({post: req.params.id});

        return res.json(200, {
            message: 'Post and associated Comments deleted Successfully',
        })

    }catch(err){
        return res.json(200, {
            message: 'Error in deleting the post',
        })
    }
}