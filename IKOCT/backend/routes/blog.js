const { body } = require('express-validator');
const buildResourceRouter = require('./resourceRouterFactory');
const { BlogPost } = require('../models');

const rules = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('body').trim().notEmpty().withMessage('Body is required.'),
  body('excerpt').optional().trim(),
  body('author_name').optional().trim(),
  body('image_path').optional().trim(),
  body('is_published').optional().isBoolean(),
  body('published_at').optional({ nullable: true }).isISO8601(),
];

module.exports = buildResourceRouter(BlogPost, rules, {
  clause: 'WHERE is_published = 1',
  params: [],
});
