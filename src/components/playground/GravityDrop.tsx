import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, RotateCcw, Volume2, VolumeX, AlertCircle, ArrowDownCircle,
  Play, Sparkles, Scale, Maximize2, Minimize2
} from "lucide-react";
import { synth } from "../../utils/sound";
import GameResultModal from "./GameResultModal";
import { trackAnalyticsEvent } from "../../utils/analytics";

interface GravityDropProps {
  score: number;
  onUpdateScore: (newScore: number) => void;
  onBackToPlayground: () => void;
}

interface DropObject {
  id: string;
  name: string;
  mass: number; // in kg
  area: number; // in m^2
  dragCoeff: number; // C_d
  icon: string;
  color: string;
}

const OBJECT_OPTIONS: DropObject[] = [
  { id: "lead-sphere", name: "Lead Sphere", mass: 10, area: 0.01, dragCoeff: 0.47, icon: "⚪", color: "#475569" },
  { id: "bowling-ball", name: "Bowling Ball", mass: 6, area: 0.03, dragCoeff: 0.47, icon: "🎳", color: "#1e293b" },
  { id: "tennis-ball", name: "Tennis Ball", mass: 0.058, area: 0.0035, dragCoeff: 0.5, icon: "🎾", color: "#84cc16" },
  { id: "feather", name: "Feather", mass: 0.005, area: 0.02, dragCoeff: 1.2, icon: "🪶", color: "#38bdf8" },
  { id: "paper-sheet", name: "Paper Sheet", mass: 0.004, area: 0.06, dragCoeff: 1.8, icon: "📄", color: "#94a3b8" }
];

const GRAVITY_ENVIRONMENTS = [
  { id: "moon", name: "Moon", g: 1.62, label: "Moon (1.62 m/s²)" },
  { id: "earth", name: "Earth", g: 9.81, label: "Earth (9.81 m/s²)" },
  { id: "jupiter", name: "Jupiter", g: 24.79, label: "Jupiter (24.79 m/s²)" }
];

