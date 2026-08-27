const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');

// Slow down credential-stuffing / brute-force attempts on login specifically.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/login',
  loginLimiter,
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  authController.login
);

router.get('/me', requireAuth, authController.me);

router.post(
  '/change-password',
  requireAuth,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 10 })],
  validate,
  authController.changePassword
);

// Only a super_admin can create other admin accounts
router.post(
  '/admins',
  requireAuth,
  requireRole('super_admin'),
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 10 }),
    body('role').optional().isIn(['super_admin', 'editor']),
  ],
  validate,
  authController.createAdmin
);

router.get('/admins', requireAuth, requireRole('super_admin'), authController.listAdmins);

router.patch(
  '/admins/:id/active',
  requireAuth,
  requireRole('super_admin'),
  [body('is_active').isBoolean()],
  validate,
  authController.setAdminActive
);

module.exports = router;
