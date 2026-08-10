import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, X, Sparkles, 
  HelpCircle, Compass, ShieldAlert, ArrowRight, Bookmark, Clock, 
  Tag, ExternalLink, Globe, Layers, Zap, Info, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  featured?: boolean;
  classBadge?: string;
  topics: string[];
  disclaimer: string;
  hasInteractiveSim?: boolean;
  relatedGameId?: string;
}

const VISUAL_VIDEOS: VideoItem[] = [
  {
    id: "earth-split-four-parts",
    title: "What If Earth Split Into Four Parts?",
    description: "Explore what could happen if Earth suddenly separated into four parts. This visual thought experiment examines gravity, orbital motion, structural forces, the atmosphere, oceans, and the possible movement of the separated sections.",
    thumbnailUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1200",
    duration: "4:15",
    category: "Gravity & Astrophysics",
    featured: true,
    classBadge: "Class 11 & 12 / JEE / NEET",
    topics: ["Gravity", "Orbital Motion", "Earth Science", "Thought Experiment"],
    disclaimer: "This is a conceptual visualisation created for learning and discussion. It does not represent a real-world prediction.",
    hasInteractiveSim: true,
    relatedGameId: "gravity-drop"
  },
  {
    id: "gravity-disappeared",
    title: "What If Gravity Suddenly Disappeared?",
    description: "Visualizing the immediate kinetic breakdown, atmospheric dissipation, and planetary orbit trajectories if gravitational acceleration instantly dropped to zero.",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    duration: "3:40",
    category: "Gravitational Mechanics",
    classBadge: "Class 11 / JEE Foundation",
    topics: ["Gravity", "Centripetal Force", "Atmospheric Physics"],
    disclaimer: "Hypothetical thought experiment for conceptual understanding.",
    relatedGameId: "gravity-drop"
  },
  {
    id: "live-on-mars",
    title: "Can Humans Live on Mars?",
    description: "Answering the physical challenges of Martian colonization: 38% surface gravity, radiation shielding, atmospheric pressure, and greenhouse thermodynamics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800",
    duration: "5:10",
    category: "Space Physics & Thermodynamics",
    classBadge: "General Physics",
    topics: ["Thermodynamics", "Planetary Gravity", "Radiation"],
    disclaimer: "Educational simulation based on current aerospace data.",
    relatedGameId: "projectile-challenge"
  },
  {
    id: "black-hole-event-horizon",
    title: "What Happens Near a Black Hole?",
    description: "Gravitational time dilation, tidal spaghettification forces, and light bending around Schwarzschild event horizons.",
    thumbnailUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=800",
    duration: "6:25",
    category: "General Relativity",
    classBadge: "Advanced Conceptual",
    topics: ["Relativity", "Gravitational Lensing", "Space-Time"],
    disclaimer: "Visual model illustrating relativistic equations.",
    relatedGameId: "gravity-drop"
  },
  {
    id: "satellites-stay-in-orbit",
    title: "Why Do Satellites Stay in Orbit?",
    description: "Understanding continuous free-fall, orbital velocity calculations, and Newton's cannonball thought experiment.",
    thumbnailUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    duration: "3:55",
    category: "Orbital Mechanics",
    classBadge: "Class 11 / JEE Main",
    topics: ["Orbital Velocity", "Kepler's Laws", "Centripetal Force"],
    disclaimer: "Calculated assuming uniform spherical Earth field.",
    relatedGameId: "projectile-challenge"
  },
  {
    id: "moon-closer-earth",
    title: "What If the Moon Came Closer to Earth?",
    description: "Tip-of-the-iceberg tidal dynamics, Roche limit breakups, mega-ocean surges, and rotational deceleration.",
    thumbnailUrl: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=800",
    duration: "4:50",
    category: "Tidal Forces & Astronomy",
    classBadge: "Class 11 / Olympiad",
    topics: ["Tidal Forces", "Roche Limit", "Angular Momentum"],
    disclaimer: "Conceptual model of fluid body gravitational interaction.",
    relatedGameId: "pendulum-match"
  },
  {
    id: "projectile-motion-visual",
    title: "How Does Projectile Motion Work?",
    description: "Deconstructing horizontal velocity independence and vertical acceleration under uniform gravitational field.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    duration: "3:15",
    category: "Kinematics",
    classBadge: "Class 11 / NEET & JEE",
    topics: ["Kinematics", "2D Vectors", "Parabolic Paths"],
    disclaimer: "Visual breakdown of ideal kinematic equations.",
    relatedGameId: "projectile-challenge"
  },
  {
    id: "speed-of-light-physics",
    title: "What Happens at the Speed of Light?",
    description: "Relativistic mass increase, time dilation, length contraction, and why massive particles cannot reach c.",
    thumbnailUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
    duration: "5:45",
    category: "Modern Physics",
    classBadge: "Class 12 / JEE Advanced",
    topics: ["Special Relativity", "Lorentz Factor", "Photon Energy"],
    disclaimer: "Theoretical visualization of Einstein's postulates.",
    relatedGameId: "collision-lab"
  }
];

