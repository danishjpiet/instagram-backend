const express = require('express');
const router = express.Router();
const { validateAuthCode } = require('../middleware');

const { 
  getInstagramAuthUrl, 
  handleInstagramCallback,
  refreshToken 
} = require('../controllers/authController');

const { validateRefreshToken } = require('../middleware/authMiddleware');

// Instagram OAuth login endpoint
router.get('/instagram', getInstagramAuthUrl);

// Instagram OAuth callback endpoint
router.post('/instagram/callback', validateAuthCode, handleInstagramCallback);

// Refresh token endpoint
router.post('/refresh-token', validateRefreshToken, refreshToken);


module.exports = router;