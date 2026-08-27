const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const config = require('../config/config');
const { notFound, errorHandler } = require('../middleware/errorHandler');

const app = express();

// --- Security & core middleware -------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (curl, server-to-server) and configured origins.
      if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// General API rate limit — generous, just a floor against abuse
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Serve uploaded images statically
app.use('/uploads', express.static(path.resolve(config.uploads.dir)));

// --- Routes -----------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ status: 'ok', env: config.env }));

app.use('/api/auth', require('../routes/auth'));
app.use('/api/events', require('../routes/events'));
app.use('/api/news', require('../routes/news'));
app.use('/api/blog', require('../routes/blog'));
app.use('/api/stories', require('../routes/stories'));
app.use('/api/programs', require('../routes/programs'));
app.use('/api/projects', require('../routes/projects'));
app.use('/api/gallery', require('../routes/gallery'));
app.use('/api/contact', require('../routes/contact'));
app.use('/api/settings', require('../routes/settings'));
app.use('/api/uploads', require('../routes/uploads'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
