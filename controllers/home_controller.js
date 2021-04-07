const Post = require('../models/Post');

module.exports.home = function(req, res){
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        if(err){
            console.log("Error in displaying user Posts");
            return;
        }
        return res.render('home', {
            title: 'Codeial | Home',
            posts: posts,
        });
    })    
    
}