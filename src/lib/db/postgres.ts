import postgres, { type Sql } from "postgres";

let client: Sql | null = null;
let schemaReady: Promise<void> | null = null;

export function getDatabase() {
  if (!client) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }

    client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }

  return client;
}

async function createTables() {
  const db = getDatabase();

  await db`
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
    )
  `;

  await db`
    create table if not exists cybersense_pending_otps (
      email text primary key,
      username text not null,
      code_hash text not null,
      expires_at text not null,
      attempts integer not null default 0,
      created_at text not null
    )
  `;

  await db`
    create table if not exists cybersense_platform_settings (
      id text primary key,
      settings jsonb not null,
      updated_at text not null
    )
  `;

  await db`
    create table if not exists cybersense_analytics_events (
      id text primary key,
      event_type text not null,
      module text not null,
      slug text,
      category text,
      user_id text,
      metadata jsonb not null default '{}'::jsonb,
      created_at text not null
    )
  `;

  await db`
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
    )
  `;

  await db`
    create table if not exists cybersense_certificate_issues (
      id text primary key,
      user_id text not null references cybersense_users(id) on delete cascade,
      username text not null,
      email text not null,
      full_name text not null,
      certificate_type text not null check (certificate_type in ('quiz', 'milestone', 'training')),
      subject_key text,
      subject_title text not null,
      issued_at text not null,
      updated_at text not null
    )
  `;

  await db`
    create table if not exists cybersense_weekly_competition_entries (
      competition_key text not null,
      user_id text not null references cybersense_users(id) on delete cascade,
      username text not null,
      email text not null,
      score integer not null default 0,
      correct_count integer not null default 0,
      total_questions integer not null default 100,
      streak integer not null default 0,
      badge text not null,
      completed_at text not null,
      updated_at text not null,
      primary key (competition_key, user_id)
    )
  `;

  await db`
    create index if not exists cybersense_users_total_score_idx
    on cybersense_users (total_score desc, quizzes_completed desc, last_login_at desc)
  `;

  await db`
    create index if not exists cybersense_pending_otps_expires_at_idx
    on cybersense_pending_otps (expires_at)
  `;

  await db`
    create index if not exists cybersense_platform_settings_updated_at_idx
    on cybersense_platform_settings (updated_at desc)
  `;

  await db`
    create index if not exists cybersense_analytics_events_created_at_idx
    on cybersense_analytics_events (created_at desc)
  `;

  await db`
    create index if not exists cybersense_analytics_events_module_idx
    on cybersense_analytics_events (module, event_type, created_at desc)
  `;

  await db`
    create index if not exists cybersense_analytics_events_slug_idx
    on cybersense_analytics_events (slug, category, created_at desc)
  `;

  await db`
    create index if not exists cybersense_quiz_attempts_created_at_idx
    on cybersense_quiz_attempts (created_at desc)
  `;

  await db`
    create index if not exists cybersense_quiz_attempts_question_idx
    on cybersense_quiz_attempts (quiz_slug, question_id, is_correct, created_at desc)
  `;

  await db`
    create index if not exists cybersense_certificate_issues_issued_at_idx
    on cybersense_certificate_issues (issued_at desc)
  `;

  await db`
    create index if not exists cybersense_certificate_issues_user_idx
    on cybersense_certificate_issues (user_id, certificate_type, issued_at desc)
  `;

  await db`
    create index if not exists cybersense_weekly_competition_entries_score_idx
    on cybersense_weekly_competition_entries (competition_key, score desc, correct_count desc, updated_at asc)
  `;

  await db`
    alter table cybersense_users
    drop constraint if exists cybersense_users_role_check
  `;

  await db`
    alter table cybersense_users
    add constraint cybersense_users_role_check
    check (role in ('user', 'admin', 'superadmin'))
  `;
}

export async function ensureDatabaseReady() {
  if (!schemaReady) {
    schemaReady = createTables();
  }

  return schemaReady;
}
