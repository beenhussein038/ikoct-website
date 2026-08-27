const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const { Event } = require('../models');
const createCrudController = require('../controllers/crudController');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const controller = createCrudController(Event, {
  publicWhere: { clause: 'WHERE is_active = 1', params: [] },
});

const eventRules = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('start_date').isISO8601().withMessage('start_date must be a valid date.'),
  body('end_date').optional({ nullable: true }).isISO8601(),
  body('location').optional().trim(),
  body('image_path').optional().trim(),
  body('display_order').optional().isInt(),
];

// --- Public ---------------------------------------------------------------
// GET /api/events — only active events, ordered for the homepage slider
router.get('/', controller.listPublic);
router.get('/:id', param('id').isInt(), validate, controller.show);

// --- Admin (auth required) -------------------------------------------------
router.get('/admin/all', requireAuth, controller.listAdmin);
router.post('/', requireAuth, eventRules, validate, controller.create);
router.put(
  '/:id',
  requireAuth,
  param('id').isInt(),
  eventRules.map((r) => r.optional()),
  validate,
  controller.update
);
router.delete('/:id', requireAuth, param('id').isInt(), validate, controller.destroy);

module.exports = router;
