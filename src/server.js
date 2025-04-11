require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');
const { apiLimiter, errorHandler } = require('./middleware');
const routes = require('./routes');

// Connect to MongoDB
connectDatabase();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.set('trust proxy', true);

// Apply rate limiting to all routes
app.use(apiLimiter);

// Routes
app.get('/test', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});