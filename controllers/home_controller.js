const Post = require('../models/Post');
const User = require('../models/User');

//render home page
module.exports.home = async function(req, res){
    try{

        //find all the posts in db
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

        //find all the users in db
        let users = await User.find({});

        //render all posts and users on home page
        return res.render('home', {
            title: 'Codeial | Home',
            posts: posts,
            all_users: users,
        });  
    }catch(err){
        req.flash('error', 'Internal server error, please try again');
        return;
    }
}