// src/components/results/TopperCard.tsx
import React from "react";
import { Play, ExternalLink } from "lucide-react";
import { Topper, normalizeYoutubeEmbedUrl } from "../../data/toppers";

interface TopperCardProps {
  topper: Topper;
  key?: string | number;
}

export default function TopperCard({ topper }: TopperCardProps) {
  const embedUrl = normalizeYoutubeEmbedUrl(topper.videoUrl);
  const examUpper = topper.exam.toUpperCase();
  const isNeet = examUpper.includes("NEET");

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* 1. Standardized Video Player Area (9:16 Aspect Ratio) */}
      <div className="relative w-full aspect-[9/16] bg-slate-950 overflow-hidden">
        <iframe
          src={embedUrl}
          title={`${topper.name} — ${topper.exam} ${topper.year} Story`}
          className="w-full h-full border-0"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* 2. Structured Card Information Area */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          {/* Header Row: Student Name & Exam Pill */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-sans font-extrabold text-xl text-slate-900 dark:text-white tracking-tight leading-snug">
              {topper.name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold shrink-0 border ${
                isNeet
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60"
                  : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60"
              }`}
            >
              {topper.exam}
            </span>
          </div>

          {/* Subtitle: Exam • Year */}
          <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
            {topper.exam} • {topper.year} Batch
          </p>

          {/* Optional Verified Information ONLY — No Placeholders, No N/A */}
          {topper.physicsScore && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono">Physics Score</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {topper.physicsScore}
              </span>
            </div>
          )}

          {topper.achievement && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-sans text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Outcome: </span>
              {topper.achievement}
            </div>
          )}

          {topper.quote && (
            <p className="pt-2 text-xs italic text-slate-600 dark:text-slate-300 border-l-2 border-blue-400 pl-2">
              "{topper.quote}"
            </p>
          )}
        </div>

        {/* Action Link: Watch on YouTube */}
        {topper.externalUrl && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <a
              href={topper.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-3 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors uppercase tracking-wider"
              title={`Watch ${topper.name}'s story directly on YouTube`}
            >
              <Play className="h-3.5 w-3.5 fill-current text-blue-600 dark:text-blue-400" />
              <span>Watch on YouTube</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
