const express = require('express');
const { param } = require('express-validator');
const createCrudController = require('../controllers/crudController');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

/**
 * Builds a standard REST router for a resource that follows the common
 * pattern: public GET of published/active rows, full admin CRUD behind auth.
 *
 * @param model            crud model from /models
 * @param validationRules  array of express-validator rules for create/update
 * @param publicWhere      { clause, params } restricting the public list,
 *                          e.g. { clause: 'WHERE is_published = 1', params: [] }
 */
function buildResourceRouter(model, validationRules, publicWhere) {
  const router = express.Router();
  const controller = createCrudController(model, { publicWhere });

  router.get('/', controller.listPublic);
  router.get('/:id', param('id').isInt(), validate, controller.show);

  router.get('/admin/all', requireAuth, controller.listAdmin);
  router.post('/', requireAuth, validationRules, validate, controller.create);
  router.put(
    '/:id',
    requireAuth,
    param('id').isInt(),
    validationRules.map((r) => r.optional()),
    validate,
    controller.update
  );
  router.delete('/:id', requireAuth, param('id').isInt(), validate, controller.destroy);

  return router;
}

module.exports = buildResourceRouter;
