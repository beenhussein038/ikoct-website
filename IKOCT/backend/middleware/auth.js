const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../config/database');

/**
 * Verifies the Bearer token on the Authorization header, attaches the
 * authenticated admin (minus password_hash) to req.admin, and rejects
 * inactive/deleted accounts even if their token hasn't expired yet.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  const admin = db
    .prepare('SELECT id, name, email, role, is_active FROM admins WHERE id = ?')
    .get(payload.sub);

  if (!admin || !admin.is_active) {
    return res.status(401).json({ error: 'Account is no longer active.' });
  }

  req.admin = admin;
  next();
}

/** Restricts a route to specific roles, e.g. requireRole('super_admin') */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'You do not have permission to do this.' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
