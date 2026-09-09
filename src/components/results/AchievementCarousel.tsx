// src/components/results/AchievementCarousel.tsx
import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { 
  ChevronLeft, ChevronRight, Award, Play, Star, Quote, 
  BookOpen, GraduationCap, CheckCircle2, Film, User, Volume2, ExternalLink
} from "lucide-react";
import { trackAnalyticsEvent } from "../../utils/analytics";

export interface CarouselItem {
  id: string;
  name: string;
  image?: string;
  imageAlt?: string;
  exam?: string;
  examination?: string;
  year?: number | string;
  physicsScore?: string;
  overallResult?: string;
  course?: string;
  quote?: string;
  achievement?: string;
  videoUrl?: string;
  embedUrl?: string;
  videoPath?: string;
  videoThumbnail?: string;
  videoDuration?: string;
  category?: "current" | "former" | "parent" | string;
  parentStudentName?: string;
  batchOrYear?: string;
  avatarBg?: string;
  initials?: string;
  rating?: number;
}

export interface AchievementCarouselProps {
  items: CarouselItem[];
  variant?: "topper" | "testimonial";
  sectionTitle?: string;
  emptyMessage?: string;
  onWatchVideo?: (item: CarouselItem) => void;
  carouselId?: string;
}

export default function AchievementCarousel({
  items,
  variant = "topper",
  sectionTitle,
  emptyMessage = "No student result has been added to this category yet.",
  onWatchVideo,
  carouselId = "achievement-carousel"
}: AchievementCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Reset active index if items change or shorten
  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  const activeItem = items[activeIndex];

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
    trackAnalyticsEvent(`${variant}_carousel_changed`, {
      carousel_section: carouselId,
      action: "next"
    });
  }, [items.length, variant, carouselId]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    trackAnalyticsEvent(`${variant}_carousel_changed`, {
      carousel_section: carouselId,
      action: "prev"
    });
  }, [items.length, variant, carouselId]);

  const handleSelectIndex = (idx: number) => {
    if (idx === activeIndex) return;
    const itemsCount = items.length;
    let diff = idx - activeIndex;
    if (diff > itemsCount / 2) diff -= itemsCount;
    if (diff < -itemsCount / 2) diff += itemsCount;
    setDirection(diff > 0 ? 1 : -1);
    setActiveIndex(idx);

    trackAnalyticsEvent(`${variant}_carousel_changed`, {
      carousel_section: carouselId,
      action: "thumbnail_click"
    });
  };

  // Keyboard navigation when focused on carousel
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-8 md:p-12 text-center bg-white rounded-3xl border border-blue-100 shadow-sm space-y-4 max-w-xl mx-auto my-8">
        <div className="p-4 rounded-full bg-blue-50 text-blue-600 w-12 h-12 mx-auto flex items-center justify-center">
          <BookOpen className="h-6 w-6" />
        </div>
        <p className="text-slate-600 font-sans text-sm md:text-base leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={carouselRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="space-y-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-3xl p-1 relative"
      aria-roledescription="carousel"
      aria-label={sectionTitle || "Achievements Carousel"}
    >
      {/* Live Region Accessibility Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing item {activeIndex + 1} of {items.length}: {activeItem?.name}, {activeItem?.examination}
      </div>

      {/* MAIN FEATURED ACTIVE CARD */}
      <div className="relative max-w-4xl mx-auto px-2 sm:px-4">
        
        {/* Navigation Arrows (Desktop / Mobile Overlays) */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-90"
              aria-label="Previous student result"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-90"
              aria-label="Next student result"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeItem.id}
            custom={direction}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, x: direction * 30 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, x: -direction * 30 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="bg-white rounded-3xl border border-blue-100 shadow-xl overflow-hidden text-left relative group hover:border-blue-300 transition-colors"
          >
            {/* Top Glow & Subtle Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              
              {/* LEFT / TOP: STUDENT MEDIA / VIDEO CARD */}
              <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white relative min-h-[300px] md:min-h-[420px] flex flex-col justify-between p-5 sm:p-6 overflow-hidden">
                
                {/* Background Decorator */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Badge: Exam & Year Batch */}
                <div className="flex items-center justify-between z-10 mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-blue-600/30 text-blue-200 border border-blue-400/30 backdrop-blur-md">
                    {activeItem.examination || activeItem.exam || "NEET / JEE"}
                  </span>

                  {activeItem.year && (
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {activeItem.year} Batch
                    </span>
                  )}
                </div>

                {/* Center: YouTube Short Embed or Student Photo */}
                {activeItem.embedUrl ? (
                  <div className="my-auto py-2 flex flex-col items-center justify-center text-center z-10 w-full">
                    <div className="w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black relative mx-auto">
                      <iframe
                        src={activeItem.embedUrl}
                        title={`${activeItem.name} — ${activeItem.examination || "NEET/JEE"} Video Story`}
                        className="w-full h-full border-0"
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="my-auto py-4 flex flex-col items-center justify-center text-center z-10">
                    <div className="relative group/avatar">
                      {/* Active Glow Ring */}
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-70 blur-sm group-hover/avatar:opacity-100 transition-opacity" />

                      {!imageErrorMap[activeItem.id] && activeItem.image ? (
                        <img
                          src={activeItem.image}
                          alt={activeItem.imageAlt || activeItem.name}
                          onError={() => setImageErrorMap(prev => ({ ...prev, [activeItem.id]: true }))}
                          className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white/90 shadow-2xl"
                        />
                      ) : (
                        <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br ${activeItem.avatarBg || "from-blue-600 to-indigo-800"} flex items-center justify-center border-4 border-white/90 shadow-2xl`}>
                          <span className="font-sans font-extrabold text-2xl sm:text-4xl text-white tracking-widest">
                            {activeItem.initials || activeItem.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {activeItem.rating && (
                        <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center space-x-1 shadow-md">
                          <Star className="h-3 w-3 fill-current text-slate-950" />
                          <span>{activeItem.rating}.0 Star Guardian</span>
                        </div>
                      )}
                    </div>

                    {activeItem.parentStudentName && (
                      <span className="text-xs font-mono text-blue-200/80 mt-2 block">
                        Guardian of {activeItem.parentStudentName}
                      </span>
                    )}

                    {activeItem.course && (
                      <span className="text-[11px] font-mono text-slate-300/80 mt-1 block">
                        {activeItem.course}
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom Student Info / Outcome Badge */}
                <div className="z-10 mt-3 text-center">
                  <h3 className="font-sans font-extrabold text-lg sm:text-xl text-white tracking-tight leading-tight">
                    {activeItem.name}
                  </h3>
                  {activeItem.achievement && (
                    <div className="mt-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-white/15 text-center">
                      <span className="text-[10px] font-mono text-blue-300 uppercase block font-semibold">Key Outcome</span>
                      <strong className="text-xs sm:text-sm font-sans font-extrabold text-white block">
                        {activeItem.achievement}
                      </strong>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT / BOTTOM: ACADEMIC METRICS & DETAILS */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                
                {/* Header & Badges */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono text-xs font-bold uppercase tracking-wider">
                        {activeItem.examination || activeItem.exam || "NEET / JEE"}
                      </span>
                      {activeItem.year && (
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
                          {activeItem.year} Batch
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono text-[11px] font-bold">
                        Verified Student Story
                      </span>
                    </div>

                    <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                      {activeItem.name}
                    </h3>
                  </div>

                  {/* Scores Grid for Topper Variant (Only when scores actually exist) */}
                  {(activeItem.physicsScore || activeItem.overallResult) && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      
                      {activeItem.physicsScore && (
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100/80 text-left">
                          <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 block tracking-wider">
                            Physics Score
                          </span>
                          <span className="text-lg sm:text-xl font-extrabold text-emerald-800 font-sans block mt-0.5">
                            {activeItem.physicsScore}
                          </span>
                        </div>
                      )}

                      {activeItem.overallResult && (
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/80 border border-blue-100/80 text-left">
                          <span className="text-[10px] font-mono uppercase font-bold text-blue-700 block tracking-wider">
                            Overall Rank / Score
                          </span>
                          <span className="text-lg sm:text-xl font-extrabold text-blue-900 font-sans block mt-0.5">
                            {activeItem.overallResult}
                          </span>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Student Quote Box (Only when real quote exists) */}
                  {activeItem.quote && (
                    <div className="relative p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-700 space-y-2">
                      <Quote className="h-6 w-6 text-blue-500/20 absolute top-3 right-3" />
                      <p className="text-xs sm:text-sm leading-relaxed italic text-slate-700 font-sans">
                        “{activeItem.quote}”
                      </p>
                    </div>
                  )}

                  {/* Key Outcome Box (When available and not shown on left) */}
                  {activeItem.achievement && !activeItem.embedUrl && (
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-left">
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-700 block tracking-wider">
                        Key Outcome
                      </span>
                      <span className="text-sm font-bold text-slate-900 font-sans block mt-0.5">
                        {activeItem.achievement}
                      </span>
                    </div>
                  )}

                  {/* Video Overview Note when scores are intentionally withheld/missing */}
                  {!activeItem.physicsScore && !activeItem.overallResult && !activeItem.quote && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
                      <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs font-bold uppercase tracking-wider">
                        <Film className="h-4 w-4" />
                        <span>Physics Mastery Video Story</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                        Watch {activeItem.name}'s physics journey and learning experience at V.S.R.P.T directly in the video player.
                      </p>
                    </div>
                  )}

                </div>

                {/* Action Buttons & Video Trigger */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-mono flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Verified Result</span> • <span className="text-blue-600 font-semibold">{activeItem.examination || activeItem.exam || "V.S.R.P.T"}</span>
                  </div>

                  {activeItem.videoUrl ? (
                    <a
                      href={activeItem.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all flex items-center space-x-2 cursor-pointer uppercase tracking-wider shadow-sm hover:shadow"
                    >
                      <Play className="h-3.5 w-3.5 fill-current text-blue-600" />
                      <span>Watch on YouTube</span>
                      <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                    </a>
                  ) : (activeItem.videoPath || variant === "testimonial") && activeItem.category !== "parent" ? (
                    <button
                      onClick={() => onWatchVideo?.(activeItem)}
                      className="py-2.5 px-5 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center space-x-2 cursor-pointer uppercase tracking-wider"
                    >
                      <Play className="h-4 w-4 fill-current text-white" />
                      <span>Watch Their Story</span>
                      {activeItem.videoDuration && (
                        <span className="text-[10px] font-mono bg-blue-800 px-1.5 py-0.5 rounded text-blue-100 ml-1">
                          {activeItem.videoDuration}
                        </span>
                      )}
                    </button>
                  ) : null}
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* CURVED THUMBNAIL ROW SELECTOR UNDERNEATH */}
      <div className="relative pt-6 pb-2 max-w-3xl mx-auto overflow-x-hidden">
        
        {/* Curved Path Row Container */}
        <div className="flex items-center justify-center min-h-[90px] py-2 relative touch-pan-x">
          
          {items.map((item, idx) => {
            const itemsCount = items.length;
            let offset = idx - activeIndex;
            if (offset > itemsCount / 2) offset -= itemsCount;
            if (offset < -itemsCount / 2) offset += itemsCount;

            const isSelected = idx === activeIndex;
            const isVisible = Math.abs(offset) <= 3; // Keep nearby thumbnails visible in arc

            if (!isVisible) return null;

            // Parabolic curve calculation for visual depth
            const curveY = Math.pow(offset, 2) * 5; // px drop along parabolic curve
            const scale = isSelected ? 1.25 : Math.max(0.7, 1 - Math.abs(offset) * 0.16);
            const opacity = isSelected ? 1 : Math.max(0.45, 0.95 - Math.abs(offset) * 0.2);
            const zIndex = 30 - Math.abs(offset);

            return (
              <motion.button
                key={item.id}
                onClick={() => handleSelectIndex(idx)}
                initial={false}
                animate={{
                  y: curveY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ zIndex }}
                className={`mx-2 sm:mx-3 cursor-pointer group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-shadow shrink-0`}
                aria-label={`Select student ${item.name}, ${item.examination || ""}`}
                aria-selected={isSelected}
              >
                <div className={`relative rounded-full p-0.5 transition-all ${
                  isSelected 
                    ? "ring-4 ring-blue-600 ring-offset-2 ring-offset-white shadow-lg" 
                    : "ring-2 ring-slate-200 group-hover:ring-blue-400"
                }`}>
                  {item.videoThumbnail ? (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-sm">
                      <img
                        src={item.videoThumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                        <Play className="h-3.5 w-3.5 text-white fill-current opacity-90" />
                      </div>
                    </div>
                  ) : !imageErrorMap[item.id] && item.image ? (
                    <img
                      src={item.image}
                      alt={item.imageAlt || item.name}
                      onError={() => setImageErrorMap(prev => ({ ...prev, [item.id]: true }))}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${item.avatarBg || "from-blue-600 to-indigo-800"} flex items-center justify-center shadow-sm`}>
                      <span className="font-sans font-bold text-xs sm:text-sm text-white">
                        {item.initials || item.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow">
                      <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
                    </div>
                  )}
                </div>

                {/* Accessible Student Name Label */}
                <span className={`text-[10px] font-mono mt-2 transition-colors truncate max-w-[70px] sm:max-w-[85px] ${
                  isSelected 
                    ? "font-extrabold text-blue-600" 
                    : "text-slate-500 group-hover:text-slate-800"
                }`}>
                  {item.name.split(" ")[0]}
                </span>
              </motion.button>
            );
          })}

        </div>

      </div>

    </div>
  );
}
