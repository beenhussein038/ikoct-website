function notFound(req, res) {
  res.status(404).json({ error: 'Resource not found.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err); // in production, wire this to a real logger

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Upload too large.' });
  }

  const status = err.status || 500;
  const message =
    status === 500 ? 'Something went wrong on our end.' : err.message;

  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
