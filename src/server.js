require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');
const { apiLimiter, errorHandler } = require('./middleware');
const routes = require('./routes');

// Connect to MongoDB
connectDatabase();

const app = express();
app.use(cors());
app.use(express.json());

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});