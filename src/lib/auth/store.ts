import { generateId } from "@/lib/auth/crypto";
import { ensureDatabaseReady, getDatabase } from "@/lib/db/postgres";
import type {
  AuthStore,
  LeaderboardUser,
  PendingOtpRecord,
  PublicSessionUser,
  UserRecord,
} from "@/lib/auth/types";

type UserRow = {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  last_login_at: string;
  total_score: number;
  quizzes_completed: number;
  streak: number;
  longest_streak: number;
  quiz_scores: Record<string, number> | null;
  achievements: string[] | null;
};

type PendingOtpRow = {
  email: string;
  username: string;
  code_hash: string;
  expires_at: string;
  attempts: number;
  created_at: string;
};

function toQuizScores(value: Record<string, number> | null | undefined) {
  return value && typeof value === "object" ? value : {};
}

function toAchievements(value: string[] | null | undefined) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapUserRow(row: UserRow): UserRecord {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
    totalScore: row.total_score,
    quizzesCompleted: row.quizzes_completed,
    streak: row.streak,
    longestStreak: row.longest_streak,
    quizScores: toQuizScores(row.quiz_scores),
    achievements: toAchievements(row.achievements),
  };
}

function mapPendingOtpRow(row: PendingOtpRow): PendingOtpRecord {
  return {
    email: row.email,
    username: row.username,
    codeHash: row.code_hash,
    expiresAt: row.expires_at,
    attempts: row.attempts,
  };
}

function badgeForScore(score: number) {
  if (score >= 900) {
    return "Cyber Defender";
  }
  if (score >= 700) {
    return "Threat Hunter";
  }
  if (score >= 400) {
    return "Scam Spotter";
  }
  return "Cyber Rookie";
}

export async function readAuthStore(): Promise<AuthStore> {
  await ensureDatabaseReady();
  const db = getDatabase();

  const [users, pendingOtps] = await Promise.all([
    db<UserRow[]>`
      select
        id,
        username,
        email,
        role,
        created_at,
        last_login_at,
        total_score,
        quizzes_completed,
        streak,
        longest_streak,
        quiz_scores,
        achievements
      from cybersense_users
    `,
    db<PendingOtpRow[]>`
      select
        email,
        username,
        code_hash,
        expires_at,
        attempts,
        created_at
      from cybersense_pending_otps
    `,
  ]);

  return {
    users: Object.fromEntries(users.map((row) => [row.id, mapUserRow(row)])),
    usersByEmail: Object.fromEntries(users.map((row) => [row.email.toLowerCase().trim(), row.id])),
    pendingOtps: Object.fromEntries(pendingOtps.map((row) => [row.email.toLowerCase().trim(), mapPendingOtpRow(row)])),
  };
}

export async function writeAuthStore(store: AuthStore) {
  await ensureDatabaseReady();
  const db = getDatabase();

  await db.begin(async (tx) => {
    await tx`delete from cybersense_pending_otps`;
    await tx`delete from cybersense_users`;

    for (const user of Object.values(store.users)) {
      await tx`
        insert into cybersense_users (
          id, username, email, role, created_at, last_login_at,
          total_score, quizzes_completed, streak, longest_streak,
          quiz_scores, achievements
        ) values (
          ${user.id},
          ${user.username},
          ${user.email.toLowerCase().trim()},
          ${user.role},
          ${user.createdAt},
          ${user.lastLoginAt},
          ${user.totalScore},
          ${user.quizzesCompleted},
          ${user.streak},
          ${user.longestStreak},
          ${JSON.stringify(user.quizScores)}::jsonb,
          ${JSON.stringify(user.achievements)}::jsonb
        )
      `;
    }

    for (const otp of Object.values(store.pendingOtps)) {
      await tx`
        insert into cybersense_pending_otps (
          email, username, code_hash, expires_at, attempts, created_at
        ) values (
          ${otp.email.toLowerCase().trim()},
          ${otp.username},
          ${otp.codeHash},
          ${otp.expiresAt},
          ${otp.attempts},
          ${new Date().toISOString()}
        )
      `;
    }
  });
}

