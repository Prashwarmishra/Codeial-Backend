const express = require('express');
const router = express.Router();
const commentsAPI = require('../../../controllers/api/v1/comments_api');
const passport = require('passport');

router.delete('/:id', passport.authenticate('jwt', {session: 'false'}), commentsAPI.destroy);

module.exports = router;