CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  account_type VARCHAR(20) NOT NULL DEFAULT 'user'
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_started TIMESTAMPTZ NOT NULL,
  session_ended TIMESTAMPTZ NOT NULL,
  CONSTRAINT sessions_end_after_start CHECK (session_ended >= session_started)
);

CREATE INDEX sessions_user_id_session_started_idx
  ON sessions (user_id, session_started);
