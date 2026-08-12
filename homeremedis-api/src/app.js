const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const plantRoutes = require('./routes/plants');
const remedyRoutes = require('./routes/remedies');
const categoryRoutes = require('./routes/categories');

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ── Body parsing (with size limit to prevent DoS) ───────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── NoSQL injection sanitization ─────────────────────────────────────────────
app.use(mongoSanitize());

// ── Global rate limiting ─────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Stricter limiter for write operations
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many write requests, please try again later.' },
});
app.use('/api/plants', writeLimiter);
app.use('/api/remedies', writeLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/plants', plantRoutes);
app.use('/api/remedies', remedyRoutes);
app.use('/api/categories', categoryRoutes);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;
  res.status(status).json({ message });
});

module.exports = app;
