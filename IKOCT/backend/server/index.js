const app = require('./app');
const config = require('../config/config');

app.listen(config.port, () => {
  console.log(`IKOCT backend API running on http://localhost:${config.port} (${config.env})`);
  console.log(`Health check: http://localhost:${config.port}/api/health`);
});
