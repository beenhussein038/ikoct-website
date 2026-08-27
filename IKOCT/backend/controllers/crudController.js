const slugify = require('slugify');

/**
 * Builds standard index/show/create/update/destroy handlers for a resource.
 *
 * @param model            a model built by createCrudModel()
 * @param opts.publicWhere SQL WHERE clause + params used for the PUBLIC
 *                          (unauthenticated) list endpoint — e.g. only
 *                          active/published rows, never drafts.
 * @param opts.slugField    which incoming field to auto-slugify into `slug`
 *                          on create (most resources use `title`)
 */
function createCrudController(model, opts = {}) {
  const { publicWhere = null, slugField = 'title' } = opts;

  return {
    // Public: only what should be visible to website visitors
    listPublic(req, res) {
      const rows = publicWhere
        ? model.all(publicWhere.clause, publicWhere.params)
        : model.all();
      res.json({ data: rows });
    },

    // Admin: everything, drafts included
    listAdmin(req, res) {
      res.json({ data: model.all() });
    },

    show(req, res) {
      const row = model.findById(req.params.id);
      if (!row) return res.status(404).json({ error: 'Not found.' });
      res.json({ data: row });
    },

    create(req, res) {
      const payload = { ...req.body };
      if (slugField && payload[slugField] && !payload.slug) {
        payload.slug = slugify(payload[slugField], { lower: true, strict: true });
      }
      if (req.admin) payload.created_by = req.admin.id;
      const row = model.create(payload);
      res.status(201).json({ data: row });
    },

    update(req, res) {
      const existing = model.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Not found.' });
      const row = model.update(req.params.id, req.body);
      res.json({ data: row });
    },

    destroy(req, res) {
      const existing = model.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: 'Not found.' });
      model.remove(req.params.id);
      res.status(204).send();
    },
  };
}

module.exports = createCrudController;
