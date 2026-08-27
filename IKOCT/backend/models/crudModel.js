const db = require('../config/database');

/**
 * Builds a small set of prepared-statement CRUD helpers for a table.
 * Keeps every resource (events, news, blog_posts, stories, programs,
 * projects, gallery_images) consistent and avoids copy-pasted SQL.
 *
 * All writes use parameterized queries — never string-concatenated SQL —
 * which is what prevents SQL injection here.
 */
function createCrudModel(table, { orderBy = 'id DESC' } = {}) {
  return {
    all(where = '', params = []) {
      const sql = `SELECT * FROM ${table} ${where} ORDER BY ${orderBy}`;
      return db.prepare(sql).all(...params);
    },

    findById(id) {
      return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
    },

    findBySlug(slug) {
      return db.prepare(`SELECT * FROM ${table} WHERE slug = ?`).get(slug);
    },

    create(data) {
      const keys = Object.keys(data);
      const columns = keys.join(', ');
      const placeholders = keys.map((k) => `@${k}`).join(', ');
      const result = db
        .prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`)
        .run(data);
      return this.findById(result.lastInsertRowid);
    },

    update(id, data) {
      const keys = Object.keys(data);
      if (keys.length === 0) return this.findById(id);
      const setClause = keys.map((k) => `${k} = @${k}`).join(', ');
      db.prepare(
        `UPDATE ${table} SET ${setClause}, updated_at = datetime('now') WHERE id = @id`
      ).run({ ...data, id });
      return this.findById(id);
    },

    remove(id) {
      const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
      return result.changes > 0;
    },
  };
}

module.exports = createCrudModel;
