const bcrypt = require('bcryptjs');
const db = require('../config/database');

const Admin = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
  },

  findById(id) {
    return db
      .prepare('SELECT id, name, email, role, is_active, created_at FROM admins WHERE id = ?')
      .get(id);
  },

  all() {
    return db
      .prepare(
        'SELECT id, name, email, role, is_active, created_at FROM admins ORDER BY created_at DESC'
      )
      .all();
  },

  verifyPassword(admin, plainPassword) {
    return bcrypt.compareSync(plainPassword, admin.password_hash);
  },

  create({ name, email, password, role = 'editor' }) {
    const hash = bcrypt.hashSync(password, 12);
    const result = db
      .prepare(
        'INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
      )
      .run(name, email, hash, role);
    return this.findById(result.lastInsertRowid);
  },

  setActive(id, isActive) {
    db.prepare('UPDATE admins SET is_active = ?, updated_at = datetime(\'now\') WHERE id = ?').run(
      isActive ? 1 : 0,
      id
    );
    return this.findById(id);
  },

  changePassword(id, newPassword) {
    const hash = bcrypt.hashSync(newPassword, 12);
    db.prepare(
      'UPDATE admins SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).run(hash, id);
  },
};

module.exports = Admin;
