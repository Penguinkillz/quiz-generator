"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateQuizFromFiles, generateQuizFromText, QuizQuestion } from "@/lib/api";

interface Props {
  onQuizReady: (questions: QuizQuestion[]) => void;
}

export default function QuizForm({ onQuizReady }: Props) {
  const [topics, setTopics] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("mixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function parseTopics(raw: string): string[] {
    return raw.split(/[\n,]/).map((t) => t.trim()).filter(Boolean);
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const topicList = parseTopics(topics);
    if (!topicList.length) {
      setError("Add at least one topic.");
      return;
    }
    if (!files.length && !sourceText.trim()) {
      setError("Upload a PDF/DOCX or paste source text (or both).");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (files.length > 0) {
        data = await generateQuizFromFiles(topicList, numQuestions, difficulty, sourceText, files);
      } else {
        data = await generateQuizFromText(
          topicList,
          [{ title: "User input", content: sourceText.trim() }],
          numQuestions,
          difficulty
        );
      }
      onQuizReady(data.questions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topics */}
        <div className="rounded-xl border border-white/8 bg-[#0f172a]/60 p-4 ring-0 transition-all focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Topics</span>
            <span className="text-[11px] text-slate-500">one per line or comma-separated</span>
          </div>
          <textarea
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="e.g. Photosynthesis, Cell division, DNA replication"
            rows={3}
            className="w-full resize-none bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
          />
        </div>

        {/* File upload */}
        <div
          className={cn(
            "rounded-xl border border-dashed border-white/10 bg-[#0f172a]/40 p-4 transition-all",
            "hover:border-sky-500/30 hover:bg-sky-500/5 cursor-pointer"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            multiple
            className="hidden"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []);
              setFiles((prev) => [...prev, ...picked]);
              e.target.value = "";
            }}
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-5 w-5 text-slate-500" />
            <p className="text-sm text-slate-400">
              <span className="font-medium text-sky-400">Upload PDF or DOCX</span>{" "}
              <span className="text-slate-500">— multiple files supported</span>
            </p>
            <p className="text-[11px] text-slate-600">Max 10MB per file</p>
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-300"
              >
                <FileText className="h-3 w-3" />
                <span className="max-w-[140px] truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-sky-400/60 hover:text-sky-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Paste text */}
        <div className="rounded-xl border border-white/8 bg-[#0f172a]/60 p-4 ring-0 transition-all focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Source material</span>
            <span className="text-[11px] text-slate-500">paste notes or text</span>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Or paste your notes, article text, lecture content here..."
            rows={6}
            className="w-full resize-y bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
          />
        </div>

        {/* Settings row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/8 bg-[#0f172a]/60 p-4 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/20 transition-all ring-0">
            <div className="mb-2 text-xs font-medium text-slate-300">Questions</div>
            <input
              type="number"
              min={3}
              max={30}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full bg-transparent text-sm text-slate-200 outline-none"
            />
          </div>
          <div className="rounded-xl border border-white/8 bg-[#0f172a]/60 p-4 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/20 transition-all ring-0">
            <div className="mb-2 text-xs font-medium text-slate-300">Difficulty</div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-200 outline-none"
            >
              <option value="mixed" className="bg-[#0f172a]">Mixed</option>
              <option value="easy" className="bg-[#0f172a]">Easy</option>
              <option value="medium" className="bg-[#0f172a]">Medium</option>
              <option value="hard" className="bg-[#0f172a]">Hard</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200",
            "bg-gradient-to-r from-sky-400 to-sky-500",
            "shadow-lg shadow-sky-500/25",
            "hover:shadow-sky-500/40 hover:scale-[1.01]",
            "active:scale-[0.99]",
            "disabled:opacity-60 disabled:cursor-wait disabled:scale-100"
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating quiz…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate quiz
            </span>
          )}
        </button>
      </form>
    </motion.div>
  );
}
