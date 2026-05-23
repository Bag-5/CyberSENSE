import { cn } from "@/utils/cn";

type CyberButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type CyberButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<CyberButtonVariant, string> = {
  primary: "cyber-button-primary hover:brightness-105",
  secondary: "cyber-button-secondary hover:bg-white/10",
  ghost: "cyber-button-ghost hover:bg-white/5",
  danger: "cyber-button-danger hover:bg-rose-400/18",
};

const buttonSizes: Record<CyberButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

export function cyberButtonClasses(
  variant: CyberButtonVariant = "primary",
  size: CyberButtonSize = "md",
  className?: string,
) {
  return cn(
    "cyber-button transition duration-300 ease-out focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

export function cyberPanelClasses(className?: string) {
  return cn(
    "cyber-panel rounded-[2rem] backdrop-blur-xl",
    className,
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <div className={cn("space-y-3", isCenter && "text-center", className)}>
      {eyebrow ? (
        <p className="cyber-eyebrow text-sm font-semibold tracking-[0.24em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="cyber-title text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "cyber-body text-sm leading-6 sm:text-base",
            isCenter ? "mx-auto max-w-3xl" : "max-w-3xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function LoadingSkeleton({
  className,
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("space-y-4", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 animate-pulse rounded-full bg-white/10"
          style={{ width: `${100 - index * 14}%` }}
        />
      ))}
    </div>
  );
}

export function LoadingSurface({
  title = "Loading CyberSENSE",
  description = "Preparing the lab, analysis tools, and learning surfaces.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[55vh] w-full max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className={cyberPanelClasses("w-full p-6 sm:p-8")}>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <p className="cyber-eyebrow text-sm font-semibold tracking-[0.24em] uppercase">
              Please wait
            </p>
            <h1 className="cyber-title text-3xl font-black tracking-[-0.06em] sm:text-4xl">
              {title}
            </h1>
            <p className="cyber-body max-w-xl text-sm leading-6 sm:text-base">
              {description}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <LoadingSkeleton lines={4} />
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <LoadingSkeleton lines={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorSurface({
  title = "Something glitched in the training stack.",
  description = "We could not load this screen right now. Try again or return to the dashboard.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[55vh] w-full max-w-4xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className={cyberPanelClasses("w-full p-6 sm:p-8")}>
        <div className="space-y-4">
          <p className="cyber-eyebrow text-sm font-semibold tracking-[0.24em] uppercase">
            Error state
          </p>
          <h1 className="cyber-title text-3xl font-black tracking-[-0.06em] sm:text-4xl">
            {title}
          </h1>
          <p className="cyber-body max-w-2xl text-sm leading-6 sm:text-base">
            {description}
          </p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className={cyberButtonClasses("primary", "md", "mt-2")}
            >
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
