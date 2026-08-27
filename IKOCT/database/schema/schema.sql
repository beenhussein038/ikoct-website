-- =============================================================================
-- IKOCT DATABASE SCHEMA
-- Engine: SQLite (file-based, zero-config). Written to be trivially portable
-- to PostgreSQL later (plain types, explicit constraints, no SQLite-only
-- features besides AUTOINCREMENT).
-- =============================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- ADMINS — dashboard users. No plaintext passwords, ever.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,             -- bcrypt hash, never plaintext
    role          TEXT NOT NULL DEFAULT 'editor'
                    CHECK (role IN ('super_admin', 'editor')),
    is_active     INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- EVENTS — powers the homepage sliding events section (§5 of the brief)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    slug          TEXT NOT NULL UNIQUE,
    description   TEXT NOT NULL,
    location      TEXT,
    image_path    TEXT,                      -- relative path under /images
    start_date    TEXT NOT NULL,              -- ISO 8601 datetime
    end_date      TEXT,
    is_active     INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
    display_order INTEGER NOT NULL DEFAULT 0, -- controls slider order
    created_by    INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_active_order ON events (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events (start_date);

-- ---------------------------------------------------------------------------
-- NEWS / ANNOUNCEMENTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS news (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    body         TEXT NOT NULL,
    image_path   TEXT,
    is_published INTEGER NOT NULL DEFAULT 0 CHECK (is_published IN (0,1)),
    published_at TEXT,
    created_by   INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- BLOG POSTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    excerpt      TEXT,
    body         TEXT NOT NULL,
    author_name  TEXT,
    image_path   TEXT,
    is_published INTEGER NOT NULL DEFAULT 0 CHECK (is_published IN (0,1)),
    published_at TEXT,
    created_by   INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- SUCCESS STORIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stories (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    child_name   TEXT,                        -- may be a first name only, for privacy
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    image_path   TEXT,
    is_published INTEGER NOT NULL DEFAULT 0 CHECK (is_published IN (0,1)),
    created_by   INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- PROGRAMS (education, healthcare, feeding, clothing, empowerment...)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS programs (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    slug          TEXT NOT NULL UNIQUE,
    summary       TEXT,
    body          TEXT NOT NULL,
    icon          TEXT,                       -- e.g. font-awesome class name
    image_path    TEXT,
    is_active     INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_by    INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- PROJECTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    slug          TEXT NOT NULL UNIQUE,
    summary       TEXT,
    body          TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'ongoing'
                    CHECK (status IN ('planned', 'ongoing', 'completed')),
    image_path    TEXT,
    is_active     INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_by    INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- GALLERY IMAGES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_images (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    caption       TEXT,
    category      TEXT,                       -- e.g. 'education', 'health', 'events'
    image_path    TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active     INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
    created_by    INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- CONTACT MESSAGES — from the public contact form
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    subject     TEXT,
    message     TEXT NOT NULL,
    is_read     INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0,1)),
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- DONATIONS — records donation intents/config only.
-- No card data is ever stored here; that stays with the payment processor
-- (Paystack etc). This table is for the org's own record-keeping.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_name       TEXT,
    donor_email      TEXT,
    amount           REAL NOT NULL,
    currency         TEXT NOT NULL DEFAULT 'NGN',
    purpose          TEXT,                    -- e.g. 'general', 'sponsor-a-child'
    payment_reference TEXT UNIQUE,             -- reference returned by the gateway
    status           TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'successful', 'failed')),
    created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- SETTINGS — simple key/value store for site-wide, admin-editable config
-- (e.g. Paystack public key, org phone/email, social links)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
    key         TEXT PRIMARY KEY,
    value       TEXT,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- AUDIT LOG — who changed what, for accountability in a multi-admin dashboard
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id    INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    action      TEXT NOT NULL,                -- e.g. 'create_event', 'delete_story'
    entity_type TEXT NOT NULL,
    entity_id   INTEGER,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
