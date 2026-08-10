// src/components/results/VideoModal.tsx
import { useEffect, useRef, useState } from "react";
import { X, Play, Volume2, VolumeX, AlertCircle, Film, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { trackAnalyticsEvent } from "../../utils/analytics";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoPath?: string;
  studentName: string;
  examination: string;
  achievement?: string;
  quote?: string;
  batchOrYear?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoPath,
  studentName,
  examination,
  achievement,
  quote,
  batchOrYear
}: VideoModalProps) {
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoError(false);
    setIsPlaying(false);
  }, [videoPath, isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Focus close button on open
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        trackAnalyticsEvent("testimonial_video_opened", {
          examination,
          year: batchOrYear,
          student_category: "student_video"
        });
      }).catch(() => {
        setVideoError(true);
      });
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden text-left relative"
        >
          {/* Top Bar Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 id="video-modal-title" className="font-sans font-bold text-base text-white">
                  {studentName}'s Physics Story
                </h3>
                <span className="text-xs font-mono text-slate-400 block">
                  {examination} {batchOrYear ? `• ${batchOrYear}` : ""}
                </span>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
              aria-label="Close video story modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Video Container Area */}
          <div className="relative bg-slate-950 aspect-video w-full flex items-center justify-center overflow-hidden">
            {videoPath && !videoError ? (
              <video
                ref={videoRef}
                src={videoPath}
                controls
                className="w-full h-full object-contain"
                muted={isMuted}
                onError={() => setVideoError(true)}
                onEnded={() => {
                  setIsPlaying(false);
                  trackAnalyticsEvent("testimonial_video_completed", {
                    examination,
                    year: batchOrYear
                  });
                }}
              />
            ) : (
              /* Fallback when video file is missing or unavailable */
              <div className="p-8 text-center text-slate-300 space-y-4 max-w-md mx-auto">
                <div className="h-16 w-16 mx-auto rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Film className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white font-sans">Video Story Coming Soon</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Student story video will be added soon. Review {studentName}'s written testimonial and examination achievements below.
                  </p>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Media asset queued for high-definition publish</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Testimonial Details */}
          <div className="p-6 bg-slate-50 space-y-4 border-t border-slate-100">
            {achievement && (
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-200 uppercase tracking-wider">
                  Achievement: {achievement}
                </span>
              </div>
            )}

            {quote && (
              <blockquote className="p-4 rounded-2xl bg-white border border-blue-100 text-slate-700 text-xs md:text-sm italic leading-relaxed shadow-sm">
                “{quote}”
              </blockquote>
            )}

            <div className="flex justify-between items-center text-xs text-slate-500 font-mono pt-2 border-t border-slate-200/60">
              <span>Verified Outcome • V.S.R.P.T</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Close Story
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