export default function PhysicsVisualLab() {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // Prevent background scrolling when video modal is open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedVideo]);

  // Interactive 2D Canvas Simulation for "Earth Split Into Four Parts"
  useEffect(() => {
    if (!selectedVideo || selectedVideo.id !== "earth-split-four-parts") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    let separation = 25; // Separation distance between Earth quadrants

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Deep space canvas background
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, canvas.width / 1.2);
      bgGrad.addColorStop(0, "#0b132b");
      bgGrad.addColorStop(0.5, "#070b19");
      bgGrad.addColorStop(1, "#02040a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant stars background
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97) % canvas.width;
        const sy = (i * 131) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      if (isPlaying) {
        angle += 0.015;
        separation = 25 + Math.sin(angle * 0.8) * 15;
      }

      // Draw Glowing Gravitational Field Lines connecting the 4 Quadrants
      const quadrants = [
        { x: cx - separation, y: cy - separation, label: "Part A (N.America & Pacific)" },
        { x: cx + separation, y: cy - separation, label: "Part B (Eurasia & Africa)" },
        { x: cx + separation, y: cy + separation, label: "Part C (Australia & S.Ocean)" },
        { x: cx - separation, y: cy + separation, label: "Part D (S.America & Atlantic)" }
      ];

      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i < 4; i++) {
        const next = quadrants[(i + 1) % 4];
        ctx.beginPath();
        ctx.moveTo(quadrants[i].x, quadrants[i].y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Center Gravitational Mass Point
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#0284c7";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw the 4 Earth Quadrants
      quadrants.forEach((q, idx) => {
        ctx.save();
        ctx.translate(q.x, q.y);
        ctx.rotate(angle * (idx % 2 === 0 ? 1 : -0.8));

        // Quadrant Earth Crust Arc
        const quadGrad = ctx.createLinearGradient(-35, -35, 35, 35);
        quadGrad.addColorStop(0, "#0284c7");
        quadGrad.addColorStop(0.5, "#0d9488");
        quadGrad.addColorStop(1, "#0369a1");

        ctx.fillStyle = quadGrad;
        ctx.shadowColor = "rgba(14, 165, 233, 0.4)";
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(0, 0, 38, (idx * Math.PI) / 2, ((idx + 1) * Math.PI) / 2, false);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Molten Core Glow Boundary
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos((idx * Math.PI) / 2) * 38, Math.sin((idx * Math.PI) / 2) * 38);
        ctx.stroke();

        ctx.restore();

        // Quadrant Labeling
        ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.textAlign = q.x > cx ? "left" : "right";
        const tx = q.x > cx ? q.x + 45 : q.x - 45;
        ctx.fillText(`Part ${String.fromCharCode(65 + idx)}`, tx, q.y + 4);
      });

      // HUD Text
      ctx.fillStyle = "#38bdf8";
      ctx.font = "11px JetBrains Mono, monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SIMULATION: EARTH 4-WAY SEPARATION`, 15, 25);
      ctx.fillText(`GRAVITATIONAL DRIFT: ${(separation / 10).toFixed(2)} AU`, 15, 42);
      ctx.fillText(`STATUS: ${isPlaying ? "ANIMATING PHYSICS" : "PAUSED (Click Play)"}`, 15, 59);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedVideo, isPlaying]);

  const handleFullscreenToggle = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleOpenPlaygroundSim = (gameId?: string) => {
    setSelectedVideo(null);
    navigate("/explore");
  };

  const featuredVideo = VISUAL_VIDEOS[0];
  const otherVideos = VISUAL_VIDEOS.slice(1);

  return (
    <section className="py-12 md:py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold tracking-wide uppercase">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>PHYSICS VISUAL LAB</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            See Physics Come to Life
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore visual explanations, thought experiments, and fascinating Physics concepts designed to make complex ideas easier to understand.
          </p>
        </div>

        {/* 1. FEATURED VIDEO HERO CARD */}
        <div className="relative group rounded-3xl p-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">
          <div className="rounded-[22px] bg-white dark:bg-slate-900 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden">
            
            {/* Left 16:9 Thumbnail Column */}
            <div className="lg:col-span-7 relative group/thumb overflow-hidden rounded-2xl aspect-video bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
              <img 
                src={featuredVideo.thumbnailUrl} 
                alt={featuredVideo.title}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/focused-student.jpg";
                }}
                className="w-full h-full object-cover transform group-hover/thumb:scale-105 transition-transform duration-700"
              />
              
              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                <span className="px-3 py-1 bg-blue-600/90 text-white font-bold rounded-lg backdrop-blur-md shadow-md uppercase tracking-wider text-[11px]">
                  FEATURED THOUGHT EXPERIMENT
                </span>
                <span className="px-2.5 py-1 bg-slate-900/80 text-blue-300 font-bold rounded-lg border border-white/10 backdrop-blur-md flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{featuredVideo.duration}</span>
                </span>
              </div>

              {/* Play Button Overlay */}
              <button 
                onClick={() => {
                  setSelectedVideo(featuredVideo);
                  setIsPlaying(true);
                }}
                className="absolute inset-0 m-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 transform group-hover/thumb:scale-110 transition-all cursor-pointer group-active:scale-95 border-2 border-white/40"
                aria-label={`Watch ${featuredVideo.title}`}
              >
                <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-current ml-1" />
              </button>
            </div>

            {/* Right Details Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                <Globe className="h-4 w-4" />
                <span>{featuredVideo.category}</span>
                <span>•</span>
                <span className="text-slate-500 dark:text-slate-400">{featuredVideo.classBadge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight font-display">
                {featuredVideo.title}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {featuredVideo.description}
              </p>

              {/* Topic Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {featuredVideo.topics.map((topic, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedVideo(featuredVideo);
                    setIsPlaying(true);
                  }}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Watch Visual Explainer</span>
                </button>

                <button
                  onClick={() => handleOpenPlaygroundSim(featuredVideo.relatedGameId)}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Try Gravity Simulation</span>
                </button>
              </div>

              {/* Disclaimer Note */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-300 flex items-start space-x-2 leading-snug">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{featuredVideo.disclaimer}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. THREE-COLUMN CONCEPTUAL VIDEO GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              More Conceptual Visual Explainers
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {otherVideos.length} Modules Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {otherVideos.map((video) => (
              <div 
                key={video.id}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/focused-student.jpg";
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-slate-950/80 text-white text-[10px] font-mono font-bold rounded backdrop-blur-md flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{video.duration}</span>
                    </span>

                    {/* Category pill */}
                    <span className="absolute top-2 left-2 px-2.5 py-1 bg-blue-600/90 text-white text-[10px] font-mono font-bold rounded backdrop-blur-md">
                      {video.category}
                    </span>

                    {/* Play Overlay Button */}
                    <button 
                      onClick={() => {
                        setSelectedVideo(video);
                        setIsPlaying(true);
                      }}
                      className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg cursor-pointer border border-white/30"
                      aria-label={`Play ${video.title}`}
                    >
                      <Play className="h-6 w-6 fill-current ml-0.5" />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 block">
                      {video.classBadge}
                    </span>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {video.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {video.topics.slice(0, 3).map((topic, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setSelectedVideo(video);
                      setIsPlaying(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>Watch Visual Module</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. DEDICATED VIDEO VIEWER / POPUP MODAL */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-5xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]"
            >
              
              {/* Modal Sticky Top Controls */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 bg-blue-600/80 text-blue-100 rounded text-[10px] font-mono uppercase font-bold tracking-wide">
                    VISUAL LAB
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md">
                    {selectedVideo.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFullscreenToggle}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                    title="Close Video Player"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* 16:9 Video Player Viewport Container */}
                <div ref={videoContainerRef} className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden shadow-2xl border border-slate-800 group">
                  
                  {selectedVideo.hasInteractiveSim ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                      <canvas
                        ref={canvasRef}
                        width="800"
                        height="450"
                        className="w-full h-full object-contain block"
                      />

                      {/* Playback HUD Bar Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-white text-xs font-mono">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                          </button>
                          <span>{isPlaying ? "SIMULATING GRAVITY DRIFT" : "PAUSED"}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </button>
                          <span className="text-[10px] text-blue-300">16:9 REALTIME CANVAS</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img 
                        src={selectedVideo.thumbnailUrl} 
                        alt={selectedVideo.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/focused-student.jpg";
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                        <div className="p-4 rounded-full bg-blue-600/90 border border-white/30 text-white">
                          <Play className="h-8 w-8 fill-current ml-1" />
                        </div>
                        <h4 className="text-lg font-bold">Interactive Concept Viewer</h4>
                        <p className="text-xs text-slate-300 max-w-md">
                          This visual explainer breaks down {selectedVideo.title}. Use the controls below to review topic breakdowns and related simulations.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* DEDICATED DETAIL SEGMENT FOR "Earth Split Into Four Parts" */}
                <div className="space-y-6 text-slate-800 dark:text-slate-200">
                  
                  {/* Title & Description */}
                  <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold rounded">
                        {selectedVideo.category}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-500 font-bold">{selectedVideo.duration}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                      {selectedVideo.title}
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  </div>

                  {/* Section 1: The Scenario */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Section 1: The Scenario</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      This visual thought experiment explores an imaginary scenario in which Earth is separated into four large equal quadrants. By examining each quadrant as an independent planetary mass with its own center of gravity, we observe how mutual gravitational attractions and centrifugal forces interact.
                    </p>
                  </div>

                  {/* Section 2: Forces Involved */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>Section 2: Forces Involved</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { title: "Gravity", desc: "Mutual inverse-square attraction pulling pieces back together." },
                        { title: "Momentum", desc: "Linear momentum vectors carrying each quadrant outward." },
                        { title: "Rotational Motion", desc: "Angular momentum altering spin axis stability." },
                        { title: "Structural Forces", desc: "Internal mantle stress and core thermal dissipation." },
                        { title: "Atmospheric Behaviour", desc: "Gas pressure gradients expanding into vacuum gaps." },
                        { title: "Ocean Movement", desc: "Tidal surges and fluid displacement across fragments." }
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <strong className="text-blue-600 dark:text-blue-400 font-mono block">{item.title}</strong>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Questions to Think About */}
                  <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 space-y-3">
                    <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-300 flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Section 3: Questions to Think About</span>
                    </h4>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-950 dark:text-indigo-200">
                      <li className="flex items-start space-x-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>Would the four pieces remain together or drift apart?</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>How would local gravitational acceleration change on each surface?</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>What could happen to the atmosphere in the gap regions?</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>Could the pieces begin orbiting one another around a common barycenter?</span>
                      </li>
                    </ul>
                  </div>

                  {/* Section 4: Try a Related Simulation */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="font-bold text-base">Section 4: Try a Related Simulation</h4>
                      <p className="text-xs text-blue-100">
                        Test gravitational acceleration and projectile trajectories live in the Physics Playground.
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenPlaygroundSim(selectedVideo.relatedGameId)}
                      className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs shrink-0 shadow-md transition-all cursor-pointer active:scale-95 flex items-center space-x-2"
                    >
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>Explore Gravity in the Physics Playground</span>
                    </button>
                  </div>

                  {/* Section 5: Important Note / Disclaimer */}
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-start space-x-2">
                    <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Section 5: Important Note —</strong> This video is a thought experiment designed to encourage curiosity and conceptual understanding. The exact outcome would depend on many complex physical conditions.
                    </span>
                  </div>

                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
