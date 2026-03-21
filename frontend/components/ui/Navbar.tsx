"use client";

import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg shadow-sky-500/25">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-jakarta text-base font-semibold text-white">
            Quiz Generator
          </span>
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-400">
            Beta
          </span>
        </div>
        <div className="text-xs text-slate-500">Powered by Groq + Llama 3</div>
      </div>
    </nav>
  );
}
