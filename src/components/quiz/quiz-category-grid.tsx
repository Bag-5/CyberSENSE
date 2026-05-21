import Link from "next/link";

import { quizCategories } from "@/data/quizzes";

export function QuizCategoryGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {quizCategories.map((quiz) => (
        <Link
          key={quiz.slug}
          href={`/quizzes/${quiz.slug}`}
          className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/8"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-xl">
                {quiz.icon}
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">
                  {quiz.accent}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {quiz.title}
                </h3>
              </div>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-400">
              {quiz.questions.length} questions
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">{quiz.description}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
            Start quiz
            <span className="transition group-hover:translate-x-1">→</span>
          </div>
        </Link>
      ))}
    </section>
  );
}
