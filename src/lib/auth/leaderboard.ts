import { getLeaderboardUsers } from "@/lib/auth/store";

export async function loadLeaderboardEntries() {
  return getLeaderboardUsers();
}
