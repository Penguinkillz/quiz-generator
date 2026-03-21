"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/lib/api";

type Phase = "taking" | "results";

interface Props {
  questions: QuizQuestion[];
  onReset: () => void;
}

export default function QuizArea({ questions, onReset }: Props) {
  const [phase, setPhase] = useState<Phase>("taking");
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  function handleSelect(qIdx: number, option: string) {
    if (phase === "results") return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: option }));
  }

  function handleSubmit() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i]?.trim() === q.answer?.trim()) correct++;
    });
    setScore(correct);
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Meta header */}
      <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#0f172a]/60 px-5 py-3">
        <span className="text-sm font-medium text-slate-300">
          {phase === "taking"
            ? `${questions.length} questions — select your answers`
            : `${score} / ${questions.length} correct`}
        </span>
        {phase === "results" && (
          <button
            onClick={onReset}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            Generate new quiz
          </button>
        )}
      </div>

      {/* Questions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {questions.map((q, qIdx) => {
            const userPick = userAnswers[qIdx];
            const isCorrect = phase === "results" && userPick?.trim() === q.answer?.trim();
            const isWrong = phase === "results" && userPick && !isCorrect;

            return (
              <motion.article
                key={qIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIdx * 0.04, duration: 0.4, ease: "easeOut" }}
                className="rounded-xl border border-white/8 bg-[#0f172a]/60 p-5"
              >
                {/* Question header */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-md border border-white/10 bg-[#020617] px-2 py-0.5 text-xs text-slate-500">
                    Q{qIdx + 1}
                  </span>
                  {phase === "results" && (
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        isCorrect
                          ? "border border-sky-500/30 bg-sky-500/10 text-sky-400"
                          : "border border-red-500/30 bg-red-500/10 text-red-400"
                      )}
                    >
                      {isCorrect ? (
                        <><CheckCircle2 className="h-3 w-3" /> Correct</>
                      ) : (
                        <><XCircle className="h-3 w-3" /> Wrong</>
                      )}
                    </span>
                  )}
                </div>

                {/* Question text */}
                <p className="mb-4 text-sm font-medium leading-relaxed text-slate-200">
                  {q.question}
                </p>

                {/* Options */}
                <div className="space-y-2">
                  {(q.options ?? []).map((opt, oIdx) => {
                    const isCorrectOpt = phase === "results" && opt.trim() === q.answer?.trim();
                    const isUserWrong = phase === "results" && opt === userPick && !isCorrectOpt;
                    const isSelected = userPick === opt;

                    return (
                      <label
                        key={oIdx}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-all duration-150",
                          phase === "taking" && [
                            "border-white/8 hover:border-sky-500/30 hover:bg-sky-500/5",
                            isSelected && "border-sky-500/40 bg-sky-500/10 text-sky-200",
                          ],
                          phase === "results" && [
                            isCorrectOpt && "border-sky-500/50 bg-sky-500/10 text-sky-200",
                            isUserWrong && "border-red-500/50 bg-red-500/10 text-red-300",
                            !isCorrectOpt && !isUserWrong && "border-white/5 text-slate-500",
                          ]
                        )}
                      >
                        <input
                          type="radio"
                          name={`q-${qIdx}`}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleSelect(qIdx, opt)}
                          disabled={phase === "results"}
                          className="accent-sky-500"
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>

                {/* Results reveal */}
                {phase === "results" && (
                  <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500">Correct answer</span>
                      <span className="font-medium text-sky-400">{q.answer}</span>
                    </div>
                    {q.explanation && (
                      <p className="text-xs leading-relaxed text-slate-500">{q.explanation}</p>
                    )}
                  </div>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Submit button — taking phase only */}
      {phase === "taking" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          type="button"
          onClick={handleSubmit}
          className={cn(
            "w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200",
            "bg-gradient-to-r from-sky-400 to-sky-500",
            "shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01]",
            "active:scale-[0.99]"
          )}
        >
          Submit answers
        </motion.button>
      )}
    </motion.div>
  );
}
