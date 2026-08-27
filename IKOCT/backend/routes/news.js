const { body } = require('express-validator');
const buildResourceRouter = require('./resourceRouterFactory');
const { News } = require('../models');

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('body').trim().notEmpty().withMessage('Body is required.'),
  body('image_path').optional().trim(),
  body('is_published').optional().isBoolean(),
  body('published_at').optional({ nullable: true }).isISO8601(),
];

module.exports = buildResourceRouter(News, rules, {
  clause: 'WHERE is_published = 1',
  params: [],
});
