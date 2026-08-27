const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Settings = require('../models/Settings');
const { validate } = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');

// Public settings are safe, non-secret display config only
// (org contact info, social links). Never expose secret keys here.
const PUBLIC_KEYS = ['org_phone', 'org_email', 'org_address', 'facebook_url', 'twitter_url', 'instagram_url', 'paystack_public_key'];

router.get('/public', (req, res) => {
  const all = Settings.all();
  const filtered = Object.fromEntries(
    Object.entries(all).filter(([key]) => PUBLIC_KEYS.includes(key))
  );
  res.json({ data: filtered });
});

router.get('/', requireAuth, requireRole('super_admin'), (req, res) => {
  res.json({ data: Settings.all() });
});

router.put(
  '/:key',
  requireAuth,
  requireRole('super_admin'),
  [body('value').exists()],
  validate,
  (req, res) => {
    Settings.set(req.params.key, String(req.body.value));
    res.json({ data: { key: req.params.key, value: req.body.value } });
  }
);

module.exports = router;
