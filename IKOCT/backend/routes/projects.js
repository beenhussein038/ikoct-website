const { body } = require('express-validator');
const buildResourceRouter = require('./resourceRouterFactory');
const { Project } = require('../models');

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('body').trim().notEmpty().withMessage('Body is required.'),
  body('summary').optional().trim(),
  body('status').optional().isIn(['planned', 'ongoing', 'completed']),
  body('image_path').optional().trim(),
  body('is_active').optional().isBoolean(),
  body('display_order').optional().isInt(),
];

module.exports = buildResourceRouter(Project, rules, {
  clause: 'WHERE is_active = 1',
  params: [],
});
