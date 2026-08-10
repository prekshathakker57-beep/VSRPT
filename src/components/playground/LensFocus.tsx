import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, RotateCcw, Volume2, VolumeX, AlertCircle, Eye,
  Play, Sparkles, Maximize2, Minimize2
} from "lucide-react";
import { synth } from "../../utils/sound";
import GameResultModal from "./GameResultModal";
import { trackAnalyticsEvent } from "../../utils/analytics";

interface LensFocusProps {
  score: number;
  onUpdateScore: (newScore: number) => void;
  onBackToPlayground: () => void;
}

export default function LensFocus({ score, onUpdateScore, onBackToPlayground }: LensFocusProps) {
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  // Lens Parameters (all in cm)
  const [focalLength, setFocalLength] = useState(15); // f
  const [objectDist, setObjectDist] = useState(40); // u or d_o
  const [screenDist, setScreenDist] = useState(20); // d_s (screen position from lens)

  // Canvas & State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState("Adjust lens focal length, object distance, and screen position to achieve crisp focus!");
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

  // Exact image distance calculation from thin lens formula: 1/f = 1/d_o + 1/d_i
  const realImageDist = objectDist > focalLength ? (objectDist * focalLength) / (objectDist - focalLength) : null;
  const blurAmount = realImageDist !== null ? Math.min(15, Math.abs(screenDist - realImageDist) * 0.8) : 15;

  useEffect(() => {
    synth.muted = muted;
  }, [muted]);

  useEffect(() => {
    trackAnalyticsEvent("physics_game_started", { game_name: "lens-focus" });
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

  const drawOpticsWorkbench = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const axisY = height / 2;
    const lensX = width * 0.45;

    // Dark canvas background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Principal Axis line
    ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(width, axisY);
    ctx.stroke();

    // Convex Lens drawing at lensX
    ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(lensX, axisY, 14, 110, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Focal Points F1 and F2
    const fPx = focalLength * 4;
    ctx.fillStyle = "#e0f2fe";
    ctx.beginPath();
    ctx.arc(lensX - fPx, axisY, 4, 0, Math.PI * 2);
    ctx.arc(lensX + fPx, axisY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 10px monospace";
    ctx.fillText("F₁", lensX - fPx - 6, axisY + 18);
    ctx.fillText("F₂", lensX + fPx - 6, axisY + 18);

    // Object Candle/Arrow on the left
    const objPx = objectDist * 4;
    const objX = lensX - objPx;
    const objHeight = 50;

    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, axisY);
    ctx.lineTo(objX, axisY - objHeight);
    ctx.stroke();

    // Flame top
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(objX, axisY - objHeight - 4, 6, 0, Math.PI * 2);
    ctx.fill();

    // Projection Screen on right
    const screenPx = screenDist * 4;
    const scrX = lensX + screenPx;

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(scrX, axisY - 80);
    ctx.lineTo(scrX, axisY + 80);
    ctx.stroke();

    // Light Rays
    if (realImageDist !== null) {
      const realImgPx = realImageDist * 4;
      const realImgX = lensX + realImgPx;
      const magnification = -realImageDist / objectDist;
      const imgHeight = objHeight * magnification;
      const realImgY = axisY - imgHeight;

      // Parallel Ray -> Lens -> Focus F2 -> Image
      ctx.strokeStyle = "rgba(234, 179, 8, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objX, axisY - objHeight);
      ctx.lineTo(lensX, axisY - objHeight);
      ctx.lineTo(realImgX, realImgY);
      ctx.stroke();

      // Optical Center Ray -> Image
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.beginPath();
      ctx.moveTo(objX, axisY - objHeight);
      ctx.lineTo(lensX, axisY);
      ctx.lineTo(realImgX, realImgY);
      ctx.stroke();

      // Image Projection on Screen (blurry if off-screen)
      ctx.save();
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(scrX, axisY);
      ctx.lineTo(scrX, axisY - imgHeight);
      ctx.stroke();
      ctx.restore();
    }
  };

  useEffect(() => {
    drawOpticsWorkbench();
  }, [focalLength, objectDist, screenDist]);

  const handleTestFocus = () => {
    if (isTesting) return;
    setIsTesting(true);
    synth.playLaunch();
    setFeedback("Checking image focus sharpness on screen...");

    setTimeout(() => {
      if (realImageDist !== null) {
        const diff = Math.abs(screenDist - realImageDist);
        if (diff <= 1.5) {
          synth.playSuccess();
          onUpdateScore(score + 100);
          setGameResult("won");
          setFeedback(`PERFECT FOCUS! Screen position (${screenDist.toFixed(1)} cm) matches exact image distance (${realImageDist.toFixed(1)} cm)!`);
        } else {
          synth.playError();
          setGameResult("lost");
          setFeedback(`BLURRY IMAGE! Screen is ${diff.toFixed(1)} cm away from exact focal point (${realImageDist.toFixed(1)} cm).`);
        }
      } else {
        synth.playError();
        setGameResult("lost");
        setFeedback("NO REAL IMAGE FORMED! Object is within focal length (u < f), forming a virtual image.");
      }
      setIsTesting(false);
    }, 1200);
  };

  const resetGame = () => {
    setIsTesting(false);
    setGameResult(null);
    setFocalLength(15);
    setObjectDist(40);
    setScreenDist(24);
    setFeedback("Adjust sliders and click TEST CRISP FOCUS!");
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
              Lens Focus Lab
            </h2>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-900/50 uppercase font-bold">
              Topic: Ray Optics &amp; Thin Lens Formula
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300">
            <span className="text-slate-400">SCORE:</span> <strong className="text-amber-700 dark:text-amber-400 font-extrabold">{score}</strong>
          </div>

          <button
            onClick={resetGame}
            disabled={isTesting}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 disabled:opacity-40 cursor-pointer font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
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
            className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Canvas & Sliders */}
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
                gameId="lens-focus"
                gameTitle="Lens Focus Lab"
                onClose={() => setGameResult(null)}
                onPlayAgain={resetGame}
                onBackToPlayground={onBackToPlayground}
              />
            </div>

            {/* Controls */}
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/60 space-y-5 text-left">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>FOCAL LENGTH (f)</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{focalLength} cm</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    value={focalLength}
                    onChange={(e) => setFocalLength(Number(e.target.value))}
                    disabled={isTesting}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 disabled:opacity-30"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>OBJECT DISTANCE (u)</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{objectDist} cm</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={objectDist}
                    onChange={(e) => setObjectDist(Number(e.target.value))}
                    disabled={isTesting}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 disabled:opacity-30"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>SCREEN POSITION (v)</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{screenDist} cm</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={screenDist}
                    onChange={(e) => setScreenDist(Number(e.target.value))}
                    disabled={isTesting}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 disabled:opacity-30"
                  />
                </div>
              </div>

              {/* Test Focus Launch Button */}
              <button
                onClick={handleTestFocus}
                disabled={isTesting}
                className="w-full py-4 rounded-xl text-xs font-extrabold text-white bg-cyan-600 hover:bg-cyan-700 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center space-x-2 uppercase tracking-wide cursor-pointer shadow-lg shadow-cyan-600/30"
              >
                <Eye className="h-4 w-4" />
                <span>TEST CRISP FOCUS SHARPNESS</span>
              </button>

              {/* Live Feedback */}
              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-100 dark:border-cyan-900/50 text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-mono">
                <AlertCircle className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
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
              <li>Position the object candle distance (u) and lens focal length (f).</li>
              <li>Calculate real image distance: 1/f = 1/v - 1/(-u) &rarr; v = (u &middot; f) / (u - f).</li>
              <li>Move the projection screen until the image is in sharp focus!</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">What Did You Learn?</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              The Thin Lens Formula 1/f = 1/v - 1/u governs optical image formation in cameras, eyes, and telescopes.
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-cyan-600 dark:text-cyan-400 block mb-0.5">Real &amp; Inverted Image</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">When object distance u &gt; f, light rays physically converge to project a real, inverted image onto a screen.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-cyan-600 dark:text-cyan-400 block mb-0.5">Linear Magnification (m)</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">m = v / u. If u &gt; 2f, image is diminished; if u = 2f, image size matches object exactly.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
