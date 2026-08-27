const express = require('express');
const router = express.Router();
const { upload } = require('../services/uploadService');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided.' });
  // Return a path relative to the uploads mount, for the admin UI to store
  // against the relevant record (e.g. events.image_path).
  res.status(201).json({ data: { path: `/uploads/${req.file.filename}` } });
});

module.exports = router;
