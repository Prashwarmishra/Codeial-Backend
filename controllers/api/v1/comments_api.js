const Comment = require('../../../models/Comment');
const Post = require('../../../models/Post');

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});

            return res.status(200).json({
                message: 'Comments deleted successfully!',
            }); 
        }else{
            return res.json(422).json({
                message: 'Unauthorised',
            })
        }
    }catch(error){
        console.log('Internal api error in deleting comment', error);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}