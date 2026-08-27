const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, param } = require('express-validator');
const router = express.Router();

const contactController = require('../controllers/contactController');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

// Public contact form gets its own gentle rate limit to deter spam bots
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many messages sent. Please try again later.' },
});

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('message').trim().isLength({ min: 5 }),
    body('phone').optional().trim(),
    body('subject').optional().trim(),
  ],
  validate,
  contactController.create
);

router.get('/', requireAuth, contactController.listAdmin);
router.patch('/:id/read', requireAuth, param('id').isInt(), validate, contactController.markRead);
router.delete('/:id', requireAuth, param('id').isInt(), validate, contactController.destroy);

module.exports = router;
