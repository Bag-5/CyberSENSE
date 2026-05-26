import { getUserById } from "@/lib/auth/store";
import { ensureDatabaseReady, getDatabase } from "@/lib/db/postgres";
import { getCurrentWeeklyCompetitionKey as getCurrentWeeklyCompetitionKeyUtil } from "@/lib/competition/utils";
import type { LeaderboardEntry } from "@/types/quiz";

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

export type WeeklyCompetitionResultInput = {
  userId: string;
  username: string;
  email: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
};

type WeeklyCompetitionRow = {
  competition_key: string;
  user_id: string;
  username: string;
  email: string;
  score: number;
  correct_count: number;
  total_questions: number;
  streak: number;
  badge: string;
  completed_at: string;
  updated_at: string;
};

export async function recordWeeklyCompetitionResult(input: WeeklyCompetitionResultInput) {
  await ensureDatabaseReady();
  const db = getDatabase();
  const competitionKey = getCurrentWeeklyCompetitionKeyUtil();
  const user = await getUserById(input.userId);
  const updatedAt = new Date().toISOString();
  const completedAt = updatedAt;
  const badge = badgeForScore(input.score);

  await db`
    insert into cybersense_weekly_competition_entries (
      competition_key,
      user_id,
      username,
      email,
      score,
      correct_count,
      total_questions,
      streak,
      badge,
      completed_at,
      updated_at
    ) values (
      ${competitionKey},
      ${input.userId},
      ${input.username},
      ${input.email.toLowerCase().trim()},
      ${input.score},
      ${input.correctCount},
      ${input.totalQuestions},
      ${user?.streak ?? 0},
      ${badge},
      ${completedAt},
      ${updatedAt}
    )
    on conflict (competition_key, user_id) do update set
      username = excluded.username,
      email = excluded.email,
      score = greatest(cybersense_weekly_competition_entries.score, excluded.score),
      correct_count = greatest(cybersense_weekly_competition_entries.correct_count, excluded.correct_count),
      total_questions = excluded.total_questions,
      streak = excluded.streak,
      badge = excluded.badge,
      completed_at = case
        when excluded.score >= cybersense_weekly_competition_entries.score then excluded.completed_at
        else cybersense_weekly_competition_entries.completed_at
      end,
      updated_at = excluded.updated_at
  `;

  return competitionKey;
}

export async function loadWeeklyCompetitionEntries() {
  await ensureDatabaseReady();
  const db = getDatabase();
  const competitionKey = getCurrentWeeklyCompetitionKeyUtil();

  const rows = await db<WeeklyCompetitionRow[]>`
    select
      competition_key,
      user_id,
      username,
      email,
      score,
      correct_count,
      total_questions,
      streak,
      badge,
      completed_at,
      updated_at
    from cybersense_weekly_competition_entries
    where competition_key = ${competitionKey}
    order by score desc, correct_count desc, completed_at asc, updated_at asc
  `;

  return rows.map<LeaderboardEntry>((row) => ({
    name: row.username,
    score: row.score,
    streak: row.streak,
    badge: row.badge,
  }));
}

export function getCurrentWeeklyCompetitionKey() {
  return getCurrentWeeklyCompetitionKeyUtil();
}
