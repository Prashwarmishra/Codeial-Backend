const queue = require('../config/kue');
const passwordResetMailer = require('../mailers/password_reset_mailer');

queue.process('reset-password-token', function(job, done){
    passwordResetMailer.sendPasswordResetToken(job.data);
    done();
});