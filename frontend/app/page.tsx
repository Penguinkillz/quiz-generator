"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, FileText, Zap } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import QuizForm from "@/components/sections/QuizForm";
import QuizArea from "@/components/sections/QuizArea";
import { QuizQuestion } from "@/lib/api";

const features = [
  {
    icon: FileText,
    title: "Upload your notes",
    desc: "PDF and DOCX files supported. Paste text or upload — or both.",
  },
  {
    icon: Brain,
    title: "AI-powered questions",
    desc: "Llama 3 generates relevant MCQs grounded in your source material.",
  },
  {
    icon: Zap,
    title: "Instant results",
    desc: "Answer, submit, and get a full breakdown with strength analysis.",
  },
];

export default function Home() {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-sky-500/5 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[500px] rounded-full bg-sky-600/4 blur-[100px]" />
      </div>

      <Navbar />

      <main className="relative mx-auto px-6 pb-24 pt-12">
        <AnimatePresence mode="wait">
          {/* ── Landing + Form view ── */}
          {!questions && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-6xl"
            >
              {/* Hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="mb-12 text-center"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Powered by Groq + Llama 3.3 70B — Free
                </div>
                <h1 className="font-jakarta mb-4 bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent lg:text-6xl">
                  Turn your notes
                  <br />
                  <span className="bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">
                    into a quiz
                  </span>
                </h1>
                <p className="mx-auto max-w-lg text-base text-slate-400">
                  Upload PDFs, paste your notes, pick a difficulty — AI generates
                  multiple-choice questions. Answer one at a time, submit, and see
                  your score with a full breakdown.
                </p>
              </motion.div>

              {/* Feature cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
                className="mb-12 grid gap-4 sm:grid-cols-3"
              >
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-white/8 bg-[#0f172a]/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/20 hover:shadow-lg hover:shadow-sky-500/5"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10">
                      <f.icon className="h-4 w-4 text-sky-400" />
                    </div>
                    <p className="mb-1 text-sm font-semibold text-slate-200">{f.title}</p>
                    <p className="text-xs leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                ))}
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
                className="mx-auto max-w-2xl"
              >
                <QuizForm onQuizReady={(qs) => setQuestions(qs)} />
              </motion.div>
            </motion.div>
          )}

          {/* ── Active quiz view ── */}
          {questions && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-2xl"
            >
              <QuizArea
                questions={questions}
                onReset={() => setQuestions(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!questions && (
        <footer className="border-t border-white/5 py-8 text-center">
          <p className="text-xs text-slate-600">
            Quiz Generator · Part of{" "}
            <span className="text-slate-500">Micro AI Tools</span> ·{" "}
            <a
              href="https://github.com/Penguinkillz/Micro-AI-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:text-sky-500 transition-colors"
            >
              GitHub
            </a>
          </p>
        </footer>
      )}
    </div>
  );
}
