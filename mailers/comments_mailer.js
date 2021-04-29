const nodemailer = require('../config/nodemailer');

exports.newComment = (data) => {
    let post = data.post;
    let comment = data.comment;
    let htmlString = nodemailer.renderTemplate({post: post, comment: comment}, '/comments/new_comment.ejs');

    console.log('inside newComment mailer', post);
    nodemailer.transporter.sendMail({
        from: 'prashwarmishra@gmail.com',
        to: post.user.email,
        subject: 'New comment on your Post',
        html: htmlString,
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail: ', err);
            return;
        }
        console.log('Message sent:', info);
        return;
    });
}