export async function setPendingOtp(record: PendingOtpRecord) {
  await ensureDatabaseReady();
  const db = getDatabase();

  await db`
    insert into cybersense_pending_otps (
      email, username, code_hash, expires_at, attempts, created_at
    ) values (
      ${record.email.toLowerCase().trim()},
      ${record.username},
      ${record.codeHash},
      ${record.expiresAt},
      ${record.attempts},
      ${new Date().toISOString()}
    )
    on conflict (email) do update set
      username = excluded.username,
      code_hash = excluded.code_hash,
      expires_at = excluded.expires_at,
      attempts = excluded.attempts
  `;
}

export async function consumePendingOtp(email: string) {
  await ensureDatabaseReady();
  const db = getDatabase();
  const normalizedEmail = email.toLowerCase().trim();

  const rows = await db<PendingOtpRow[]>`
    delete from cybersense_pending_otps
    where email = ${normalizedEmail}
    returning email, username, code_hash, expires_at, attempts, created_at
  `;

  const row = rows[0];
  return row ? mapPendingOtpRow(row) : null;
}

export async function deletePendingOtp(email: string) {
  await ensureDatabaseReady();
  const db = getDatabase();
  const normalizedEmail = email.toLowerCase().trim();

  await db`
    delete from cybersense_pending_otps
    where email = ${normalizedEmail}
  `;
}

export async function getPendingOtp(email: string) {
  await ensureDatabaseReady();
  const db = getDatabase();
  const normalizedEmail = email.toLowerCase().trim();

  const rows = await db<PendingOtpRow[]>`
    select email, username, code_hash, expires_at, attempts, created_at
    from cybersense_pending_otps
    where email = ${normalizedEmail}
    limit 1
  `;

  const row = rows[0];
  return row ? mapPendingOtpRow(row) : null;
}

export async function upsertUserFromSession(sessionUser: PublicSessionUser) {
  await ensureDatabaseReady();
  const db = getDatabase();
  const emailKey = sessionUser.email.toLowerCase().trim();
  const now = new Date().toISOString();

  const existing = await db<UserRow[]>`
    select
      id,
      username,
      email,
      role,
      created_at,
      last_login_at,
      total_score,
      quizzes_completed,
      streak,
      longest_streak,
      quiz_scores,
      achievements
    from cybersense_users
    where email = ${emailKey}
    limit 1
  `;

  if (existing[0]) {
    const updatedRows = await db<UserRow[]>`
      update cybersense_users
      set
        username = ${sessionUser.username},
        email = ${emailKey},
        role = ${sessionUser.role},
        last_login_at = ${now}
      where id = ${existing[0].id}
      returning
        id,
        username,
        email,
        role,
        created_at,
        last_login_at,
        total_score,
        quizzes_completed,
        streak,
        longest_streak,
        quiz_scores,
        achievements
    `;

    return mapUserRow(updatedRows[0]);
  }

  const newUser = createUserRecord(sessionUser.username, sessionUser.email, sessionUser.role);

  const inserted = await db<UserRow[]>`
    insert into cybersense_users (
      id, username, email, role, created_at, last_login_at,
      total_score, quizzes_completed, streak, longest_streak,
      quiz_scores, achievements
    ) values (
      ${newUser.id},
      ${newUser.username},
      ${newUser.email.toLowerCase().trim()},
      ${newUser.role},
      ${newUser.createdAt},
      ${newUser.lastLoginAt},
      ${newUser.totalScore},
      ${newUser.quizzesCompleted},
      ${newUser.streak},
      ${newUser.longestStreak},
      ${JSON.stringify(newUser.quizScores)}::jsonb,
      ${JSON.stringify(newUser.achievements)}::jsonb
    )
    returning
      id,
      username,
      email,
      role,
      created_at,
      last_login_at,
      total_score,
      quizzes_completed,
      streak,
      longest_streak,
      quiz_scores,
      achievements
  `;

  return mapUserRow(inserted[0]);
}

