import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, RotateCcw, Volume2, VolumeX, AlertCircle, Zap,
  Play, Sparkles, Maximize2, Minimize2
} from "lucide-react";
import { synth } from "../../utils/sound";
import GameResultModal from "./GameResultModal";
import { trackAnalyticsEvent } from "../../utils/analytics";

interface CollisionLabProps {
  score: number;
  onUpdateScore: (newScore: number) => void;
  onBackToPlayground: () => void;
}

export default function CollisionLab({ score, onUpdateScore, onBackToPlayground }: CollisionLabProps) {
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  // Cart Parameters
  const [m1, setM1] = useState(4); // kg
  const [m2, setM2] = useState(2); // kg
  const [v1, setV1] = useState(6); // m/s (moving right)
  const [v2, setV2] = useState(-4); // m/s (moving left)
  const [collisionType, setCollisionType] = useState<"elastic" | "inelastic">("elastic");

  // Prediction
  const [prediction, setPrediction] = useState<string | null>(null);

  // Canvas & State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isColliding, setIsColliding] = useState(false);
  const [feedback, setFeedback] = useState("Adjust cart masses, velocities, select collision type, predict post-collision motion and START COLLISION!");
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

  // Position references
  const cart1Pos = useRef(150);
  const cart2Pos = useRef(450);
  const cart1V = useRef(v1);
  const cart2V = useRef(v2);
  const animFrameId = useRef<number | null>(null);

  // Computed post-collision velocities
  let v1Final = 0;
  let v2Final = 0;

  if (collisionType === "elastic") {
    v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  } else {
    const vJoint = (m1 * v1 + m2 * v2) / (m1 + m2);
    v1Final = vJoint;
    v2Final = vJoint;
  }

  useEffect(() => {
    synth.muted = muted;
  }, [muted]);

  useEffect(() => {
    trackAnalyticsEvent("physics_game_started", { game_name: "collision-lab" });
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

  const drawTrack = (x1: number, x2: number, curV1: number, curV2: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const trackY = height - 60;

    // Dark canvas background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);

    // Track surface
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, trackY, width, 12);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(0, trackY + 12, width, 48);

    // Ticks on track
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, trackY);
      ctx.lineTo(x, trackY + 8);
      ctx.stroke();
    }

    // Cart 1 (Blue)
    const cart1Width = 50 + m1 * 4;
    const cart1Height = 35;
    const y1 = trackY - cart1Height;

    ctx.fillStyle = "#2563eb";
    ctx.shadowColor = "#1d4ed8";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(x1 - cart1Width / 2, y1, cart1Width, cart1Height, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cart 1 Wheels
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(x1 - cart1Width / 3, trackY, 5, 0, Math.PI * 2);
    ctx.arc(x1 + cart1Width / 3, trackY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Cart 1 Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${m1}kg`, x1, y1 + 20);
    ctx.fillStyle = "#93c5fd";
    ctx.fillText(`v₁: ${curV1.toFixed(1)}m/s`, x1, y1 - 10);

    // Cart 2 (Emerald / Red)
    const cart2Width = 50 + m2 * 4;
    const cart2Height = 35;
    const y2 = trackY - cart2Height;

    ctx.fillStyle = "#059669";
    ctx.shadowColor = "#047857";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(x2 - cart2Width / 2, y2, cart2Width, cart2Height, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cart 2 Wheels
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(x2 - cart2Width / 3, trackY, 5, 0, Math.PI * 2);
    ctx.arc(x2 + cart2Width / 3, trackY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Cart 2 Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${m2}kg`, x2, y2 + 20);
    ctx.fillStyle = "#a7f3d0";
    ctx.fillText(`v₂: ${curV2.toFixed(1)}m/s`, x2, y2 - 10);
  };

  const resetCarts = () => {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    cart1Pos.current = 150;
    cart2Pos.current = 450;
    cart1V.current = v1;
    cart2V.current = v2;
    setIsColliding(false);
    setGameResult(null);
    setFeedback("Select your prediction and click START COLLISION!");
    drawTrack(150, 450, v1, v2);
  };

  useEffect(() => {
    resetCarts();
  }, [m1, m2, v1, v2, collisionType]);

  const handleStartCollision = () => {
    if (isColliding) return;
    if (!prediction) {
      setFeedback("Please predict the post-collision outcome before starting!");
      return;
    }

    setIsColliding(true);
    synth.playLaunch();
    let hasCollided = false;

    const animate = () => {
      const c1W = 50 + m1 * 4;
      const c2W = 50 + m2 * 4;

      cart1Pos.current += cart1V.current * 0.4;
      cart2Pos.current += cart2V.current * 0.4;

      // Check collision
      if (!hasCollided && (cart1Pos.current + c1W / 2 >= cart2Pos.current - c2W / 2)) {
        hasCollided = true;
        synth.playLaunch();
        cart1V.current = v1Final;
        cart2V.current = v2Final;
      }

      drawTrack(cart1Pos.current, cart2Pos.current, cart1V.current, cart2V.current);

      if (cart1Pos.current < 20 || cart2Pos.current > 620 || (hasCollided && Math.abs(cart1V.current) < 0.1 && Math.abs(cart2V.current) < 0.1)) {
        // Evaluate prediction
        let actualWinner = "c2_right";
        if (v1Final < 0 && v2Final > 0) actualWinner = "bounce_opposite";
        else if (Math.abs(v1Final - v2Final) < 0.1 && v1Final > 0) actualWinner = "stuck_right";
        else if (Math.abs(v1Final - v2Final) < 0.1 && v1Final < 0) actualWinner = "stuck_left";

        const userWon = prediction === actualWinner || (prediction === "bounce_opposite" && v1Final < 0 && v2Final > 0);

        if (userWon) {
          synth.playSuccess();
          onUpdateScore(score + 100);
          setGameResult("won");
          setFeedback(`CORRECT! Post-collision velocities: Cart 1 = ${v1Final.toFixed(1)} m/s, Cart 2 = ${v2Final.toFixed(1)} m/s.`);
        } else {
          synth.playError();
          setGameResult("lost");
          setFeedback(`INCORRECT. Actual: Cart 1 = ${v1Final.toFixed(1)} m/s, Cart 2 = ${v2Final.toFixed(1)} m/s.`);
        }

        setIsColliding(false);
      } else {
        animFrameId.current = requestAnimationFrame(animate);
      }
    };

    animFrameId.current = requestAnimationFrame(animate);
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
              Collision &amp; Momentum Lab
            </h2>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/50 uppercase font-bold">
              Topic: Conservation of Linear Momentum
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300">
            <span className="text-slate-400">SCORE:</span> <strong className="text-amber-700 dark:text-amber-400 font-extrabold">{score}</strong>
          </div>

          <button
            onClick={resetCarts}
            disabled={isColliding}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 disabled:opacity-40 cursor-pointer font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
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
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
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
                gameId="collision-lab"
                gameTitle="Collision & Momentum Lab"
                onClose={() => setGameResult(null)}
                onPlayAgain={resetCarts}
                onBackToPlayground={onBackToPlayground}
              />
            </div>

            {/* Controls */}
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/60 space-y-5 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 font-bold">CART 1 MASS ({m1}kg)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={m1}
                    onChange={(e) => setM1(Number(e.target.value))}
                    disabled={isColliding}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 font-bold">CART 1 VELOCITY ({v1}m/s)</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={v1}
                    onChange={(e) => setV1(Number(e.target.value))}
                    disabled={isColliding}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 font-bold">CART 2 MASS ({m2}kg)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={m2}
                    onChange={(e) => setM2(Number(e.target.value))}
                    disabled={isColliding}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 font-bold">CART 2 VELOCITY ({v2}m/s)</label>
                  <input
                    type="range"
                    min="-12"
                    max="-1"
                    value={v2}
                    onChange={(e) => setV2(Number(e.target.value))}
                    disabled={isColliding}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-30"
                  />
                </div>
              </div>

              {/* Collision Type Selection */}
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5 uppercase font-bold">COLLISION TYPE</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCollisionType("elastic")}
                    disabled={isColliding}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                      collisionType === "elastic"
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    Elastic (e = 1, Energy Conserved)
                  </button>

                  <button
                    onClick={() => setCollisionType("inelastic")}
                    disabled={isColliding}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                      collisionType === "inelastic"
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    Perfectly Inelastic (e = 0, Stick Together)
                  </button>
                </div>
              </div>

              {/* Prediction Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="block text-xs font-mono text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
                  PREDICT POST-COLLISION OUTCOME
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setPrediction("bounce_opposite")}
                    disabled={isColliding}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      prediction === "bounce_opposite"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    Bounce Apart in Opposite Directions
                  </button>

                  <button
                    onClick={() => setPrediction("stuck_right")}
                    disabled={isColliding}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      prediction === "stuck_right"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    Move Together to the Right
                  </button>
                </div>
              </div>

              {/* Start Launch Button */}
              <button
                onClick={handleStartCollision}
                disabled={isColliding}
                className="w-full py-4 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center space-x-2 uppercase tracking-wide cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                <Zap className="h-4 w-4" />
                <span>START COLLISION EXPERIMENT</span>
              </button>

              {/* Live Feedback */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-mono">
                <AlertCircle className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
              <li>Configure masses m₁ and m₂ along with initial velocities v₁ and v₂.</li>
              <li>Select <strong>Elastic</strong> or <strong>Inelastic</strong> collision.</li>
              <li>Predict the resulting directions and click <strong>START COLLISION EXPERIMENT</strong>!</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">What Did You Learn?</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Total linear momentum p = m<sub>1</sub>v<sub>1</sub> + m<sub>2</sub>v<sub>2</sub> is ALWAYS conserved in isolated systems.
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">Elastic Collision (e = 1)</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Both kinetic energy and linear momentum are strictly conserved. No heat or sound energy loss.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">Perfectly Inelastic (e = 0)</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Bodies stick together after impact and move with common velocity v<sub>joint</sub> = (m₁v₁ + m₂v₂)/(m₁ + m₂).</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
