-- Portable schema for moving the portfolio JSON store to a relational database later.
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  intro TEXT NOT NULL,
  status TEXT NOT NULL,
  avatar_alt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_project (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  repo_url TEXT DEFAULT '',
  project_url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_project_technology (
  project_id TEXT NOT NULL REFERENCES portfolio_project(id) ON DELETE CASCADE,
  technology TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, technology)
);

CREATE TABLE IF NOT EXISTS portfolio_experience (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  description TEXT NOT NULL,
  company_url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);
