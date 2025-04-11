const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes')
const mediaRoutes = require('./mediaRoutes');
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);

module.exports = router;