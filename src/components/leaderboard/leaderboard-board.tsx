import type { LeaderboardEntry } from "@/types/quiz";

type LeaderboardBoardProps = {
  entries: LeaderboardEntry[];
  title?: string;
};

export function LeaderboardBoard({
  entries,
  title = "Leaderboard foundation",
}: LeaderboardBoardProps) {
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
            Rankings
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          Ready
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {sortedEntries.length ? (
          sortedEntries.map((entry, index) => (
            <div
              key={`${entry.name}-${entry.score}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-cyan-100">
                  #{index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{entry.name}</p>
                  <p className="text-xs text-slate-400">{entry.badge}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-cyan-100">{entry.score}</p>
                <p className="text-xs text-slate-400">{entry.streak} day streak</p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
            No rankings yet. Complete a quiz to appear once your account is signed in.
          </div>
        )}
      </div>
    </section>
  );
}
