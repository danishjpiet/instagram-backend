const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-app';
    const options = {
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
      authSource: process.env.MONGODB_AUTH_SOURCE || 'admin'
    };

    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDatabase;