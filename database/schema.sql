create table if not exists cybersense_users (
  id text primary key,
  username text not null,
  email text not null unique,
  role text not null check (role in ('user', 'admin')),
  created_at text not null,
  last_login_at text not null,
  total_score integer not null default 0,
  quizzes_completed integer not null default 0,
  streak integer not null default 0,
  longest_streak integer not null default 0,
  quiz_scores jsonb not null default '{}'::jsonb,
  achievements jsonb not null default '[]'::jsonb
);

create table if not exists cybersense_pending_otps (
  email text primary key,
  username text not null,
  code_hash text not null,
  expires_at text not null,
  attempts integer not null default 0,
  created_at text not null
);

create index if not exists cybersense_users_total_score_idx
  on cybersense_users (total_score desc, quizzes_completed desc, last_login_at desc);

create index if not exists cybersense_pending_otps_expires_at_idx
  on cybersense_pending_otps (expires_at);
