const express = require('express');
const router = express.Router();

const likesController = require('../controllers/likes_controller');

router.post('/toggleLike', likesController.toggleLike);

module.exports = router;