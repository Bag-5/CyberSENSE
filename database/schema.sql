create table if not exists cybersense_users (
  id text primary key,
  username text not null,
  email text not null unique,
  role text not null check (role in ('user', 'admin', 'superadmin')),
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

create table if not exists cybersense_platform_settings (
  id text primary key,
  settings jsonb not null,
  updated_at text not null
);

create table if not exists cybersense_analytics_events (
  id text primary key,
  event_type text not null,
  module text not null,
  slug text,
  category text,
  user_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at text not null
);

create table if not exists cybersense_quiz_attempts (
  id text primary key,
  user_id text not null references cybersense_users(id) on delete cascade,
  quiz_slug text not null,
  quiz_title text not null,
  question_id text not null,
  question_text text not null,
  category text not null,
  difficulty text not null,
  selected_answer text not null,
  correct_answer text not null,
  is_correct boolean not null,
  points integer not null default 0,
  created_at text not null
);

create index if not exists cybersense_users_total_score_idx
  on cybersense_users (total_score desc, quizzes_completed desc, last_login_at desc);

create index if not exists cybersense_pending_otps_expires_at_idx
  on cybersense_pending_otps (expires_at);

create index if not exists cybersense_platform_settings_updated_at_idx
  on cybersense_platform_settings (updated_at desc);

create index if not exists cybersense_analytics_events_created_at_idx
  on cybersense_analytics_events (created_at desc);

create index if not exists cybersense_analytics_events_module_idx
  on cybersense_analytics_events (module, event_type, created_at desc);

create index if not exists cybersense_analytics_events_slug_idx
  on cybersense_analytics_events (slug, category, created_at desc);

create index if not exists cybersense_quiz_attempts_created_at_idx
  on cybersense_quiz_attempts (created_at desc);

create index if not exists cybersense_quiz_attempts_question_idx
  on cybersense_quiz_attempts (quiz_slug, question_id, is_correct, created_at desc);
