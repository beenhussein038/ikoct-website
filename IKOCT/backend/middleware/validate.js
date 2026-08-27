const { validationResult } = require('express-validator');

/** Drop-in middleware: runs after a chain of express-validator checks and
 * turns any failures into a clean 400 response instead of letting bad data
 * reach the database. */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed.', details: errors.array() });
  }
  next();
}

module.exports = { validate };
