import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Atom, Menu, X, UserCheck, ChevronRight, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CENTRAL_CONFIG } from "../config";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Meet Our Mentor", path: "/mentor" },
    { name: "Physics Visual Lab", path: "/visual-lab" },
    { name: "Explore Physics", path: "/explore" },
    { name: "Results & Stories", path: "/results" },
    { name: "Student App", path: "/student-app" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  const handleEnquireScroll = (e: React.MouseEvent) => {
    if (location.pathname === "/contact" || location.pathname === "/") {
      const formElement = document.getElementById("enquiry-form-section");
      if (formElement) {
        e.preventDefault();
        formElement.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-blue-100/80 dark:border-slate-800 shadow-md py-3"
            : "bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group focus:outline-none">
              <div className="relative flex items-center">
                <img 
                  src="/vsrpt-logo.jpg" 
                  alt="V.S.R.P.T Logo" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const step = parseInt(target.dataset.fallbackStep || "0", 10);
                    if (step === 0) {
                      target.dataset.fallbackStep = "1";
                      target.src = "/vsrpt-logo.png";
                    } else if (step === 1) {
                      target.dataset.fallbackStep = "2";
                      target.src = "/images/logo.jpeg";
                    } else if (step === 2) {
                      target.dataset.fallbackStep = "3";
                      target.src = "https://lh3.googleusercontent.com/d/1zg-f9e3kOx5RavVnJbsxttOTNJQnTDX7";
                    }
                  }}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-blue-500/40 group-hover:border-purple-500 transition-all shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 opacity-25 blur-md rounded-full -z-10 group-hover:opacity-40 transition-all" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-lg sm:text-xl leading-tight tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                  V.S.R.P.T
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-500 dark:text-slate-400 uppercase leading-none font-bold">
                  Physics Institute
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

              {/* Action Buttons & Theme Toggle */}
              <div className="flex items-center space-x-3">
                
                {/* Day / Night Theme Toggle Switch */}
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle Day and Night Mode"
                  title={theme === "light" ? "Switch to Night Mode (Dark)" : "Switch to Day Mode (Light)"}
                  className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-yellow-400 transition-all cursor-pointer shadow-sm flex items-center justify-center group"
                >
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "light" ? (
                      <Moon className="h-4.5 w-4.5 text-slate-700 group-hover:text-blue-600" />
                    ) : (
                      <Sun className="h-4.5 w-4.5 text-amber-400 group-hover:text-yellow-300" />
                    )}
                  </motion.div>
                </button>

                <Link
                  to="/student-app"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                  title="Already a Student? Open Classplus App portal"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Already Enrolled?</span>
                </Link>

                <Link
                  to="/contact"
                  onClick={handleEnquireScroll}
                  className="relative group overflow-hidden px-5 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
                >
                  <span>Enquire Now</span>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Day / Night Toggle for Mobile */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4 text-slate-700" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-400" />
                )}
              </button>

              <Link
                to="/student-app"
                className="p-2 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 focus:outline-none"
                title="Student App Portal"
              >
                <UserCheck className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none border border-slate-200 dark:border-slate-800"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-6 shadow-2xl flex flex-col space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive(link.path)
                      ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              ))}
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

            {/* Day / Night Mobile Switch Banner */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                {theme === "light" ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-400" />
                )}
                <span>Active Mode: {theme === "light" ? "Day Mode (Light)" : "Night Mode (Dark)"}</span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-mono font-bold">Switch</span>
            </button>

            <div className="flex flex-col space-y-3 pt-2">
              <Link
                to="/student-app"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
              >
                <UserCheck className="h-4 w-4" />
                <span>Already a Student? Open Portal</span>
              </Link>

              <Link
                to="/contact"
                onClick={(e) => {
                  setIsOpen(false);
                  handleEnquireScroll(e);
                }}
                className="flex items-center justify-center w-full py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-500/10"
              >
                <span>Book Free Demo Lecture</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

