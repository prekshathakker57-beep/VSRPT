import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Trophy, 
  TrendingUp, 
  Star, 
  CheckCircle2, 
  Play, 
  X, 
  UserCheck, 
  Lightbulb, 
  ClipboardCheck, 
  Target, 
  HelpCircle, 
  Activity, 
  BookOpen, 
  Award, 
  Sparkles, 
  Rocket, 
  Quote, 
  ArrowRight,
  ShieldCheck,
  Heart,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import vishaSirImg from "../assets/images/vishal-sir.jpeg";

export default function MeetOurMentor() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Statistics cards data
  const stats = [
    {
      id: "students",
      number: "5,000+",
      label: "Students Mentored",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50"
    },
    {
      id: "experience",
      number: "15+",
      label: "Years of Teaching",
      icon: Trophy,
      color: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50"
    },
    {
      id: "success",
      number: "98.4%",
      label: "Exam Success Rate",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50"
    },
    {
      id: "satisfaction",
      number: "99.2%",
      label: "Parent Satisfaction",
      icon: Star,
      color: "from-purple-500 to-pink-600",
      lightBg: "bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50"
    }
  ];

  // Academic Foundation Timeline Data
  const academicTimeline = [
    {
      degree: "Bachelor of Mechanical Engineering",
      institution: "Fr. Conceicao Rodrigues College of Engineering",
      location: "(Fr. CRCE), Mumbai",
      icon: GraduationCap
    },
    {
      degree: "Master’s in Naval Architecture & Ocean Engineering",
      institution: "Indian Institute of Technology Kharagpur",
      location: "(IIT Kharagpur)",
      icon: GraduationCap
    },
    {
      degree: "Specialization in Piping & Structural Engineering",
      institution: "Indian Institute of Technology Bombay",
      location: "(Powai)",
      icon: GraduationCap
    }
  ];

  // Why choose mentor features
  const features = [
    {
      title: "Personal Attention",
      description: "Intimate batch sizes ensuring every student receives 1-on-1 performance guidance tailored to their learning pace.",
      icon: UserCheck,
      badge: "Small Batches"
    },
    {
      title: "Concept-Based Learning",
      description: "Intuitive physical visualizer models over formula memorization so students solve complex unseen numericals with ease.",
      icon: Lightbulb,
      badge: "No Rote Learning"
    },
    {
      title: "Regular Assessments",
      description: "Weekly exam-oriented tests with instant diagnostic analytics and personalized revision feedback sessions.",
      icon: ClipboardCheck,
      badge: "Weekly Tests"
    },
    {
      title: "Exam Strategies",
      description: "Time management tactics, paper-solving tricks, and error-prevention methods refined over 15+ years of coaching.",
      icon: Target,
      badge: "Score Booster"
    },
    {
      title: "24/7 Doubt Solving",
      description: "Direct mentor access via offline sessions and online forums so no student goes to sleep with an unanswered query.",
      icon: HelpCircle,
      badge: "Always Accessible"
    },
    {
      title: "Performance Tracking",
      description: "Transparent progress metrics and regular parent-mentor syncs to keep learning trajectories aligned with target goals.",
      icon: Activity,
      badge: "Parent Portal"
    }
  ];

  const handleDemoClick = (e: React.MouseEvent) => {
    const enquiryForm = document.getElementById("enquiry-form-section");
    if (enquiryForm) {
      e.preventDefault();
      enquiryForm.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="mentor" className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-slate-900/5 via-blue-50/30 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 transition-colors duration-500">
      
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20 sm:space-y-28">

        {/* 1. SECTION HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900/50 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            OUR MENTOR
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            The Teacher Behind Hundreds of Success Stories
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            A mentor who believes that every student can master Physics with the right guidance, consistency, and curiosity.
          </p>
        </motion.div>

        {/* 2. MAIN MENTOR PROFILE GRID (2 Columns: 40% Left Image & Signature, 60% Right Bio & Stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN (40%): Photo, Badges, Handwritten Note */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Glassmorphism Frame around Portrait */}
            <div className="relative group">
              {/* Background gradient glow behind image */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[28px] blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 sm:p-4 rounded-[24px] border border-blue-200/60 dark:border-slate-800 shadow-xl shadow-blue-950/5">
                <div className="overflow-hidden rounded-[20px] aspect-[3/4] relative bg-slate-100 dark:bg-slate-800">
                  <img
                    src={vishaSirImg}
                    alt="Prof. Vishal Shibad, Founder and Physics Mentor"
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const step = parseInt(target.dataset.fallbackStep || "0", 10);
                      if (step === 0) {
                        target.dataset.fallbackStep = "1";
                        target.src = "/images/vishal-shibad-founder.jpg";
                      } else if (step === 1) {
                        target.dataset.fallbackStep = "2";
                        target.src = "/images/vishal-sir.jpeg";
                      } else if (step === 2) {
                        target.dataset.fallbackStep = "3";
                        target.src = "/images/vishal-shibad.jpg";
                      } else if (step === 3) {
                        target.dataset.fallbackStep = "4";
                        target.src = "/mentor-portrait.jpg";
                      }
                    }}
                  />
                  
                  {/* Floating Overlay Pill Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white flex items-center justify-between shadow-lg">
                    <div>
                      <h4 className="font-sans font-bold text-sm text-white">Vishal Shibad</h4>
                      <p className="text-[11px] font-mono text-blue-300">Founder &amp; Physics Mentor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Three Verified Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: "Trusted Mentor", icon: ShieldCheck },
                { label: "Student First", icon: Heart },
                { label: "Personalized", icon: UserCheck }
              ].map((badge, idx) => {
                const IconComp = badge.icon;
                return (
                  <div key={idx} className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-white dark:bg-slate-900/90 border border-blue-100 dark:border-slate-800 rounded-xl shadow-sm text-center">
                    <IconComp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Handwritten-Style Signature Philosophy Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-amber-200/80 dark:border-amber-900/40 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 text-amber-300/40 dark:text-amber-500/10 pointer-events-none">
                <MessageSquare className="h-16 w-16" />
              </div>
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400 font-bold bg-amber-100/80 dark:bg-amber-950/80 px-2.5 py-1 rounded-md inline-block">
                  Signature Philosophy
                </span>
                <blockquote className="text-xl sm:text-2xl font-serif font-bold italic text-slate-900 dark:text-white leading-relaxed">
                  “Life is ____.”
                </blockquote>
                <div className="pt-2 border-t border-amber-200/60 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-serif font-bold text-amber-900 dark:text-amber-300 text-sm">
                    — Vishal Shibad
                  </span>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                    Founder &amp; Physics Mentor
                  </span>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT COLUMN (60%): Bio, Achievements, Philosophy */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Header / Intro */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 px-3 py-1 rounded-md">
                Meet Our Founder
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Transforming Fear into Physics Mastery
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
            </div>

            {/* Inspiring Biography Text */}
            <div className="prose prose-slate dark:prose-invert text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Founded by <strong className="text-slate-900 dark:text-white">Prof. Vishal Shibad</strong> (M.Tech, IIT Bombay), V.S.R.P.T was built on a simple yet powerful realization: <em className="text-blue-600 dark:text-blue-400 font-medium">Physics is rarely hard—it is simply taught as dry equations rather than visible physical reality.</em>
              </p>
              <p>
                Over the past <strong className="text-slate-900 dark:text-white">15+ years</strong>, Prof. Shibad has personally guided over 5,000 students through the rigorous preparation for <strong className="text-slate-900 dark:text-white">NEET, JEE Main, JEE Advanced, MHT-CET</strong>, and Class 11-12 Boards. His unique methodology replaces rote formula memorization with intuitive free-body diagrams, 3D visual mental models, and real-world experiments.
              </p>
              <p>
                Recognizing that every student learns at a different pace, he emphasizes personalized attention, structured numerical practice sprints, and round-the-clock doubt resolution. His goal isn't merely producing high scores, but instilling lifetime problem-solving confidence.
              </p>
            </div>

            {/* 3. ACHIEVEMENT CARDS (4 Stats) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                    className={`p-4 rounded-2xl border ${stat.lightBg} shadow-sm backdrop-blur-md transition-all flex flex-col justify-between group`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">VERIFIED</span>
                    </div>
                    <div>
                      <span className="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {stat.number}
                      </span>
                      <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                        {stat.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 4. TEACHING PHILOSOPHY CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 sm:p-7 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-800 shadow-xl shadow-blue-950/5 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600" />
              
              <div className="space-y-3 pl-2">
                <div className="flex items-center space-x-2">
                  <Quote className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    Teaching Philosophy
                  </span>
                </div>
                <blockquote className="text-lg sm:text-xl font-serif font-bold italic text-slate-900 dark:text-white leading-relaxed">
                  “Life is ____.”
                </blockquote>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Vishal Shibad</span>
                  <span>Founder &amp; Physics Mentor</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* 5. ACADEMIC FOUNDATION TIMELINE SECTION */}
        <div className="space-y-10 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 px-3 py-1 rounded-md inline-block">
              EDUCATIONAL BACKGROUND
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              ACADEMIC FOUNDATION
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Built upon rigorous engineering and research disciplines from premier institutions.
            </p>
          </div>

          {/* Three-Step Vertical Timeline */}
          <div className="max-w-3xl mx-auto relative px-3 sm:px-6">
            {/* Dotted Vertical Connector Line between entries */}
            <div className="absolute left-8 sm:left-11 top-8 bottom-8 w-0 border-l-2 border-dashed border-blue-300 dark:border-blue-800/80 z-0" />

            <div className="space-y-8 sm:space-y-10 relative z-10">
              {academicTimeline.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-4 sm:gap-6 group"
                  >
                    {/* Graduation-Cap Icon Badge */}
                    <div className="relative shrink-0 pt-1">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 ring-4 ring-slate-50 dark:ring-slate-950">
                        <IconComp className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                    </div>

                    {/* Qualification & Institution Details Card */}
                    <div className="flex-1 min-w-0 bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all group-hover:border-blue-300 dark:group-hover:border-blue-800/80 space-y-2">
                      <h4 className="font-sans font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug break-words">
                        {item.degree}
                      </h4>
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 leading-normal break-words">
                        {item.institution}
                      </p>
                      <p className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 break-words">
                        {item.location}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6. WHY STUDENTS CHOOSE OUR MENTOR (6 Feature Cards Grid) */}
        <div className="space-y-12 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1 rounded-md">
              THE MENTORSHIP DIFFERENCE
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Students Excel Under Prof. Shibad
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Structured methodology engineered to build clarity, speed, and exam confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-4 group hover:border-blue-400/50 dark:hover:border-blue-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 7. VIDEO INTRODUCTION & FEATURED STUDENT QUOTE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          
          {/* Video Introduction Card (7 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800"
          >
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-blue-950/80 z-0" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/80 px-3 py-1 rounded-full font-bold inline-block">
                VIDEO INTRODUCTION
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Meet Your Mentor
              </h3>
              <p className="text-slate-300 text-sm max-w-lg leading-relaxed">
                Watch a short introduction from our mentor sharing his core philosophy, teaching style, and how V.S.R.P.T prepares you for exam day.
              </p>
            </div>

            {/* Embedded YouTube Video Area */}
            <div className="relative z-10 mt-6 aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-slate-950">
              <iframe
                src="https://www.youtube.com/embed/6NwS6PsSwyY"
                title="Meet Your Mentor — Prof. Vishal Shibad Video Introduction"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <p className="relative z-10 text-[11px] font-mono text-slate-400 mt-4 text-center">
              "Watch a short introduction from our mentor."
            </p>
          </motion.div>

          {/* Featured Student Testimonial Quote Card (5 Columns) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-100 bg-white/20 border border-white/30 px-3 py-1 rounded-full font-bold">
                  STUDENT TESTIMONIAL
                </span>
                <div className="flex space-x-1 text-amber-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-300" />
                  ))}
                </div>
              </div>

              <blockquote className="text-base sm:text-lg font-serif italic leading-relaxed text-blue-50">
                “Prof. Vishal Shibad transformed how I look at Physics. Before joining V.S.R.P.T, I was struggling with rotational motion and electrodynamics. His visual step-by-step approach made complex numericals feel like fun logical puzzles, helping me score 105/120 in JEE Physics!”
              </blockquote>
            </div>

            <div className="pt-6 border-t border-white/20 relative z-10 flex items-center space-x-3 mt-6">
              <div className="w-12 h-12 rounded-full bg-white text-blue-700 font-extrabold flex items-center justify-center text-base shadow-md shrink-0">
                AK
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-white">Aditya Kulkarni</h4>
                <p className="text-xs text-blue-200 font-mono">JEE Advanced AIR 412 • IIT Bombay CS</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 8. ELEGANT CALL TO ACTION AT BOTTOM OF SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl border border-blue-900/50 text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-300 bg-blue-900/80 border border-blue-700/60 px-3.5 py-1.5 rounded-full font-bold">
              START YOUR PREPARATION TODAY
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join hundreds of students learning Physics through conceptual understanding and expert guidance.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#enquiry-form-section"
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-extrabold text-slate-950 bg-white hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Book a Free Demo Class</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <Link
              to="/results"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-extrabold text-white bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>View Student Results</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* VIDEO MODAL POPUP */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-blue-400 fill-current" />
                  <span className="font-sans font-bold text-sm">Meet Your Mentor — Intro Video</span>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black relative">
                {/* Embed YouTube video or fallback placeholder frame */}
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/6NwS6PsSwyY?autoplay=1"
                  title="Prof. Vishal Shibad Introduction"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-4 bg-slate-950 text-slate-300 text-xs flex justify-between items-center font-mono">
                <span>V.S.R.PT Physics Institute • Mumbai</span>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Close Video
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
