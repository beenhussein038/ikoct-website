const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Admin = require('../models/Admin');
const db = require('../config/database');

function signToken(admin) {
  return jwt.sign({ sub: admin.id, role: admin.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function logAction(adminId, action, entityType, entityId = null) {
  db.prepare(
    'INSERT INTO audit_log (admin_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)'
  ).run(adminId, action, entityType, entityId);
}

module.exports = {
  login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = Admin.findByEmail(email);
    // Deliberately vague error — never reveal whether the email exists.
    const invalid = () => res.status(401).json({ error: 'Invalid email or password.' });

    if (!admin || !admin.is_active) return invalid();
    if (!Admin.verifyPassword(admin, password)) return invalid();

    const token = signToken(admin);
    logAction(admin.id, 'login', 'admin', admin.id);

    res.json({
      data: {
        token,
        admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      },
    });
  },

  me(req, res) {
    res.json({ data: req.admin });
  },

  changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required.' });
    }
    if (newPassword.length < 10) {
      return res.status(400).json({ error: 'New password must be at least 10 characters.' });
    }
    const full = Admin.findByEmail(req.admin.email);
    if (!Admin.verifyPassword(full, currentPassword)) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }
    Admin.changePassword(req.admin.id, newPassword);
    logAction(req.admin.id, 'change_password', 'admin', req.admin.id);
    res.json({ data: { message: 'Password updated.' } });
  },

  // super_admin only — creating new dashboard users
  createAdmin(req, res) {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    if (Admin.findByEmail(email)) {
      return res.status(409).json({ error: 'An admin with this email already exists.' });
    }
    const admin = Admin.create({ name, email, password, role: role || 'editor' });
    logAction(req.admin.id, 'create_admin', 'admin', admin.id);
    res.status(201).json({ data: admin });
  },

  listAdmins(req, res) {
    res.json({ data: Admin.all() });
  },

  setAdminActive(req, res) {
    const admin = Admin.setActive(req.params.id, req.body.is_active);
    logAction(req.admin.id, 'set_admin_active', 'admin', admin.id);
    res.json({ data: admin });
  },
};
