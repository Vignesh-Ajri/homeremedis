const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const plantRoutes = require('./routes/plants');
const remedyRoutes = require('./routes/remedies');
const categoryRoutes = require('./routes/categories');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

app.use('/api/plants', plantRoutes);
app.use('/api/remedies', remedyRoutes);
app.use('/api/categories', categoryRoutes);

module.exports = app;
