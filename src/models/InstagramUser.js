const mongoose = require('mongoose');

const instagramUserSchema = new mongoose.Schema({
  instagramId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  instagramAccessToken: {
    type: String,
    required: true
  },
  tokenType: {
    type: String,
    enum: ['SHORT_LIVED', 'LONG_LIVED'],
    default: 'LONG_LIVED'
  },
  tokenExpiresAt: {
    type: Date,
    required: true
  },
    mediaCount: Number,
    accountType: {
        type: String,
        enum: ['PERSONAL', 'BUSINESS', 'CREATOR'],
        default: 'BUSINESS'
    },
  lastSync: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  jwtRefreshToken: { type: String },
  media: [{
    id: String,
    caption: String,
    mediaType: String,
    mediaUrl: String,
    permalink: String,
    timestamp: Date
  }]
}, {
  timestamps: true
});

// Add methods to check token expiration
instagramUserSchema.methods.isTokenExpired = function() {
  return Date.now() >= this.tokenExpiresAt.getTime();
};

const InstagramUser = mongoose.model('InstagramUser', instagramUserSchema);

module.exports = InstagramUser;