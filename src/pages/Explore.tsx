import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Atom, Volume2, VolumeX, RotateCcw, AlertCircle, Play, 
  Award, ChevronRight, ChevronLeft, Check, Target, 
  ArrowDownCircle, Activity, Eye, Zap, Sparkles, RefreshCw, ArrowLeft,
  X, CheckCircle2, HelpCircle, GraduationCap, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";
import { CENTRAL_CONFIG, PLAYGROUND_GAMES, PlaygroundGameConfig } from "../config";
import { trackAnalyticsEvent } from "../utils/analytics";
import GravityDrop from "../components/playground/GravityDrop";
import PendulumMatch from "../components/playground/PendulumMatch";
import LensFocus from "../components/playground/LensFocus";
import CollisionLab from "../components/playground/CollisionLab";
import GameResultModal from "../components/playground/GameResultModal";

// --- WEB AUDIO API SYNTHESIZER ---
class SoundSynth {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playLaunch() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio Context launch failed:", e);
    }
  }

  playHit() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.08, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + 0.4);
      });
    } catch (e) {
      console.warn("Audio Context hit failed:", e);
    }
  }

  playMiss() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio Context miss failed:", e);
    }
  }
}

const synth = new SoundSynth();

export default function Explore() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);

  // Playground state
  const [activeGameId, setActiveGameId] = useState<string | null>(null); // null = Carousel view
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Touch drag state for carousel
  const touchStartX = useRef<number | null>(null);

  // Local storage score persistence
  const [score, setScore] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_physics_playground_score");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [attempts, setAttempts] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_physics_playground_attempts");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("apex_physics_playground_score", score.toString());
    } catch (e) {}
  }, [score]);

  useEffect(() => {
    try {
      localStorage.setItem("apex_physics_playground_attempts", attempts.toString());
    } catch (e) {}
  }, [attempts]);

  // Track initial page load
  useEffect(() => {
    trackAnalyticsEvent("physics_playground_opened", {
      source_page: "explore"
    });
  }, []);

  // --- PROJECTILE GAME STATE ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(45); // Launch angle in degrees
  const [power, setPower] = useState(60); // Launch speed
  const [level, setLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [gameFeedback, setGameFeedback] = useState("Adjust sliders and click LAUNCH PROJECTILE to hit the target!");
  const [isFlying, setIsFlying] = useState(false);

  // Win / Loss Result Modal State
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement | null>(null);

  // Game physics internal variables
  const projPos = useRef({ x: 40, y: 350 });
  const targetPos = useRef({ x: 550, y: 350 });
  const targetRadius = useRef(15);
  const obstaclePos = useRef({ x: 300, y: 230, w: 30, h: 120 });
  const trail = useRef<{ x: number; y: number }[]>([]);
  const flightTime = useRef(0);
  const targetVel = useRef(1);

  useEffect(() => {
    synth.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (activeGameId === "projectile-challenge") {
      resetGameInstance();
    }
  }, [level, activeGameId]);

  const resetGameInstance = () => {
    setIsFlying(false);
    setGameResult(null);
    flightTime.current = 0;
    trail.current = [];
    projPos.current = { x: 40, y: 350 };
    
    if (level === "easy") {
      targetPos.current = { x: 500 + Math.random() * 80, y: 350 };
      obstaclePos.current = { x: -100, y: -100, w: 0, h: 0 };
    } else if (level === "medium") {
      targetPos.current = { x: 520 + Math.random() * 60, y: 350 };
      obstaclePos.current = { x: 280, y: 220, w: 35, h: 130 };
    } else if (level === "hard") {
      targetPos.current = { x: 550, y: 300 + Math.random() * 50 };
      obstaclePos.current = { x: 260, y: 150, w: 40, h: 200 };
      targetVel.current = (Math.random() > 0.5 ? 1.2 : -1.2);
    }
  };

  // 3D Carousel keyboard navigation
  useEffect(() => {
    if (activeGameId !== null) return; // Only listen in carousel mode

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCarouselIndex((prev) => (prev > 0 ? prev - 1 : PLAYGROUND_GAMES.length - 1));
      } else if (e.key === "ArrowRight") {
        setCarouselIndex((prev) => (prev < PLAYGROUND_GAMES.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGameId]);

  // Escape key handler to close game result modal
  useEffect(() => {
    const handleModalEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && gameResult !== null) {
        setGameResult(null);
      }
    };
    window.addEventListener("keydown", handleModalEscape);
    return () => window.removeEventListener("keydown", handleModalEscape);
  }, [gameResult]);

  // Auto-focus primary modal button when result modal opens
  useEffect(() => {
    if (gameResult !== null && modalCloseButtonRef.current) {
      modalCloseButtonRef.current.focus();
    }
  }, [gameResult]);

  // Carousel touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swiped left -> next card
        setCarouselIndex((prev) => (prev < PLAYGROUND_GAMES.length - 1 ? prev + 1 : 0));
      } else {
        // Swiped right -> prev card
        setCarouselIndex((prev) => (prev > 0 ? prev - 1 : PLAYGROUND_GAMES.length - 1));
      }
    }
    touchStartX.current = null;
  };

  // Main canvas game render loop
  useEffect(() => {
    if (activeGameId !== "projectile-challenge") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      // 1. CLEAR & BACKGROUND
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw horizontal reference grid
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1;
      for (let y = 50; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 350, canvas.width, 50);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 350);
      ctx.lineTo(canvas.width, 350);
      ctx.stroke();

      // 2. DRAW TRAJECTORY PREVIEW
      if (!isFlying && gameResult === null) {
        ctx.strokeStyle = "rgba(37, 99, 235, 0.35)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        const rad = (angle * Math.PI) / 180;
        const speed = power * 0.18;
        const vx = speed * Math.cos(rad);
        const vy = -speed * Math.sin(rad);
        const g = 0.08;

        ctx.moveTo(40, 350);
        for (let t = 0; t < 120; t += 2) {
          const px = 40 + vx * t;
          const py = 350 + vy * t + 0.5 * g * t * t;
          if (py > 350) break;
          ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. UPDATE PROJECTILE PHYSICS (When flying)
      if (isFlying && gameResult === null) {
        flightTime.current += 1.2;
        const rad = (angle * Math.PI) / 180;
        const scaledPower = power * 0.18;
        const vx = scaledPower * Math.cos(rad);
        const vy = -scaledPower * Math.sin(rad);
        const g = 0.08;

        const nextX = 40 + vx * flightTime.current;
        const nextY = 350 + vy * flightTime.current + 0.5 * g * flightTime.current * flightTime.current;

        projPos.current = { x: nextX, y: nextY };
        trail.current.push({ x: nextX, y: nextY });

        if (level === "hard") {
          targetPos.current.y += targetVel.current;
          if (targetPos.current.y < 120 || targetPos.current.y > 330) {
            targetVel.current = -targetVel.current;
          }
        }

        const distToTarget = Math.hypot(nextX - targetPos.current.x, nextY - targetPos.current.y);
        
        const hitObstacle = 
          nextX >= obstaclePos.current.x &&
          nextX <= obstaclePos.current.x + obstaclePos.current.w &&
          nextY >= obstaclePos.current.y &&
          nextY <= obstaclePos.current.y + obstaclePos.current.h;

        if (distToTarget <= targetRadius.current + 8) {
          // WIN!
          setIsFlying(false);
          synth.playHit();
          const precision = Math.max(0, 100 - Math.round(distToTarget * 5));
          const earned = precision * (level === "hard" ? 3 : level === "medium" ? 2 : 1);
          setScore((s) => s + earned);
          setGameFeedback(`BOOM! Target hit with ${precision}% accuracy! (+${earned} points)`);
          setGameResult("won");

          trackAnalyticsEvent("physics_game_completed", {
            game_name: "projectile-challenge",
            difficulty: level,
            result: "won"
          });
          trackAnalyticsEvent("physics_game_won", {
            game_name: "projectile-challenge",
            difficulty: level
          });

        } else if (hitObstacle) {
          // LOSS via Obstacle
          setIsFlying(false);
          synth.playMiss();
          setGameFeedback("CRASHED! The projectile hit the barricade obstacle.");
          setGameResult("lost");

          trackAnalyticsEvent("physics_game_completed", {
            game_name: "projectile-challenge",
            difficulty: level,
            result: "lost"
          });
          trackAnalyticsEvent("physics_game_lost", {
            game_name: "projectile-challenge",
            difficulty: level
          });

        } else if (nextY > 350 || nextX > canvas.width || nextX < 0) {
          // LOSS via Ground out / Out of bounds
          setIsFlying(false);
          synth.playMiss();
          setGameFeedback("MISSED! The projectile hit the ground without reaching the target.");
          setGameResult("lost");

          trackAnalyticsEvent("physics_game_completed", {
            game_name: "projectile-challenge",
            difficulty: level,
            result: "lost"
          });
          trackAnalyticsEvent("physics_game_lost", {
            game_name: "projectile-challenge",
            difficulty: level
          });
        }
      }

      // 4. DRAW TRAIL
      if (trail.current.length > 1) {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(trail.current[0].x, trail.current[0].y);
        for (let i = 1; i < trail.current.length; i++) {
          ctx.lineTo(trail.current[i].x, trail.current[i].y);
        }
        ctx.stroke();
      }

      // 5. DRAW TARGET
      ctx.beginPath();
      ctx.arc(targetPos.current.x, targetPos.current.y, targetRadius.current, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(targetPos.current.x, targetPos.current.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();

      // 6. DRAW OBSTACLE
      if (level !== "easy") {
        ctx.fillStyle = "#fee2e2";
        ctx.fillRect(obstaclePos.current.x, obstaclePos.current.y, obstaclePos.current.w, obstaclePos.current.h);
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(obstaclePos.current.x, obstaclePos.current.y, obstaclePos.current.w, obstaclePos.current.h);
      }

      // 7. DRAW CANNON
      ctx.save();
      ctx.translate(40, 350);
      ctx.rotate((-angle * Math.PI) / 180);
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(-5, -6, 25, 12);
      ctx.strokeStyle = "#1d4ed8";
      ctx.lineWidth = 1;
      ctx.strokeRect(-5, -6, 25, 12);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(40, 350, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#e2e8f0";
      ctx.fill();
      ctx.strokeStyle = "#94a3b8";
      ctx.stroke();

      // 8. DRAW ACTIVE PROJECTILE
      ctx.beginPath();
      ctx.arc(projPos.current.x, projPos.current.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#2563eb";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => cancelAnimationFrame(animId);
  }, [angle, power, isFlying, level, activeGameId, gameResult]);

  const handleLaunch = () => {
    if (isFlying) return;
    synth.playLaunch();
    setAttempts((a) => a + 1);
    flightTime.current = 0;
    trail.current = [];
    setIsFlying(true);
    setGameFeedback("Projectile in motion! Simulating parabolic forces...");

    trackAnalyticsEvent("physics_game_started", {
      game_name: "projectile-challenge",
      difficulty: level
    });
  };

  const handleSelectGameCard = (game: PlaygroundGameConfig) => {
    trackAnalyticsEvent("physics_game_selected", {
      game_name: game.id,
      status: game.status
    });

    if (game.status === "playable") {
      setActiveGameId(game.id);
    }
  };

  const handleDemoRedirect = (resultState: "won" | "lost") => {
    trackAnalyticsEvent("playground_demo_clicked", {
      game_name: "projectile-challenge",
      result: resultState
    });
    trackAnalyticsEvent("enquiry_form_opened_from_game", {
      intent: "demo",
      result: resultState
    });

    navigate(`/contact?intent=demo&source=physics-playground&game=projectile-challenge&result=${resultState}#enquiry-form-section`);
  };

  const handleAdmissionRedirect = (resultState: "won" | "lost") => {
    trackAnalyticsEvent("playground_admission_clicked", {
      game_name: "projectile-challenge",
      result: resultState
    });
    trackAnalyticsEvent("enquiry_form_opened_from_game", {
      intent: "admission",
      result: resultState
    });

    navigate(`/contact?intent=admission&source=physics-playground&game=projectile-challenge&result=${resultState}#enquiry-form-section`);
  };



  const renderGameIcon = (iconName: string) => {
    switch (iconName) {
      case "Target": return <Target className="h-8 w-8 text-blue-600" />;
      case "ArrowDownCircle": return <ArrowDownCircle className="h-8 w-8 text-amber-600" />;
      case "Activity": return <Activity className="h-8 w-8 text-purple-600" />;
      case "Eye": return <Eye className="h-8 w-8 text-cyan-600" />;
      case "Zap": return <Zap className="h-8 w-8 text-emerald-600" />;
      default: return <Atom className="h-8 w-8 text-blue-600" />;
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pt-20">
      <SEO 
        title="Physics Playground & Interactive Lab" 
        description="Play with physics, test your understanding and discover how science works through interactive challenges in our 3D Physics Playground."
      />

      {/* Hero Header Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 px-3 py-1.5 rounded-full font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Physics Playground</span>
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 dark:text-white leading-tight">
            Play with physics, test your understanding and discover how science works through interactive challenges.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Formula memorization makes you recall steps. Interactive physics challenges help you master the intuition. Choose a simulator below to start experimenting!
          </p>
        </div>
      </section>

      {/* MAIN PLAYGROUND CONTAINER */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CAROUSEL VIEW MODE */}
        {activeGameId === null ? (
          <div className="space-y-10">
            
            {/* Carousel Header & Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-100 dark:border-slate-800 shadow-sm transition-colors">
              <div className="text-left">
                <h2 className="font-sans font-bold text-lg text-slate-900 dark:text-white">Select a Physics Challenge</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Swipe or use arrow keys to browse 3D game cards</p>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : PLAYGROUND_GAMES.length - 1))}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer focus:outline-none"
                  aria-label="Previous Game Card"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <span className="font-mono text-xs font-bold text-slate-600 px-2">
                  {carouselIndex + 1} / {PLAYGROUND_GAMES.length}
                </span>

                <button
                  onClick={() => setCarouselIndex((prev) => (prev < PLAYGROUND_GAMES.length - 1 ? prev + 1 : 0))}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer focus:outline-none"
                  aria-label="Next Game Card"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 3D Carousel Stage */}
            <div 
              className="relative min-h-[440px] flex items-center justify-center overflow-hidden py-8 touch-pan-y select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-full max-w-lg h-[380px] flex items-center justify-center">
                {PLAYGROUND_GAMES.map((game, idx) => {
                  const total = PLAYGROUND_GAMES.length;
                  // Calculate shortest distance from active index
                  let offset = idx - carouselIndex;
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;

                  const isActive = offset === 0;
                  const isVisible = Math.abs(offset) <= 2;

                  if (!isVisible) return null;

                  // 3D Perspective Transform values
                  const translateX = offset * 220; // Horizontal separation
                  const scale = Math.max(0.7, 1 - Math.abs(offset) * 0.15);
                  const rotateY = offset * -18; // 3D rotation angle
                  const opacity = Math.max(0.3, 1 - Math.abs(offset) * 0.35);
                  const zIndex = 30 - Math.abs(offset) * 10;

                  return (
                    <motion.div
                      key={game.id}
                      onClick={() => {
                        if (!isActive) {
                          setCarouselIndex(idx);
                        }
                      }}
                      animate={{
                        x: translateX,
                        scale: scale,
                        rotateY: rotateY,
                        opacity: opacity
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 25 }}
                      style={{
                        zIndex: zIndex,
                        perspective: 1000
                      }}
                      className={`absolute w-full max-w-sm rounded-3xl p-6 bg-white border ${
                        isActive 
                          ? "border-blue-400 shadow-2xl ring-4 ring-blue-500/10 cursor-default" 
                          : "border-slate-200 shadow-md hover:border-blue-300 cursor-pointer"
                      } text-left flex flex-col justify-between h-[360px] bg-gradient-to-b ${game.gradientBg}`}
                    >
                      {/* Card Header Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${game.badgeColor}`}>
                          {game.topic}
                        </span>

                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                          {game.difficulty}
                        </span>
                      </div>

                      {/* Card Main Content */}
                      <div className="space-y-3 my-auto">
                        <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100 shadow-sm w-fit">
                          {renderGameIcon(game.iconName)}
                        </div>

                        <h3 className="font-sans font-extrabold text-xl text-slate-900 tracking-tight">
                          {game.title}
                        </h3>

                        <p className="text-slate-600 text-xs leading-relaxed">
                          {game.description}
                        </p>
                      </div>

                      {/* Card Footer Button */}
                      <div className="pt-3 border-t border-slate-100 relative z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectGameCard(game);
                          }}
                          className="w-full py-3 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2 cursor-pointer uppercase font-sans tracking-wide pointer-events-auto"
                          aria-label={`Play ${game.title}`}
                        >
                          <span>PLAY GAME →</span>
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 pt-2">
              {PLAYGROUND_GAMES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    carouselIndex === idx ? "w-8 bg-blue-600" : "w-2.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Go to game slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        ) : (
          /* INDIVIDUAL GAME PLAY INTERFACE */
          <div className="space-y-6">

            {activeGameId === "gravity-drop" && (
              <GravityDrop
                score={score}
                onUpdateScore={setScore}
                onBackToPlayground={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === "pendulum-match" && (
              <PendulumMatch
                score={score}
                onUpdateScore={setScore}
                onBackToPlayground={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === "lens-focus" && (
              <LensFocus
                score={score}
                onUpdateScore={setScore}
                onBackToPlayground={() => setActiveGameId(null)}
              />
            )}

            {activeGameId === "collision-lab" && (
              <CollisionLab
                score={score}
                onUpdateScore={setScore}
                onBackToPlayground={() => setActiveGameId(null)}
              />
            )}

            {(activeGameId === "projectile-challenge" || activeGameId === "projectile") && (
              <div className="space-y-6">
                
                {/* Top Game Navigation & Controls Bar */}
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-blue-100 shadow-md flex flex-wrap items-center justify-between gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setActiveGameId(null);
                        trackAnalyticsEvent("physics_game_restarted", {
                          game_name: "projectile-challenge",
                          action: "back_to_playground"
                        });
                      }}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1 text-xs font-bold cursor-pointer"
                      title="Back to Physics Playground Carousel"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Playground</span>
                    </button>

                    <div>
                      <h2 className="font-sans font-extrabold text-lg text-slate-900 leading-tight">Projectile Challenge</h2>
                      <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase font-bold">
                        Topic: Projectile Motion
                      </span>
                    </div>
                  </div>

                  {/* Right Side Controls */}
                  <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
                    <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                      <span className="text-slate-400">SCORE:</span> <strong className="text-amber-700 font-extrabold">{score}</strong>
                    </div>

                    <button
                      onClick={resetGameInstance}
                      disabled={isFlying}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1 disabled:opacity-40 cursor-pointer font-bold"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                      <span>Restart</span>
                    </button>

                    <button
                      onClick={() => setMuted(!muted)}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title={muted ? "Unmute Sound" : "Mute Sound"}
                    >
                      {muted ? <VolumeX className="h-4 w-4 text-rose-500" /> : <Volume2 className="h-4 w-4 text-emerald-600" />}
                    </button>
                  </div>
                </div>

                {/* Main Game Interface Canvas & Sliders */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  <div className="lg:col-span-8 space-y-6">
                    <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-2xl relative">
                      
                      {/* Canvas Viewport */}
                      <div className="relative w-full overflow-x-auto flex justify-center bg-white border-b border-slate-100">
                        <canvas
                          ref={canvasRef}
                          width="640"
                          height="400"
                          className="max-w-full block shadow-inner shrink-0"
                        />

                        {/* Result Overlay Modal Trigger */}
                        <GameResultModal
                          gameResult={gameResult}
                          gameId="projectile-challenge"
                          gameTitle="Projectile Challenge"
                          onClose={() => setGameResult(null)}
                          onPlayAgain={() => {
                            resetGameInstance();
                            trackAnalyticsEvent("physics_game_restarted", {
                              game_name: "projectile-challenge",
                              action: "play_again"
                            });
                          }}
                          onBackToPlayground={() => {
                            setActiveGameId(null);
                            setGameResult(null);
                          }}
                        />
                      </div>

                      {/* Controls Panel */}
                      <div className="p-6 bg-slate-50/50 space-y-4 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Left: Sliders */}
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center text-xs font-mono text-slate-500 mb-1.5">
                                <span>LAUNCH ANGLE (θ)</span>
                                <span className="text-blue-600 font-bold">{angle}°</span>
                              </div>
                              <input
                                type="range"
                                min="5"
                                max="85"
                                value={angle}
                                onChange={(e) => setAngle(Number(e.target.value))}
                                disabled={isFlying || gameResult !== null}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-30"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center text-xs font-mono text-slate-500 mb-1.5">
                                <span>LAUNCH SPEED (V₀)</span>
                                <span className="text-blue-600 font-bold">{power} m/s</span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="95"
                                value={power}
                                onChange={(e) => setPower(Number(e.target.value))}
                                disabled={isFlying || gameResult !== null}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-30"
                              />
                            </div>
                          </div>

                          {/* Right: Difficulty & Launch */}
                          <div className="flex flex-col justify-between space-y-4">
                            <div>
                              <span className="block text-xs font-mono text-slate-500 mb-1.5 uppercase">DIFFICULTY LEVEL</span>
                              <div className="flex gap-2">
                                {["easy", "medium", "hard"].map((lvl) => (
                                  <button
                                    key={lvl}
                                    onClick={() => setLevel(lvl as any)}
                                    disabled={isFlying || gameResult !== null}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all border cursor-pointer ${
                                      level === lvl
                                        ? "bg-blue-600 border-blue-600 text-white font-extrabold shadow-sm"
                                        : "bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30"
                                    }`}
                                  >
                                    {lvl}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={handleLaunch}
                              disabled={isFlying || gameResult !== null}
                              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center space-x-1.5 uppercase tracking-wide cursor-pointer shadow-md"
                            >
                              <span>Launch Projectile</span>
                            </button>
                          </div>

                        </div>

                        {/* Live Feedback */}
                        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs flex items-center space-x-2 text-slate-700 font-mono">
                          <AlertCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                          <span>{gameFeedback}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Sidebar Physics Explanation & Instructions */}
                  <div className="lg:col-span-4 space-y-6 text-left">
                    
                    {/* Instructions Box */}
                    <div className="p-6 rounded-2xl border border-blue-100 bg-white shadow-sm space-y-3">
                      <h3 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wider">Game Instructions</h3>
                      <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
                        <li>Use touch or sliders to set <strong>Angle</strong> &amp; <strong>Speed</strong>.</li>
                        <li>Hit the red target bullseye to win points!</li>
                        <li>Avoid hitting barricade obstacles on Medium / Hard settings.</li>
                        <li>Hard mode features a vertically oscillating moving target.</li>
                      </ul>
                    </div>

                    {/* What Did You Learn Box */}
                    <div className="p-6 rounded-2xl border border-blue-100 bg-white shadow-sm space-y-4">
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Atom className="h-5 w-5" />
                        <h3 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wider">What Did You Learn?</h3>
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed">
                        Projectile motion separates velocity into two independent perpendicular components:
                      </p>

                      <div className="space-y-3 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <strong className="text-blue-600 block mb-0.5">1. Horizontal Motion (x)</strong>
                          <span className="text-slate-500 text-[11px]">Constant velocity (no horizontal acceleration). x = V₀·cos(θ)·t</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <strong className="text-blue-600 block mb-0.5">2. Vertical Motion (y)</strong>
                          <span className="text-slate-500 text-[11px]">Constant gravity acceleration pulling down. y = V₀·sin(θ)·t - 0.5·g·t²</span>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] font-mono text-slate-700 text-center">
                        Maximum Range Angle: <strong className="text-blue-800">θ = 45°</strong>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </section>



    </div>
  );
}
