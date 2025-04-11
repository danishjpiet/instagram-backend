const { verifyAccessToken, verifyRefreshToken } = require('../utils/jwt');
const InstagramUser = require('../models/InstagramUser');

const validateAccessToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  const { valid, decoded, error } = verifyAccessToken(token);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const user = await InstagramUser.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.isTokenExpired()) {
      return res.status(403).json({ error: 'Instagram token expired' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const validateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ error: 'Refresh token is required' });
  }

  const { valid, decoded, error } = verifyRefreshToken(refreshToken);

  if (!valid) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }

  req.userId = decoded.userId;
  next();
};

module.exports = {
  validateAccessToken,
  validateRefreshToken
};