type ThreatQuizPlaceholderProps = {
  prompt: string;
};

export function ThreatQuizPlaceholder({ prompt }: ThreatQuizPlaceholderProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
      <div className="rounded-3xl border border-cyan-300/15 bg-cyan-400/8 p-5">
        <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
          Interactive quiz placeholder
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-300">{prompt}</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
        <p className="text-sm font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
          Sample answers
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["Open the link", "Verify independently", "Ignore and report"].map(
            (option) => (
              <div
                key={option}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {option}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

