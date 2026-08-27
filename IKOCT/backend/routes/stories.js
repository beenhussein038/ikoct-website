const { body } = require('express-validator');
const buildResourceRouter = require('./resourceRouterFactory');
const { Story } = require('../models');

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('body').trim().notEmpty().withMessage('Body is required.'),
  body('child_name').optional().trim(),
  body('image_path').optional().trim(),
  body('is_published').optional().isBoolean(),
];

module.exports = buildResourceRouter(Story, rules, {
  clause: 'WHERE is_published = 1',
  params: [],
});
