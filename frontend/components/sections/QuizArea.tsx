"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/lib/api";

type Phase = "taking" | "results";

interface Props {
  questions: QuizQuestion[];
  onReset: () => void;
}

export default function QuizArea({ questions, onReset }: Props) {
  const [phase, setPhase] = useState<Phase>("taking");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  const total = questions.length;
  const current = questions[currentIndex];
  const userPick = userAnswers[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  function handleSelect(option: string) {
    if (phase === "results") return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  }

  function handleSubmit() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i]?.trim() === q.answer?.trim()) correct++;
    });
    setScore(correct);
    setPhase("results");
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goTo(idx: number) {
    setCurrentIndex(Math.max(0, Math.min(total - 1, idx)));
  }

  const percentage = Math.round((score / total) * 100);
  const grade =
    percentage >= 90
      ? "Excellent!"
      : percentage >= 75
      ? "Well done!"
      : percentage >= 50
      ? "Good effort"
      : percentage >= 30
      ? "Keep practicing"
      : "Needs more study";

  const gradeColor =
    percentage >= 75
      ? "text-sky-400"
      : percentage >= 50
      ? "text-yellow-400"
      : "text-red-400";

  const correctOnes = questions.filter(
    (q, i) => userAnswers[i]?.trim() === q.answer?.trim()
  );
  const wrongOnes = questions.filter(
    (q, i) => userAnswers[i] && userAnswers[i]?.trim() !== q.answer?.trim()
  );
  const skippedOnes = questions.filter((_, i) => !userAnswers[i]);

  const isCurrentCorrect =
    phase === "results" && userPick?.trim() === current.answer?.trim();
  const isCurrentWrong =
    phase === "results" && !!userPick && !isCurrentCorrect;
  const isCurrentSkipped = phase === "results" && !userPick;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#0f172a]/60 px-5 py-3.5">
        {phase === "taking" ? (
          <div className="text-sm text-slate-400">
            Question{" "}
            <span className="font-semibold text-white">{currentIndex + 1}</span>{" "}
            of{" "}
            <span className="font-semibold text-white">{total}</span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-slate-500">{answeredCount} answered</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-400">Score</span>
            <span className={cn("text-xl font-bold", gradeColor)}>
              {score}/{total}
            </span>
            <span className="text-slate-500">— {grade}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {phase === "taking" && (
            <button
              onClick={handleSubmit}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200",
                "bg-gradient-to-r from-sky-400 to-sky-500 text-slate-900",
                "shadow-md shadow-sky-500/20 hover:shadow-sky-500/35 hover:scale-[1.02]",
                "active:scale-[0.98]"
              )}
            >
              Submit Quiz
            </button>
          )}
          {phase === "results" && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:border-sky-500/30 hover:text-sky-300 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Quiz
            </button>
          )}
        </div>
      </div>

      {/* ── Question card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${phase}-${currentIndex}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="rounded-2xl border border-white/8 bg-[#0f172a]/60 p-7"
        >
          {/* Badge row */}
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-md border border-white/10 bg-[#020617] px-2.5 py-1 text-xs text-slate-500">
              Q{currentIndex + 1}
            </span>
            {phase === "results" && (
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium",
                  isCurrentCorrect &&
                    "border border-sky-500/30 bg-sky-500/10 text-sky-400",
                  isCurrentWrong &&
                    "border border-red-500/30 bg-red-500/10 text-red-400",
                  isCurrentSkipped &&
                    "border border-slate-700 bg-slate-800/50 text-slate-500"
                )}
              >
                {isCurrentCorrect && (
                  <>
                    <CheckCircle2 className="h-3 w-3" /> Correct
                  </>
                )}
                {isCurrentWrong && (
                  <>
                    <XCircle className="h-3 w-3" /> Wrong
                  </>
                )}
                {isCurrentSkipped && "Skipped"}
              </span>
            )}
          </div>

          {/* Question text */}
          <p className="mb-7 text-lg font-medium leading-relaxed text-slate-100">
            {current.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {(current.options ?? []).map((opt, i) => {
              const isSelected = userPick === opt;
              const isCorrectOpt =
                phase === "results" && opt.trim() === current.answer?.trim();
              const isUserWrong =
                phase === "results" && isSelected && !isCorrectOpt;

              return (
                <label
                  key={i}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-sm transition-all duration-150",
                    phase === "taking" && [
                      isSelected
                        ? "border-sky-500/60 bg-sky-500/10 text-sky-200"
                        : "border-white/8 text-slate-300 hover:border-sky-500/30 hover:bg-sky-500/5",
                    ],
                    phase === "results" && [
                      isCorrectOpt &&
                        "border-sky-500/50 bg-sky-500/10 text-sky-200",
                      isUserWrong &&
                        "border-red-500/50 bg-red-500/10 text-red-300",
                      !isCorrectOpt &&
                        !isUserWrong &&
                        "cursor-default border-white/5 text-slate-500",
                    ]
                  )}
                >
                  <input
                    type="radio"
                    name={`q-${currentIndex}`}
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleSelect(opt)}
                    disabled={phase === "results"}
                    className="h-4 w-4 shrink-0 accent-sky-500"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>

          {/* Answer + explanation reveal */}
          {phase === "results" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-6 space-y-2 rounded-xl border border-white/5 bg-[#020617]/70 p-4"
            >
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-slate-500">Correct answer</span>
                <span className="font-medium text-sky-400">{current.answer}</span>
              </div>
              {current.explanation && (
                <p className="border-t border-white/5 pt-2 text-xs leading-relaxed text-slate-500">
                  {current.explanation}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Question number navigator ── */}
      <div className="flex flex-wrap justify-center gap-2">
        {questions.map((q, i) => {
          const isAnswered = !!userAnswers[i];
          const isCurrent = i === currentIndex;
          const isCorrect =
            phase === "results" && userAnswers[i]?.trim() === q.answer?.trim();
          const isWrong =
            phase === "results" && isAnswered && !isCorrect;

          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-medium transition-all duration-150",
                isCurrent &&
                  "ring-2 ring-sky-400 ring-offset-1 ring-offset-[#020617]",
                phase === "taking" && [
                  isAnswered
                    ? "border border-sky-500/40 bg-sky-500/15 text-sky-300"
                    : "border border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300",
                ],
                phase === "results" && [
                  isCorrect &&
                    "border border-sky-500/40 bg-sky-500/15 text-sky-300",
                  isWrong &&
                    "border border-red-500/40 bg-red-500/15 text-red-300",
                  !isAnswered &&
                    "border border-slate-700 bg-slate-800/50 text-slate-600",
                ]
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* ── Prev / Next ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium transition-all",
            currentIndex === 0
              ? "cursor-not-allowed opacity-25 text-slate-600"
              : "text-slate-300 hover:border-white/20 hover:text-white"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === total - 1}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium transition-all",
            currentIndex === total - 1
              ? "cursor-not-allowed opacity-25 text-slate-600"
              : "text-slate-300 hover:border-white/20 hover:text-white"
          )}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Strength / Weakness — shown on last question in results ── */}
      {phase === "results" && currentIndex === total - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Analysis
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Score bar */}
          <div className="rounded-xl border border-white/8 bg-[#0f172a]/60 p-5">
            <div className="mb-3 flex items-baseline justify-between text-sm">
              <span className="font-medium text-slate-300">Overall score</span>
              <span className={cn("text-2xl font-bold", gradeColor)}>
                {percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className={cn(
                  "h-full rounded-full",
                  percentage >= 75
                    ? "bg-gradient-to-r from-sky-400 to-sky-500"
                    : percentage >= 50
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                    : "bg-gradient-to-r from-red-400 to-red-500"
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sky-400" />
                <span className="text-sm font-semibold text-sky-400">
                  Strengths ({correctOnes.length})
                </span>
              </div>
              {correctOnes.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Keep practicing — you&apos;ll get there!
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {correctOnes.map((q, i) => (
                    <li key={i} className="text-xs leading-relaxed text-slate-400">
                      ·{" "}
                      {q.question.length > 72
                        ? q.question.slice(0, 72) + "…"
                        : q.question}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Needs work */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">
                  Needs Work ({wrongOnes.length + skippedOnes.length})
                </span>
              </div>
              {wrongOnes.length === 0 && skippedOnes.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Perfect — nothing to improve here!
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {[...wrongOnes, ...skippedOnes].map((q, i) => (
                    <li key={i} className="text-xs leading-relaxed text-slate-400">
                      ·{" "}
                      {q.question.length > 72
                        ? q.question.slice(0, 72) + "…"
                        : q.question}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Insight blurb */}
          <div className="rounded-xl border border-white/5 bg-[#0f172a]/40 px-5 py-4 text-sm text-slate-400 leading-relaxed">
            {percentage >= 90 && "Outstanding! You have a strong grasp of this material. Try increasing the difficulty or adding more questions for an extra challenge."}
            {percentage >= 75 && percentage < 90 && "Great work! You understand most of the material. Review the questions in 'Needs Work' to close the gaps."}
            {percentage >= 50 && percentage < 75 && "Solid effort. Go back over the topics you missed and try generating another quiz on the same material."}
            {percentage >= 30 && percentage < 50 && "You're on the right track. Focus on the 'Needs Work' questions and re-read the source material before retrying."}
            {percentage < 30 && "This topic needs more attention. Try breaking it into smaller chunks and generating shorter, focused quizzes per subtopic."}
          </div>
        </motion.div>
      )}
    </div>
  );
}
