// Applies every .sql file in /database/migrations, in filename order,
// exactly once. Safe to run repeatedly — already-applied migrations are
// skipped, so this can run on every deploy.
const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const migrationsDir = path.resolve(__dirname, '../../database/migrations');

db.exec(`
  CREATE TABLE IF NOT EXISTS _migrations (
    filename   TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const applied = new Set(
  db.prepare('SELECT filename FROM _migrations').all().map((r) => r.filename)
);

const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

let ranAny = false;
for (const file of files) {
  if (applied.has(file)) continue;
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  const run = db.transaction(() => {
    db.exec(sql);
    db.prepare('INSERT INTO _migrations (filename) VALUES (?)').run(file);
  });
  run();
  console.log(`Applied migration: ${file}`);
  ranAny = true;
}

if (!ranAny) console.log('No pending migrations. Database is up to date.');
