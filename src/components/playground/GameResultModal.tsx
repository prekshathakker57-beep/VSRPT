import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, HelpCircle, X, Calendar, GraduationCap, RefreshCw, ArrowLeft } from "lucide-react";
import { trackAnalyticsEvent } from "../../utils/analytics";

interface GameResultModalProps {
  gameResult: "won" | "lost" | null;
  gameId: string;
  gameTitle: string;
  onClose: () => void;
  onPlayAgain: () => void;
  onBackToPlayground: () => void;
}

export default function GameResultModal({
  gameResult,
  gameId,
  gameTitle,
  onClose,
  onPlayAgain,
  onBackToPlayground
}: GameResultModalProps) {
  const navigate = useNavigate();
  const primaryBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleModalEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && gameResult !== null) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleModalEscape);
    return () => window.removeEventListener("keydown", handleModalEscape);
  }, [gameResult, onClose]);

  useEffect(() => {
    if (gameResult !== null && primaryBtnRef.current) {
      primaryBtnRef.current.focus();
    }
  }, [gameResult]);

  if (gameResult === null) return null;

  const handleDemoRedirect = () => {
    trackAnalyticsEvent("playground_demo_clicked", {
      game_name: gameId,
      result: gameResult
    });
    trackAnalyticsEvent("enquiry_form_opened_from_game", {
      intent: "demo",
      game_name: gameId,
      result: gameResult
    });
    navigate(`/contact?intent=demo&source=physics-playground&game=${gameId}&result=${gameResult}#enquiry-form-section`);
  };

  const handleAdmissionRedirect = () => {
    trackAnalyticsEvent("playground_admission_clicked", {
      game_name: gameId,
      result: gameResult
    });
    trackAnalyticsEvent("enquiry_form_opened_from_game", {
      intent: "admission",
      game_name: gameId,
      result: gameResult
    });
    navigate(`/contact?intent=admission&source=physics-playground&game=${gameId}&result=${gameResult}#enquiry-form-section`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-result-title"
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-center"
      >
        <div 
          className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-blue-100 space-y-5 text-left relative overflow-hidden"
          aria-live="polite"
        >
          {/* Decorative physics background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header icon and close */}
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-2xl ${
              gameResult === "won" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
            }`}>
              {gameResult === "won" ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <HelpCircle className="h-8 w-8" />
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="space-y-2">
            <h3 
              id="game-result-title"
              className="font-sans font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight"
            >
              {gameResult === "won" 
                ? "Congratulations! You Completed the Challenge!" 
                : "Oops! Not Quite This Time."}
            </h3>

            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              {gameResult === "won"
                ? "You successfully applied the physics concept. Every problem becomes easier when you understand how the concept works. Ready to explore physics with us?"
                : "Every attempt helps you understand physics better. Try the challenge again, or attend a demo lecture and let us explain the concept step by step."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {gameResult === "lost" && (
              <button
                ref={primaryBtnRef}
                onClick={onPlayAgain}
                className="w-full py-3.5 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider active:scale-98"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            )}

            <button
              ref={gameResult === "won" ? primaryBtnRef : undefined}
              onClick={handleDemoRedirect}
              className={`w-full py-3.5 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider active:scale-98 ${
                gameResult === "won" 
                  ? "text-white bg-blue-600 hover:bg-blue-700" 
                  : "text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Book a Free Demo Lecture</span>
            </button>

            <button
              onClick={handleAdmissionRedirect}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider active:scale-98"
            >
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span>Apply for Admission</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {gameResult === "won" && (
                <button
                  onClick={onPlayAgain}
                  className="py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
                  <span>Play Again</span>
                </button>
              )}

              <button
                onClick={onBackToPlayground}
                className={`py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                  gameResult === "lost" ? "col-span-2" : ""
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Physics Playground</span>
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
