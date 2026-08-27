const { body } = require('express-validator');
const buildResourceRouter = require('./resourceRouterFactory');
const { GalleryImage } = require('../models');

const rules = [
  body('image_path').trim().notEmpty().withMessage('image_path is required.'),
  body('caption').optional().trim(),
  body('category').optional().trim(),
  body('is_active').optional().isBoolean(),
  body('display_order').optional().isInt(),
];

module.exports = buildResourceRouter(GalleryImage, rules, {
  clause: 'WHERE is_active = 1',
  params: [],
});
