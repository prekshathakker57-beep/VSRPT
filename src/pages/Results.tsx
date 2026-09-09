// src/pages/Results.tsx
import { useState } from "react";
import { Award, AlertTriangle } from "lucide-react";
import SEO from "../components/SEO";
import TopperCard from "../components/results/TopperCard";
import { CURRENT_TOPPERS_DATA, PAST_ACHIEVERS_DATA, Topper } from "../data/toppers";
import { trackAnalyticsEvent } from "../utils/analytics";

export default function Results() {
  // Exam filter state: "ALL", "NEET", "JEE"
  const [examFilter, setExamFilter] = useState<string>("ALL");

  const handleExamFilterChange = (filter: string) => {
    setExamFilter(filter);
    trackAnalyticsEvent("exam_filter_selected", {
      exam: filter,
      section: "results_and_stories"
    });
  };

  // Filter datasets based on examination
  const filteredCurrentToppers: Topper[] = CURRENT_TOPPERS_DATA.filter((t) => {
    if (examFilter === "ALL") return true;
    return t.exam.toUpperCase().includes(examFilter);
  });

  const filteredPastAchievers: Topper[] = PAST_ACHIEVERS_DATA.filter((t) => {
    if (examFilter === "ALL") return true;
    return t.exam.toUpperCase().includes(examFilter);
  });

  /**
   * Helper to return responsive grid classes based on card count.
   * Ensures a single card (like Tanisha Iyar) is never awkwardly stretched across the screen,
   * while 2 or 3+ cards cleanly fill a 2-col or 3-col grid on tablet and desktop.
   */
  const getGridClass = (count: number) => {
    if (count === 1) {
      return "max-w-sm mx-auto grid grid-cols-1 gap-6 sm:gap-8";
    }
    if (count === 2) {
      return "max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8";
    }
    return "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8";
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pt-20 transition-colors duration-300">
      <SEO
        title="Topper Results & Student Stories | V.S.R.P.T"
        description="Explore verified student video stories, NEET and JEE toppers, and academic outcomes from V.S.R.P.T Physics Institute."
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━ 
          1. HEADER: RESULTS & STORIES 
         ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 px-3.5 py-1.5 rounded-full font-bold">
            <Award className="h-3.5 w-3.5" />
            <span>Academic Excellence</span>
          </span>

          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 dark:text-white leading-tight">
            Results &amp; Stories
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Real students, verified outcomes, and deep conceptual clarity. Explore authentic video stories from our physics toppers and achievers.
          </p>

          {/* Clean Exam Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[
              { id: "ALL", label: "All Exams" },
              { id: "NEET", label: "NEET" },
              { id: "JEE", label: "JEE" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => handleExamFilterChange(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide transition-all border cursor-pointer ${
                  examFilter === f.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━ 
          2. CURRENT TOPPERS (2026) 
         ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span>2026</span>
          </div>

          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Current Toppers
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans">
            Our current batch students setting academic benchmarks in physics problem solving.
          </p>
        </div>

        {filteredCurrentToppers.length > 0 ? (
          <div className={getGridClass(filteredCurrentToppers.length)}>
            {filteredCurrentToppers.map((topper) => (
              <TopperCard key={`${topper.name}-${topper.year}`} topper={topper} />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No 2026 topper story currently matching "{examFilter}".
            </p>
          </div>
        )}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━ 
          3. PAST ACHIEVERS (2025) 
         ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              <span>2025</span>
            </div>

            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Past Achievers
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans">
              Alumni who mastered physics fundamentals at V.S.R.P.T and cracked their competitive exams.
            </p>
          </div>

          {filteredPastAchievers.length > 0 ? (
            <div className={getGridClass(filteredPastAchievers.length)}>
              {filteredPastAchievers.map((topper) => (
                <TopperCard key={`${topper.name}-${topper.year}`} topper={topper} />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No 2025 achiever story currently matching "{examFilter}".
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━ 
          4. DISCLAIMER 
         ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-10 bg-white dark:bg-slate-950 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto flex items-start space-x-3 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs font-sans leading-relaxed text-slate-600 dark:text-slate-300">
            <strong>Results &amp; Stories Disclaimer:</strong> All student video testimonials and result records are published with parental and student consent. Individual examination outcomes depend on dedicated study effort and consistent problem-solving practice.
          </div>
        </div>
      </section>
    </div>
  );
}
