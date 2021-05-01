const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const passport = require('../config/passport-local-strategy');


router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.post('/create', usersController.create);
router.post('/create-session', passport.authenticate(
    'local', 
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

router.get('/forgot-password', usersController.forgotPassword);
router.post('/account-recovery', usersController.sendPasswordResetToken);

router.get('/reset-password/:token', usersController.resetPassword);

router.post('/submit-new-password', usersController.updatePassword);

module.exports = router;