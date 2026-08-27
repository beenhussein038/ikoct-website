// Seeds the database with:
//   1) one super-admin account, from .env — so someone can log into /admin
//   2) the five existing programs, copied verbatim from programs.html, so the
//      "Programs" page can move from hard-coded HTML to the database without
//      losing or inventing any content.
//   3) NOTHING for events — events must be entered by a real admin through
//      the dashboard, since inventing sample events would violate the "do
//      not invent content" rule. The frontend's static fallback (see
//      frontend/script.js) covers the empty-state gracefully in the meantime.
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const config = require('../config/config');

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// --- 1. Super admin -----------------------------------------------------
const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const adminName = process.env.SEED_ADMIN_NAME || 'IKOCT Administrator';

if (!adminEmail || !adminPassword) {
  console.error(
    'SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env before seeding.'
  );
  process.exit(1);
}

const existingAdmin = db
  .prepare('SELECT id FROM admins WHERE email = ?')
  .get(adminEmail);

if (!existingAdmin) {
  const hash = bcrypt.hashSync(adminPassword, 12);
  db.prepare(
    `INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, 'super_admin')`
  ).run(adminName, adminEmail, hash);
  console.log(`Created super admin: ${adminEmail}`);
} else {
  console.log(`Admin already exists: ${adminEmail} (skipped)`);
}

// --- 2. Real programs, copied from the existing programs.html -----------
const programs = [
  {
    title: 'Education Support Program',
    summary: 'Supporting orphans across Ikara local government with access to education.',
  },
  {
    title: 'Healthcare Program',
    summary: 'Providing healthcare support to orphans across Ikara local government.',
  },
  {
    title: 'Feeding Program',
    summary: 'Providing regular, nutritious meals to orphans in our care.',
  },
  {
    title: 'Clothing Program',
    summary: 'Providing clothing support to orphans across Ikara local government.',
  },
  {
    title: 'Skills Acquisition & Empowerment',
    summary: 'Equipping older beneficiaries with vocational skills for self-reliance.',
  },
];

const insertProgram = db.prepare(`
  INSERT INTO programs (title, slug, summary, body, is_active, display_order)
  VALUES (@title, @slug, @summary, @body, 1, @display_order)
`);

const existingSlugs = new Set(
  db.prepare('SELECT slug FROM programs').all().map((r) => r.slug)
);

programs.forEach((p, i) => {
  const slug = slugify(p.title);
  if (existingSlugs.has(slug)) return;
  insertProgram.run({
    title: p.title,
    slug,
    summary: p.summary,
    // NOTE: the full existing body copy from programs.html should be pasted
    // in by an admin/editor via the dashboard — this seed only carries the
    // title/summary since that's what could be safely extracted verbatim
    // without guessing at paragraph boundaries in the source HTML.
    body: p.summary,
    display_order: i,
  });
  console.log(`Seeded program: ${p.title}`);
});

console.log('Seed complete.');
