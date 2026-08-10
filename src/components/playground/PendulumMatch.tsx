import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, RotateCcw, Volume2, VolumeX, AlertCircle, Activity,
  Play, Sparkles, Maximize2, Minimize2
} from "lucide-react";
import { synth } from "../../utils/sound";
import GameResultModal from "./GameResultModal";
import { trackAnalyticsEvent } from "../../utils/analytics";

interface PendulumMatchProps {
  score: number;
  onUpdateScore: (newScore: number) => void;
  onBackToPlayground: () => void;
}

const LEVEL_TARGETS = [
  { level: "easy", name: "Level 1: Target T = 2.00 s", targetT: 2.00, hint: "Set length on Earth (g = 9.81 m/s²) to ~0.99 m" },
  { level: "medium", name: "Level 2: Target T = 1.40 s", targetT: 1.40, hint: "Try adjusting length L on Earth or Moon" },
  { level: "hard", name: "Level 3: Target T = 0.80 s", targetT: 0.80, hint: "High frequency oscillation challenge" }
];

const GRAVITIES = [
  { id: "earth", name: "Earth", g: 9.81 },
  { id: "moon", name: "Moon", g: 1.62 },
  { id: "jupiter", name: "Jupiter", g: 24.79 }
];

export default function PendulumMatch({ score, onUpdateScore, onBackToPlayground }: PendulumMatchProps) {
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const currentTarget = LEVEL_TARGETS[selectedLevelIdx];

  // Player controls
  const [length, setLength] = useState(1.5); // meters
  const [selectedG, setSelectedG] = useState(GRAVITIES[0]); // Earth
  const [angle, setAngle] = useState(25); // degrees

  // State & Physics
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState("Adjust length and gravity to match the target pendulum period!");
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

  // Computed player period
  const playerT = 2 * Math.PI * Math.sqrt(length / selectedG.g);

  useEffect(() => {
    synth.muted = muted;
  }, [muted]);

  useEffect(() => {
    trackAnalyticsEvent("physics_game_started", { game_name: "pendulum-match" });
  }, []);

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  const toggleFullscreen = () => {
    if (!gameContainerRef.current) return;
    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const animFrameId = useRef<number | null>(null);

  const drawPendulums = (t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark canvas background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Pivot support bar
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 20, width, 12);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(0, 32, width, 2);

    // Left Pendulum: Target Pendulum (Green)
    const targetX = width * 0.3;
    const targetOmega = (2 * Math.PI) / currentTarget.targetT;
    const targetTheta = (angle * Math.PI / 180) * Math.cos(targetOmega * t);
    const targetLpx = 180;
    const targetBobX = targetX + targetLpx * Math.sin(targetTheta);
    const targetBobY = 32 + targetLpx * Math.cos(targetTheta);

    // Draw Target String
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(targetX, 32);
    ctx.lineTo(targetBobX, targetBobY);
    ctx.stroke();

    // Draw Target Bob
    ctx.fillStyle = "#22c55e";
    ctx.shadowColor = "#15803d";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(targetBobX, targetBobY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Target Labels
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`TARGET: T = ${currentTarget.targetT.toFixed(2)}s`, targetX, 15);

    // Right Pendulum: Player Pendulum (Purple)
    const playerX = width * 0.7;
    const playerOmega = (2 * Math.PI) / playerT;
    const playerTheta = (angle * Math.PI / 180) * Math.cos(playerOmega * t);
    const playerLpx = (length / 3) * 220;
    const playerBobX = playerX + playerLpx * Math.sin(playerTheta);
    const playerBobY = 32 + playerLpx * Math.cos(playerTheta);

    // Draw Player String
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(playerX, 32);
    ctx.lineTo(playerBobX, playerBobY);
    ctx.stroke();

    // Draw Player Bob
    ctx.fillStyle = "#c084fc";
    ctx.shadowColor = "#9333ea";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(playerBobX, playerBobY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Player Labels
    ctx.fillStyle = "#e9d5ff";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`YOURS: T = ${playerT.toFixed(2)}s`, playerX, 15);
  };

  useEffect(() => {
    drawPendulums(0);
  }, [length, selectedG, angle, selectedLevelIdx]);

  const handleTestMatch = () => {
    if (isTesting) return;
    setIsTesting(true);
    synth.playLaunch();
    setFeedback("Testing pendulum synchronicity...");

    let startTime = performance.now();

    const animate = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;
      drawPendulums(elapsedSec);

      if (elapsedSec < 5.0) {
        animFrameId.current = requestAnimationFrame(animate);
      } else {
        const diff = Math.abs(playerT - currentTarget.targetT);
        if (diff <= 0.08) {
          synth.playSuccess();
          onUpdateScore(score + 100);
          setGameResult("won");
          setFeedback(`PERFECT MATCH! Your period (${playerT.toFixed(2)}s) matches target (${currentTarget.targetT.toFixed(2)}s)!`);
        } else {
          synth.playError();
          setGameResult("lost");
          setFeedback(`MISMATCH! Period diff: ${diff.toFixed(2)}s. Target is ${currentTarget.targetT.toFixed(2)}s. Try tweaking length.`);
        }
        setIsTesting(false);
      }
    };

    animFrameId.current = requestAnimationFrame(animate);
  };

  const resetGame = () => {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    setIsTesting(false);
    setGameResult(null);
    drawPendulums(0);
    setFeedback("Adjust sliders and click TEST MATCH!");
  };

  return (
    <div 
      ref={gameContainerRef}
      className={`space-y-6 text-slate-900 dark:text-slate-100 transition-colors ${
        isFullscreen ? "fixed inset-0 z-[9999] bg-slate-950 p-4 sm:p-6 overflow-y-auto" : ""
      }`}
    >
      
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl border border-blue-100 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToPlayground}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Playground</span>
          </button>

          <div>
            <h2 className="font-sans font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
              Pendulum Match
            </h2>
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-900/50 uppercase font-bold">
              Topic: Oscillation &amp; Simple Harmonic Motion
            </span>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300">
            <span className="text-slate-400">SCORE:</span> <strong className="text-amber-700 dark:text-amber-400 font-extrabold">{score}</strong>
          </div>

          <button
            onClick={resetGame}
            disabled={isTesting}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 disabled:opacity-40 cursor-pointer font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title={muted ? "Unmute Sound" : "Mute Sound"}
          >
            {muted ? <VolumeX className="h-4 w-4 text-rose-500" /> : <Volume2 className="h-4 w-4 text-emerald-500" />}
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Canvas & Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xl relative">
            
            {/* 16:9 Canvas Viewport */}
            <div className="relative w-full aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width="640"
                height="360"
                className="w-full h-full object-contain block"
              />

              <GameResultModal
                gameResult={gameResult}
                gameId="pendulum-match"
                gameTitle="Pendulum Match"
                onClose={() => setGameResult(null)}
                onPlayAgain={resetGame}
                onBackToPlayground={onBackToPlayground}
              />
            </div>

            {/* Controls */}
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/60 space-y-5 text-left">
              
              {/* Level Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold">CHALLENGE LEVEL</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {LEVEL_TARGETS.map((lvl, idx) => (
                    <button
                      key={lvl.level}
                      onClick={() => { setSelectedLevelIdx(idx); resetGame(); }}
                      disabled={isTesting}
                      className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                        selectedLevelIdx === idx
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                      }`}
                    >
                      {lvl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>STRING LENGTH (L)</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{length.toFixed(2)} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.01"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    disabled={isTesting}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold">GRAVITY LOCATION</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                    {GRAVITIES.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedG(g)}
                        disabled={isTesting}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedG.id === g.id ? "bg-purple-600 text-white shadow-sm" : "text-slate-700 dark:text-slate-300 hover:text-purple-600"
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test Match Launch Button */}
              <button
                onClick={handleTestMatch}
                disabled={isTesting}
                className="w-full py-4 rounded-xl text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center space-x-2 uppercase tracking-wide cursor-pointer shadow-lg shadow-purple-600/30"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>TEST MATCH SYNCHRONICITY</span>
              </button>

              {/* Live Feedback */}
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/50 text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-mono">
                <AlertCircle className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>{feedback}</span>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Instructions & Physics Concepts */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">How to Play</h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
              <li>Match your pendulum period (purple) to the green target pendulum period.</li>
              <li>Adjust string length L or change gravity location g.</li>
              <li>Click <strong>TEST MATCH SYNCHRONICITY</strong> to observe motion!</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">What Did You Learn?</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              For small angles (&theta; &lt; 15°), a simple pendulum executes Simple Harmonic Motion (SHM) with time period T = 2&pi; &middot; &radic;(L / g).
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-purple-600 dark:text-purple-400 block mb-0.5">Length Dependency</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">T is directly proportional to &radic;L. Doubling string length increases time period by factor of &radic;2 (&approx; 1.414).</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-purple-600 dark:text-purple-400 block mb-0.5">Mass Independence</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Notice that bob mass m does not appear in formula! T is completely independent of mass.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
