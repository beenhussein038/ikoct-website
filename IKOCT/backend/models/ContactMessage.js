const db = require('../config/database');

const ContactMessage = {
  all() {
    return db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  },
  create({ name, email, phone, subject, message }) {
    const result = db
      .prepare(
        `INSERT INTO contact_messages (name, email, phone, subject, message)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(name, email, phone || null, subject || null, message);
    return db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(result.lastInsertRowid);
  },
  markRead(id) {
    db.prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?').run(id);
  },
  remove(id) {
    return db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id).changes > 0;
  },
};

module.exports = ContactMessage;