export async function updateQuizCompletion(userId: string, quizSlug: string, score: number) {
  await ensureDatabaseReady();
  const db = getDatabase();

  const rows = await db<UserRow[]>`
    select
      id,
      username,
      email,
      role,
      created_at,
      last_login_at,
      total_score,
      quizzes_completed,
      streak,
      longest_streak,
      quiz_scores,
      achievements
    from cybersense_users
    where id = ${userId}
    limit 1
  `;

  const row = rows[0];
  if (!row) {
    return null;
  }

  const user = mapUserRow(row);
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const previousLogin = user.lastLoginAt ? user.lastLoginAt.slice(0, 10) : null;

  if (previousLogin === todayKey) {
    user.streak = Math.max(user.streak, 1);
  } else if (previousLogin) {
    const prevDate = new Date(previousLogin);
    prevDate.setDate(prevDate.getDate() + 1);
    user.streak = prevDate.toISOString().slice(0, 10) === todayKey ? user.streak + 1 : 1;
  } else {
    user.streak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak, user.streak);
  user.lastLoginAt = now.toISOString();

  const previousScore = user.quizScores[quizSlug] ?? 0;
  if (score > previousScore) {
    user.quizScores[quizSlug] = score;
  }

  user.totalScore = Object.values(user.quizScores).reduce((total, value) => total + value, 0);
  user.quizzesCompleted = Object.keys(user.quizScores).length;

  if (user.quizzesCompleted >= 1 && !user.achievements.includes("first-quiz")) {
    user.achievements.push("first-quiz");
  }
  if (user.totalScore >= 900 && !user.achievements.includes("cyber-defender")) {
    user.achievements.push("cyber-defender");
  }

  const updatedRows = await db<UserRow[]>`
    update cybersense_users
    set
      last_login_at = ${user.lastLoginAt},
      total_score = ${user.totalScore},
      quizzes_completed = ${user.quizzesCompleted},
      streak = ${user.streak},
      longest_streak = ${user.longestStreak},
      quiz_scores = ${JSON.stringify(user.quizScores)}::jsonb,
      achievements = ${JSON.stringify(user.achievements)}::jsonb
    where id = ${user.id}
    returning
      id,
      username,
      email,
      role,
      created_at,
      last_login_at,
      total_score,
      quizzes_completed,
      streak,
      longest_streak,
      quiz_scores,
      achievements
  `;

  return mapUserRow(updatedRows[0]);
}

export async function getLeaderboardUsers() {
  await ensureDatabaseReady();
  const db = getDatabase();

  const rows = await db<UserRow[]>`
    select
      id,
      username,
      email,
      role,
      created_at,
      last_login_at,
      total_score,
      quizzes_completed,
      streak,
      longest_streak,
      quiz_scores,
      achievements
    from cybersense_users
    order by total_score desc, quizzes_completed desc, last_login_at desc
  `;

  return rows.map<LeaderboardUser>((row, index) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    score: row.total_score,
    quizzesCompleted: row.quizzes_completed,
    streak: row.streak,
    badge: badgeForScore(row.total_score),
    rank: index + 1,
  }));
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) {
    return email;
  }
  return `${name.slice(0, 2)}***@${domain}`;
}

export function buildSessionUser(user: UserRecord): PublicSessionUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

export function createUserRecord(username: string, email: string, role: "user" | "admin" = "user"): UserRecord {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    username,
    email,
    role,
    createdAt: now,
    lastLoginAt: now,
    totalScore: 0,
    quizzesCompleted: 0,
    streak: 0,
    longestStreak: 0,
    quizScores: {},
    achievements: [],
  };
}