export default function GravityDrop({ score, onUpdateScore, onBackToPlayground }: GravityDropProps) {
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  // Selections
  const [leftObj, setLeftObj] = useState<DropObject>(OBJECT_OPTIONS[0]); // Lead sphere
  const [rightObj, setRightObj] = useState<DropObject>(OBJECT_OPTIONS[3]); // Feather
  const [medium, setMedium] = useState<"vacuum" | "air">("air");
  const [environment, setEnvironment] = useState(GRAVITY_ENVIRONMENTS[1]); // Earth
  const [prediction, setPrediction] = useState<"left" | "right" | "both" | null>(null);

  // Animation State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [feedback, setFeedback] = useState("Select objects, medium, environment, make your prediction and click START DROP!");
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null);

  // Position references during fall
  const posLeft = useRef({ y: 0, v: 0, done: false, time: 0 });
  const posRight = useRef({ y: 0, v: 0, done: false, time: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    synth.muted = muted;
  }, [muted]);

  useEffect(() => {
    trackAnalyticsEvent("physics_game_started", { game_name: "gravity-drop" });
  }, []);

  // Listen for fullscreen change
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

  const resetDrop = () => {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    setIsDropping(false);
    setGameResult(null);
    posLeft.current = { y: 0, v: 0, done: false, time: 0 };
    posRight.current = { y: 0, v: 0, done: false, time: 0 };
    setFeedback("Select your prediction and click START DROP!");
    drawCanvas(0, 0);
  };

  const drawCanvas = (yL: number, yR: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const startY = 40;
    const groundY = height - 40;

    // Background Sky / Vacuum
    ctx.fillStyle = medium === "vacuum" ? "#0f172a" : "#f0f9ff";
    ctx.fillRect(0, 0, width, height);

    // Grid lines / altitude markers
    ctx.strokeStyle = medium === "vacuum" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    for (let h = startY; h <= groundY; h += 40) {
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(width, h);
      ctx.stroke();
    }

    // Ground line
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, groundY, width, height - groundY);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(0, groundY, width, 4);

    // Drop Rails
    const leftX = width * 0.3;
    const rightX = width * 0.7;

    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(leftX, startY);
    ctx.lineTo(leftX, groundY);
    ctx.moveTo(rightX, startY);
    ctx.lineTo(rightX, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Left Object
    const curYL = startY + (yL / 100) * (groundY - startY - 20);
    ctx.save();
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(leftObj.icon, leftX, curYL);
    ctx.restore();

    // Draw Right Object
    const curYR = startY + (yR / 100) * (groundY - startY - 20);
    ctx.save();
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(rightObj.icon, rightX, curYR);
    ctx.restore();

    // Altitude text
    ctx.fillStyle = medium === "vacuum" ? "#94a3b8" : "#475569";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`L: ${yL.toFixed(1)}%`, leftX, startY - 15);
    ctx.fillText(`R: ${yR.toFixed(1)}%`, rightX, startY - 15);
  };

  useEffect(() => {
    drawCanvas(0, 0);
  }, [leftObj, rightObj, medium, environment]);

  const handleStartDrop = () => {
    if (isDropping) return;
    if (!prediction) {
      setFeedback("Please predict which object will land first before releasing!");
      return;
    }

    setIsDropping(true);
    synth.playLaunch();

    posLeft.current = { y: 0, v: 0, done: false, time: 0 };
    posRight.current = { y: 0, v: 0, done: false, time: 0 };

    const dt = 0.016; // 60 FPS delta
    const g = environment.g;
    const rho = medium === "vacuum" ? 0 : 1.225; // air density kg/m^3

    let winningSide: "left" | "right" | "both" | null = null;

    const animate = () => {
      // Left object physics
      if (!posLeft.current.done) {
        posLeft.current.time += dt;
        const dragL = 0.5 * rho * posLeft.current.v * posLeft.current.v * leftObj.dragCoeff * leftObj.area;
        const accelL = g - dragL / leftObj.mass;
        posLeft.current.v += accelL * dt;
        posLeft.current.y += posLeft.current.v * dt * 8; // scale factor

        if (posLeft.current.y >= 100) {
          posLeft.current.y = 100;
          posLeft.current.done = true;
          if (!winningSide) winningSide = "left";
        }
      }

      // Right object physics
      if (!posRight.current.done) {
        posRight.current.time += dt;
        const dragR = 0.5 * rho * posRight.current.v * posRight.current.v * rightObj.dragCoeff * rightObj.area;
        const accelR = g - dragR / rightObj.mass;
        posRight.current.v += accelR * dt;
        posRight.current.y += posRight.current.v * dt * 8;

        if (posRight.current.y >= 100) {
          posRight.current.y = 100;
          posRight.current.done = true;
          if (!winningSide) winningSide = "right";
        }
      }

      drawCanvas(posLeft.current.y, posRight.current.y);

      if (posLeft.current.done && posRight.current.done) {
        // Evaluate winner
        const timeDiff = Math.abs(posLeft.current.time - posRight.current.time);
        let actualOutcome: "left" | "right" | "both" = "both";
        if (timeDiff > 0.05) {
          actualOutcome = posLeft.current.time < posRight.current.time ? "left" : "right";
        }

        const userWon = prediction === actualOutcome;

        if (userWon) {
          synth.playSuccess();
          onUpdateScore(score + 100);
          setGameResult("won");
          setFeedback(`Correct Prediction! ${actualOutcome === "both" ? "Both objects landed together in " + medium : (actualOutcome === "left" ? leftObj.name : rightObj.name) + " landed first!"}`);
        } else {
          synth.playError();
          setGameResult("lost");
          setFeedback(`Incorrect. Actual outcome: ${actualOutcome === "both" ? "Both objects landed together" : (actualOutcome === "left" ? leftObj.name : rightObj.name) + " landed first"}.`);
        }

        setIsDropping(false);
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
              Gravity Drop Simulator
            </h2>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50 uppercase font-bold">
              Topic: Free-Fall &amp; Drag Forces
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300">
            <span className="text-slate-400">SCORE:</span> <strong className="text-amber-700 dark:text-amber-400 font-extrabold">{score}</strong>
          </div>

          <button
            onClick={resetDrop}
            disabled={isDropping}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 disabled:opacity-40 cursor-pointer font-bold"
          >
            <RotateCcw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
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
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Canvas + Controls */}
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

              {/* Game Result Modal */}
              <GameResultModal
                gameResult={gameResult}
                gameId="gravity-drop"
                gameTitle="Gravity Drop"
                onClose={() => setGameResult(null)}
                onPlayAgain={resetDrop}
                onBackToPlayground={onBackToPlayground}
              />
            </div>

            {/* Controls Panel */}
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/60 space-y-6 text-left">
              
              {/* Selectors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Left Object */}
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold">LEFT OBJECT</label>
                  <select
                    value={leftObj.id}
                    onChange={(e) => setLeftObj(OBJECT_OPTIONS.find(o => o.id === e.target.value) || OBJECT_OPTIONS[0])}
                    disabled={isDropping}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-40"
                  >
                    {OBJECT_OPTIONS.map(o => (
                      <option key={o.id} value={o.id}>{o.icon} {o.name} ({o.mass}kg)</option>
                    ))}
                  </select>
                </div>

                {/* Right Object */}
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold">RIGHT OBJECT</label>
                  <select
                    value={rightObj.id}
                    onChange={(e) => setRightObj(OBJECT_OPTIONS.find(o => o.id === e.target.value) || OBJECT_OPTIONS[3])}
                    disabled={isDropping}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-40"
                  >
                    {OBJECT_OPTIONS.map(o => (
                      <option key={o.id} value={o.id}>{o.icon} {o.name} ({o.mass}kg)</option>
                    ))}
                  </select>
                </div>

                {/* Medium / Environment */}
                <div>
                  <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold">MEDIUM</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setMedium("vacuum")}
                      disabled={isDropping}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        medium === "vacuum" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 dark:text-slate-300 hover:text-blue-600"
                      }`}
                    >
                      Vacuum
                    </button>
                    <button
                      onClick={() => setMedium("air")}
                      disabled={isDropping}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        medium === "air" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700 dark:text-slate-300 hover:text-blue-600"
                      }`}
                    >
                      Atmosphere
                    </button>
                  </div>
                </div>

              </div>

              {/* Gravity Environment */}
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5 uppercase font-bold">GRAVITY LOCATION</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRAVITY_ENVIRONMENTS.map(env => (
                    <button
                      key={env.id}
                      onClick={() => setEnvironment(env)}
                      disabled={isDropping}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                        environment.id === env.id
                          ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      }`}
                    >
                      {env.name} ({env.g}m/s²)
                    </button>
                  ))}
                </div>
              </div>

              {/* Prediction Selection Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <span className="block text-xs font-mono text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
                  PREDICT THE WINNER BEFORE RELEASING
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setPrediction("left")}
                    disabled={isDropping}
                    className={`py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      prediction === "left"
                        ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    }`}
                  >
                    <span>Left ({leftObj.name})</span>
                  </button>

                  <button
                    onClick={() => setPrediction("both")}
                    disabled={isDropping}
                    className={`py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      prediction === "both"
                        ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    }`}
                  >
                    <Scale className="h-4 w-4" />
                    <span>Both Land Together</span>
                  </button>

                  <button
                    onClick={() => setPrediction("right")}
                    disabled={isDropping}
                    className={`py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                      prediction === "right"
                        ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    }`}
                  >
                    <span>Right ({rightObj.name})</span>
                  </button>
                </div>
              </div>

              {/* Start Drop Launch Button */}
              <button
                onClick={handleStartDrop}
                disabled={isDropping}
                className="w-full py-4 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center space-x-2 uppercase tracking-wide cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>START FREE-FALL DROP</span>
              </button>

              {/* Live Feedback */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 text-xs flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-mono">
                <AlertCircle className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400 shrink-0" />
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
              <li>Select two different objects to compare (e.g. Lead Sphere vs Feather).</li>
              <li>Toggle between <strong>Vacuum</strong> and <strong>Atmosphere</strong>.</li>
              <li>Choose Moon, Earth or Jupiter gravity.</li>
              <li>Predict which object will land first, then click <strong>START DROP</strong>!</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">What Did You Learn?</h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Galileo Galilei famously demonstrated that in a vacuum, all bodies fall with the exact same acceleration regardless of mass (g = G · M / R²).
            </p>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">1. In a Vacuum</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">No air resistance (C_d = 0). Mass cancels out in m · a = m · g → a = g.</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">2. In Atmosphere</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Air drag F_d = 0.5 · ρ · v² · C_d · A opposes weight. Light objects reach terminal velocity much faster.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
