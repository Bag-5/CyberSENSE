import { cn } from "@/utils/cn";
import type { QuizAchievement } from "@/types/quiz";

type AchievementBadgeProps = {
  achievement: QuizAchievement;
  unlocked?: boolean;
  compact?: boolean;
};

export function AchievementBadge({
  achievement,
  unlocked = false,
  compact = false,
}: AchievementBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-4 transition duration-300",
        unlocked
          ? "border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-slate-950/60",
        compact && "p-3",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-semibold",
            unlocked
              ? "border-cyan-300/20 bg-cyan-400/15 text-cyan-100"
              : "border-white/10 bg-white/5 text-slate-400",
          )}
        >
          {achievement.icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{achievement.title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
}
