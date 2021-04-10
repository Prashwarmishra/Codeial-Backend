const Post = require('../models/Post');
const User = require('../models/User');

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
        User.find({}, function(err, users){
            if(err){
                console.log('Error in finding the users');
                return;
            }
            return res.render('home', {
                title: 'Codeial | Home',
                posts: posts,
                all_users: users,
            });
        });
    })    
    
}