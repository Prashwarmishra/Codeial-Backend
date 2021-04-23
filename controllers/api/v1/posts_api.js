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

    return res.status(200).json({
        message: 'Index of Posts',
        posts: posts,
    })
}

//delete a post
module.exports.destroy = async function(req, res){
    try{
        //locate post in database
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();
            
            //delete comments associated with the post
            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                message: 'Post and associated Comments deleted Successfully',
            })
        }else{
            return res.status(422).json({
                message: 'Unauthorised',
            });
        }

    }catch(err){
        return res.json(500, {
            message: 'Internal Server Error',
        })
    }
}