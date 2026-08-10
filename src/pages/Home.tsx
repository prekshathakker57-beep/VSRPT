import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, Award, Compass, Play, BookOpen, Clock, Users, Flame, 
  HelpCircle, ChevronRight, CheckCircle2, ShieldAlert, Phone, MessageSquare,
  FileCheck2, Target, UserCheck, Sparkles, X, ChevronLeft, Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";
import { CENTRAL_CONFIG, COURSES_DATA, TOPPERS_DATA, STUDENT_STORIES } from "../config";
import examsImg from "../assets/images/exams-1.png";
import conceptLearningImg from "../assets/images/concept-learning.jpeg";

export interface GalleryImage {
  id: string;
  src: string;
  fallbackSrcs?: string[];
  title: string;
  description: string;
}

const CONCEPT_LEARNING_GALLERY: GalleryImage[] = [
  {
    id: "concept-1",
    src: conceptLearningImg,
    fallbackSrcs: [
      "/images/concept-learning.jpeg",
      "/images/WhatsApp Image 2026-07-27 at 1.23.12 PM.jpeg",
      "/WhatsApp Image 2026-07-27 at 1.23.12 PM.jpeg",
      "https://lh3.googleusercontent.com/d/1CChB1Aik4LR1mFpC6NL9JwbVJUpnzGG6"
    ],
    title: "Concept-Based Physics Learning",
    description: "Building strong fundamentals before moving to advanced problem solving at Apex Physics Institute."
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Gallery Lightbox state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const handlePrevGallery = () => {
    setCurrentGalleryIndex((prev) => 
      prev === 0 ? CONCEPT_LEARNING_GALLERY.length - 1 : prev - 1
    );
  };

  const handleNextGallery = () => {
    setCurrentGalleryIndex((prev) => 
      prev === CONCEPT_LEARNING_GALLERY.length - 1 ? 0 : prev + 1
    );
  };

  // Gallery keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      if (e.key === "Escape") setIsGalleryOpen(false);
      if (e.key === "ArrowLeft") handlePrevGallery();
      if (e.key === "ArrowRight") handleNextGallery();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen]);
  
  // Interactive Pendulum State for Hero section
  const [angle, setAngle] = useState(25);
  const [followerAngle, setFollowerAngle] = useState(18);
  const [isSwinging, setIsSwinging] = useState(true);
  const [gravity, setGravity] = useState(9.8);
  const swingRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const followerAngleRef = useRef<number>(18);

  // Pendulum physics simulation
  useEffect(() => {
    if (isSwinging) {
      const animatePendulum = () => {
        timeRef.current += 0.05;
        // Simple harmonic motion approximation: theta(t) = theta_max * cos(sqrt(g/L) * t)
        // Length L = 2.5 meters
        const frequency = Math.sqrt(gravity / 2.5);
        const nextAngle = 28 * Math.cos(frequency * timeRef.current);
        
        // Smooth lerp for follower angle so solid blue bob trails behind along the arc
        followerAngleRef.current += (nextAngle - followerAngleRef.current) * 0.1;

        setAngle(nextAngle);
        setFollowerAngle(followerAngleRef.current);
        swingRef.current = requestAnimationFrame(animatePendulum);
      };
      swingRef.current = requestAnimationFrame(animatePendulum);
    } else if (swingRef.current) {
      cancelAnimationFrame(swingRef.current);
    }

    return () => {
      if (swingRef.current) cancelAnimationFrame(swingRef.current);
    };
  }, [isSwinging, gravity]);

  const handleBobInteraction = () => {
    // Speed up or reset the oscillation when clicked
    timeRef.current = 0;
    setIsSwinging(true);
  };

  const handleCourseEnquiry = (courseId: string) => {
    navigate(`/contact?course=${courseId}`);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pt-20 overflow-hidden transition-colors duration-300">
      <SEO title="Stop Fearing Physics. Start Experiencing It." />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/15 blur-3xl rounded-full" />
          
          {/* Scientific grid mesh pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Compass className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: "8s" }} />
              <span>Concept-First Physics Academy</span>
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 dark:text-white leading-none">
              Stop Fearing Physics. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                Start Experiencing It.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-xl leading-relaxed">
              Unlock true conceptual understanding. Custom structural physics coaching for 
              <span className="text-blue-700 dark:text-blue-400 font-semibold"> NEET</span>, 
              <span className="text-blue-700 dark:text-blue-400 font-semibold"> JEE Main</span>, 
              <span className="text-blue-700 dark:text-blue-400 font-semibold"> JEE Advanced</span>, 
              <span className="text-blue-700 dark:text-blue-400 font-semibold"> MHT-CET</span>, and 
              Class 11–12 Board examinations in Kothrud, Pune.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-center shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>Book a Free Demo Lecture</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </Link>
              
              <Link
                to="/explore"
                className="px-8 py-4 rounded-full text-sm font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800 text-center transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Play Projectile Game</span>
              </Link>
            </div>

            {/* Micro quote tagline */}
            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
              “Physics is not something to fear. It is something to explore.”
            </p>
          </div>

          {/* Hero Right: Interactive Pendulum Simulation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[360px] aspect-square rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col items-center justify-between">
              
              <div className="absolute top-4 right-4 z-10 flex space-x-1.5">
                <button
                  onClick={() => setIsSwinging(!isSwinging)}
                  className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all ${
                    isSwinging ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {isSwinging ? "AUTO-SWINGING" : "PAUSED"}
                </button>
              </div>

              {/* Pendulum Interactive Controls */}
              <div className="w-full text-left space-y-2 mt-2">
                <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
                  Interactive Physics Lab (Demo)
                </span>
                <span className="block text-sm text-slate-700 dark:text-slate-200 font-semibold leading-none">
                  Harmonic Pendulum Oscillation
                </span>
              </div>

              {/* SVG Canvas drawing the Pendulum */}
              <div className="flex-1 w-full flex items-center justify-center relative min-h-[220px]">
                <svg className="w-full h-full max-h-[200px]" viewBox="0 0 200 200">
                  {/* Ceiling Line */}
                  <line x1="20" y1="20" x2="180" y2="20" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Pivot Point */}
                  <circle cx="100" cy="20" r="5" fill="#94a3b8" />
                  
                  {/* Pendulum Wire & Bob */}
                  {(() => {
                    const length = 120;
                    // Leading translucent circle coordinates
                    const rad = (angle * Math.PI) / 180;
                    const bobX = 100 + length * Math.sin(rad);
                    const bobY = 20 + length * Math.cos(rad);

                    // Trailing solid blue circle coordinates (follows leading circle along the same arc)
                    const followerRad = (followerAngle * Math.PI) / 180;
                    const followerX = 100 + length * Math.sin(followerRad);
                    const followerY = 20 + length * Math.cos(followerRad);

                    return (
                      <g>
                        {/* Suspension wire */}
                        <line
                          x1="100"
                          y1="20"
                          x2={bobX}
                          y2={bobY}
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray="2,2"
                        />
                        {/* Leading translucent light-blue circle */}
                        <circle cx={bobX} cy={bobY} r="18" fill="rgba(59, 130, 246, 0.2)" />
                        
                        {/* Trailing solid dark-blue circle (layered above translucent circle) */}
                        <circle
                          cx={followerX}
                          cy={followerY}
                          r="12"
                          fill="url(#bobGradient)"
                          className="cursor-pointer hover:stroke-blue-400 hover:stroke-2 transition-colors shadow-lg"
                          onClick={handleBobInteraction}
                        />
                      </g>
                    );
                  })()}

                  {/* Definitions for Gradients */}
                  <defs>
                    <radialGradient id="bobGradient" cx="40%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="70%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </radialGradient>
                  </defs>
                </svg>

                {/* Live Angular readout overlay */}
                <div className="absolute bottom-0 inset-x-0 flex justify-between items-center px-4">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <div>Angle: <span className="text-blue-600 dark:text-blue-400 font-bold">{angle.toFixed(1)}°</span></div>
                    <div>Gravity: <span className="text-blue-600 dark:text-blue-400 font-bold">{gravity} m/s²</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGravity(9.8)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${gravity === 9.8 ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"}`}
                      title="Earth Gravity"
                    >
                      Earth
                    </button>
                    <button
                      onClick={() => setGravity(1.6)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${gravity === 1.6 ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"}`}
                      title="Moon Gravity"
                    >
                      Moon
                    </button>
                    <button
                      onClick={() => setGravity(24.8)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${gravity === 24.8 ? "bg-amber-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"}`}
                      title="Jupiter Gravity"
                    >
                      Jupiter
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono mt-1 w-full text-center">
                Click Bob to manual oscillation | Use buttons to change gravity
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Statistics Dashboard Bento Grid */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-blue-100 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-slate-950/60 border border-blue-100 dark:border-slate-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent -z-10" />
              <span className="block text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-sans tracking-tight">5,000+</span>
              <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mt-2 font-bold">Students Mentored</span>
              <span className="block text-[9px] text-slate-400 font-mono mt-1 italic">*Demo numbers</span>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-slate-950/60 border border-blue-100 dark:border-slate-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent -z-10" />
              <span className="block text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-sans tracking-tight">15+ Years</span>
              <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mt-2 font-bold">Teaching Pedagogy</span>
              <span className="block text-[9px] text-slate-400 font-mono mt-1 italic">*Demo numbers</span>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-slate-950/60 border border-blue-100 dark:border-slate-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent -z-10" />
              <span className="block text-3xl md:text-4xl font-extrabold text-amber-600 dark:text-amber-400 font-sans tracking-tight">450+</span>
              <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mt-2 font-bold">NEET/JEE Toppers</span>
              <span className="block text-[9px] text-slate-400 font-mono mt-1 italic">*Demo numbers</span>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-slate-950/60 border border-blue-100 dark:border-slate-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent -z-10" />
              <span className="block text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-sans tracking-tight">12,000+</span>
              <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mt-2 font-bold">Live Teaching Hours</span>
              <span className="block text-[9px] text-slate-400 font-mono mt-1 italic">*Demo numbers</span>
            </div>

          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-400">
            <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Note: The statistics above represent high-caliber, editable demonstration figures that should be customized before final launch.</span>
          </div>
        </div>
      </section>

      {/* Focused Learning, Real Results Section */}
      <section className="py-20 lg:py-24 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Text Content & 4 Feature Cards */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Every great result begins with focused preparation.</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Focused Learning, Real Results
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
              At {CENTRAL_CONFIG.instituteName}, success isn't achieved overnight—it is built through consistency, conceptual clarity, and disciplined practice. Every worksheet, mock test, and classroom session is designed to strengthen fundamentals and prepare students for JEE, NEET, MHT-CET, and Board examinations.
            </p>

            {/* Four Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {/* Concept-Based Learning Card with Uploaded Image & Lightbox Trigger */}
              <div 
                onClick={() => {
                  setCurrentGalleryIndex(0);
                  setIsGalleryOpen(true);
                }}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Uploaded Image placed ABOVE the heading with 14-16px border radius */}
                  <div className="relative mb-3.5 overflow-hidden rounded-[14px] border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-[16/10]">
                    <img
                      src={conceptLearningImg}
                      alt="Concept-Based Learning at Apex Physics Institute"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const step = parseInt(target.dataset.fallbackStep || "0", 10);
                        if (step === 0) {
                          target.dataset.fallbackStep = "1";
                          target.src = "/images/concept-learning.jpeg";
                        } else if (step === 1) {
                          target.dataset.fallbackStep = "2";
                          target.src = "/images/WhatsApp Image 2026-07-27 at 1.23.12 PM.jpeg";
                        } else if (step === 2) {
                          target.dataset.fallbackStep = "3";
                          target.src = "/WhatsApp Image 2026-07-27 at 1.23.12 PM.jpeg";
                        } else if (step === 3) {
                          target.dataset.fallbackStep = "4";
                          target.src = "https://lh3.googleusercontent.com/d/1CChB1Aik4LR1mFpC6NL9JwbVJUpnzGG6";
                        }
                      }}
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300 block"
                    />
                    {/* View Gallery → Indicator Badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/90 text-white text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm group-hover:bg-blue-500 transition-colors">
                        <Maximize2 className="w-3 h-3" />
                        View Gallery →
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform flex-shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                      📘 Concept-Based Learning
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    Build strong fundamentals before moving to advanced problems.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                    📝 Regular Assessments
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Weekly tests and practice papers to monitor progress.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                    🎯 Exam-Oriented Preparation
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Structured guidance for JEE, NEET, Boards, and MHT-CET.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                    👨‍🏫 Personal Mentorship
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Individual attention with doubt-solving and academic guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Display Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-lg rounded-[18px] overflow-hidden shadow-2xl shadow-slate-900/15 border border-slate-200/80 dark:border-slate-800 bg-slate-900">
              <img
                src={examsImg}
                alt="Exams preparation and academic excellence at Apex Physics Institute"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  const step = parseInt(target.dataset.fallbackStep || "0", 10);
                  if (step === 0) {
                    target.dataset.fallbackStep = "1";
                    target.src = "/images/exams-1.png";
                  } else if (step === 1) {
                    target.dataset.fallbackStep = "2";
                    target.src = "/exams-1.png";
                  } else if (step === 2) {
                    target.dataset.fallbackStep = "3";
                    target.src = "/images/exams 1.png";
                  } else if (step === 3) {
                    target.dataset.fallbackStep = "4";
                    target.src = "/exams 1.png";
                  } else if (step === 4) {
                    target.dataset.fallbackStep = "5";
                    target.src = "https://lh3.googleusercontent.com/d/1MpYNFfVITMH_rkZxnmiHXbmNt0ajAhYn";
                  }
                }}
                className="w-full h-auto object-contain rounded-[18px] block"
              />
              {/* Subtle dark gradient overlay (10-15%) to improve visual depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none rounded-[18px]" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Course Overview Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 px-3 py-1.5 rounded-full font-bold">
            Curated Programs
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Targeted Physics Preparation
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
            Our coaching methodologies are designed specifically for board exams and competitive entries. Select a program and view details or submit an enquiry instantly.
          </p>
        </div>

        {/* Filter Tab buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {["all", "entrance", "boards", "online"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                activeTab === tab
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800"
              }`}
            >
              {tab === "all" ? "All Courses" : tab === "entrance" ? "Entrance (NEET/JEE/CET)" : tab === "boards" ? "School & Boards" : "Online Live"}
            </button>
          ))}
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES_DATA.filter((course) => {
            if (activeTab === "all") return true;
            if (activeTab === "entrance") return course.id.includes("neet") || course.id.includes("jee") || course.id.includes("cet");
            if (activeTab === "boards") return course.id.includes("class-11") || course.id.includes("boards");
            if (activeTab === "online") return course.id.includes("online");
            return true;
          }).map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-md hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 relative group"
            >
              {/* Highlight badge for specific classes */}
              <div className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                {course.duration}
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 w-fit">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {course.shortOverview}
                </p>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-mono block">Who is this for:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-sans block">{course.whoFor}</span>
                  </div>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                    <span className="font-mono text-[10px]">{course.frequency}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleCourseEnquiry(course.id)}
                  className="w-full py-3.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-950 hover:bg-blue-600 dark:hover:bg-blue-600 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white transition-all active:scale-[0.98] flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                >
                  <span>Enquire Program Details</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pedagogy Focus Section */}
      <section className="py-20 bg-blue-50/20 dark:bg-slate-900/40 border-y border-blue-100 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 px-3 py-1.5 rounded-full font-bold">
              Pedagogy Focus
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              We focus on WHY formulas work. Not just how to memorize them.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              In secondary coaching, memorization might secure initial results, but competitive examinations like JEE Advanced and NEET require deep structural analysis. Our curriculum isolates complex variables through visual physical demonstrations, numerical sprints, and personalized doubt sessions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                "Strong conceptual derivation models",
                "24/7 personal doubt resolution portal",
                "Focused small batches (Max 25 students)",
                "Standardized computer evaluations",
                "Regular state-wise ranking matrices",
                "Structured HSC & CBSE board prep"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 blur-2xl rounded-full" />
              
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                  Classroom Pedagogy
                </span>
                
                <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">
                  Why Students Choose {CENTRAL_CONFIG.instituteName}
                </h3>

                <blockquote className="border-l-4 border-blue-500 pl-4 text-slate-600 dark:text-slate-300 text-xs italic leading-relaxed py-2">
                  “We do not teach students to simply remember formulas. We help them understand why the formulas work. Once a student can visualize gravity, acceleration, or electrical fields, solving numericals becomes second nature.”
                  <span className="block text-right text-[10px] font-bold font-sans text-slate-500 dark:text-slate-400 mt-2">— {CENTRAL_CONFIG.contactPerson}</span>
                </blockquote>

                <div className="pt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800">
                    <span className="block text-xs font-bold text-blue-600 dark:text-blue-400">Concept</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Clarity</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800">
                    <span className="block text-xs font-bold text-blue-600 dark:text-blue-400">Numerical</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Sprints</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800">
                    <span className="block text-xs font-bold text-blue-600 dark:text-blue-400">Performance</span>
                    <span className="block text-[10px] text-slate-400 mt-1">Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Learning Journey Timeline */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 px-3 py-1.5 rounded-full font-bold">
            The Syllabus Model
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our 4-Step Learning Journey
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Transitioning fear into complete examination mastery through a systematic monthly sequence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left relative">
          
          {[
            {
              step: "01",
              title: "Understand Concept",
              desc: "Isolate terms, derive mechanics visually, and understand how variables interact in real life before looking at math."
            },
            {
              step: "02",
              title: "Visualize the Physics",
              desc: "Interact with interactive physical stimulations, digital graphs, vector force mappings, and real-life model experiments."
            },
            {
              step: "03",
              title: "Practice Application",
              desc: "Master high-speed calculation short-cuts and solve multi-concept numericals in rigorous step-by-step sessions."
            },
            {
              step: "04",
              title: "Master Examination",
              desc: "Simulate rigorous online JEE/NEET environment test series, identify mistakes, and secure outstanding rankings."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 relative group hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md transition-all">
              <span className="block font-mono text-4xl font-bold text-blue-100 dark:text-slate-800 group-hover:text-blue-300 dark:group-hover:text-blue-400 transition-colors mb-4 leading-none">
                {item.step}
              </span>
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </section>



      {/* Direct App Integration Callout */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/15 blur-3xl rounded-full -z-10" />
          
          <div className="flex flex-col lg:flex-row items-center gap-8 text-left">
            <div className="flex-1 space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 px-2.5 py-1 rounded">
                Classplus Integration
              </span>
              <h3 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-slate-900 dark:text-white">
                Learn Anywhere with our Student Mobile App
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl leading-relaxed">
                Already admitted? Download our official Classplus learning portal for instant mobile access to live lecture archives, practice tests, notes sharing, and personalized performance evaluations.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/student-app"
                className="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-center transition-all shadow-sm"
              >
                Onboarding Instructions
              </Link>
              <Link
                to="/student-app"
                className="px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 text-center transition-all shadow-md shadow-blue-500/10"
              >
                Go to App Page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-24 bg-blue-50/50 dark:bg-slate-900/60 border-t border-blue-100 dark:border-slate-800/80 text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Still Scared of Physics? <br />
            <span className="text-blue-600 dark:text-blue-400">
              Attend One Lecture Before Deciding.
            </span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Attend a free conceptual interactive session. Let us show you how we break down calculations and physical vectors into modular, logical steps. No commitment necessary.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>Book a Free Demo Lecture</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`tel:${CENTRAL_CONFIG.phoneNumberFormatted}`}
              className="px-6 py-4 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2 shadow-sm"
            >
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Call Academic Support</span>
            </a>

            <a
              href={`https://wa.me/${CENTRAL_CONFIG.whatsAppNumberFormatted}?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20the%20physics%20courses%20offered%20by%20${encodeURIComponent(CENTRAL_CONFIG.instituteName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all flex items-center space-x-2 shadow-sm"
            >
              <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp Admissions</span>
            </a>
          </div>
        </div>
      </section>

      {/* Concept-Based Learning Full-Screen Lightbox Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
            onClick={() => setIsGalleryOpen(false)}
          >
            {/* Top Bar: Title, Step Counter & Close Button */}
            <div 
              className="w-full max-w-5xl flex items-center justify-between text-white z-20 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-white">
                    📘 Concept-Based Learning Gallery
                  </h4>
                  <p className="text-xs text-slate-400">
                    Image {currentGalleryIndex + 1} of {CONCEPT_LEARNING_GALLERY.length}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700/60 shadow-lg group focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close Gallery"
              >
                <X className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Main Lightbox Content Area */}
            <div 
              className="relative my-auto w-full max-w-4xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Arrows (Shown when multiple images exist) */}
              {CONCEPT_LEARNING_GALLERY.length > 1 && (
                <>
                  <button
                    onClick={handlePrevGallery}
                    className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white transition-colors border border-slate-700/80 shadow-2xl z-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    onClick={handleNextGallery}
                    className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white transition-colors border border-slate-700/80 shadow-2xl z-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Active Image Display */}
              <motion.div
                key={CONCEPT_LEARNING_GALLERY[currentGalleryIndex].id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative max-h-[75vh] max-w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center p-2"
              >
                <img
                  src={CONCEPT_LEARNING_GALLERY[currentGalleryIndex].src}
                  alt={CONCEPT_LEARNING_GALLERY[currentGalleryIndex].title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallbacks = CONCEPT_LEARNING_GALLERY[currentGalleryIndex].fallbackSrcs || [];
                    const step = parseInt(target.dataset.fallbackStep || "0", 10);
                    if (step < fallbacks.length) {
                      target.dataset.fallbackStep = (step + 1).toString();
                      target.src = fallbacks[step];
                    }
                  }}
                />
              </motion.div>
            </div>

            {/* Caption & Counter Footer */}
            <div 
              className="w-full max-w-3xl text-center py-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <h5 className="font-sans font-bold text-sm sm:text-base text-white">
                {CONCEPT_LEARNING_GALLERY[currentGalleryIndex].title}
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl mx-auto leading-relaxed">
                {CONCEPT_LEARNING_GALLERY[currentGalleryIndex].description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
