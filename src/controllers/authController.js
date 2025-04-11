const InstagramUser = require('../models/InstagramUser');
const { 
  getAuthUrl, 
  exchangeCodeForToken, 
  getLongLivedToken,
  getUserProfile,
  getUserMedia
} = require('../services/instagramService');
const {
  generateAccessToken,
  generateRefreshToken
} = require('../utils/jwt');

const INSTAGRAM_CONFIG = {
  clientId: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  redirectUri: process.env.INSTAGRAM_REDIRECT_URI
};

const getInstagramAuthUrl = (req, res) => {
  const authUrl = getAuthUrl(INSTAGRAM_CONFIG);
  res.json({ url: authUrl });
};

const handleInstagramCallback = async (req, res, next) => {
  try {
    const { code } = req.body;
    
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken({code, ...INSTAGRAM_CONFIG});
    const { access_token } = tokenData;
    // Get long-lived access token
    const longLivedTokenData = await getLongLivedToken({shortLivedToken:access_token, ...INSTAGRAM_CONFIG});
    
    // Get user profile
    const userProfile = await getUserProfile(longLivedTokenData.access_token);
    
    const instagramUser = await InstagramUser.findOneAndUpdate(
      { instagramId: userProfile.id },
      {
        instagramId: userProfile.id,
        username: userProfile.username,
        instagramAccessToken: longLivedTokenData.access_token,
        tokenType: 'LONG_LIVED',
        tokenExpiresAt: new Date(Date.now() + longLivedTokenData.expires_in * 1000),
        mediaCount: userProfile.media_count,
        accountType: userProfile.account_type,
      },
      { upsert: true, new: true }
    ).select('username mediaCount accountType instagramId');

    // Generate JWT tokens
    const accessToken = generateAccessToken(instagramUser._id);
    const refreshToken = generateRefreshToken(instagramUser._id);

    // Update user with refresh token
    await InstagramUser.findByIdAndUpdate(instagramUser._id, {
        jwtRefreshToken: refreshToken
    });

    const data = {
      user: instagramUser,
      tokens: {
        accessToken,
        refreshToken
      }
    };

    return res.status(200).json({data});
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const _id = req.userId;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    // Find user by refresh token
    const user = await InstagramUser.findById(_id).select('jwtRefreshToken');
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const accessToken = generateAccessToken(_id);
    const data = {
      tokens: {
        accessToken
      }
    };
    res.json({data});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstagramAuthUrl,
  handleInstagramCallback,
  refreshToken
};