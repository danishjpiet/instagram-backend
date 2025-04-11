const express = require('express');
const router = express.Router();


const { fetchUserMedia } = require('../controllers/mediaController');
const { validateAccessToken } = require('../middleware/authMiddleware');

// Endpoint to get user media
router.get('/instagram/post', validateAccessToken, fetchUserMedia);

module.exports = router;
  