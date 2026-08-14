import { Link } from "react-router-dom";
import { Atom, Phone, Mail, MapPin, Facebook, Youtube, Instagram, Twitter, ExternalLink, ShieldCheck } from "lucide-react";
import { CENTRAL_CONFIG, COURSES_DATA } from "../config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-blue-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Section 1: Logo & Vision */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="relative">
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
                  className="h-10 w-10 rounded-full object-cover border-2 border-blue-500/40 shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 opacity-20 blur-md rounded-full -z-10" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-lg leading-tight tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                  V.S.R.P.T
                </span>
                <span className="font-mono text-[9px] tracking-widest text-slate-500 dark:text-slate-400 uppercase leading-none font-bold">
                  Physics Institute
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              “Physics is not something to fear. It is something to explore.” 
              Providing concept-based, numerical-focused coaching for engineering and medical entrance examinations in Mumbai.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href={CENTRAL_CONFIG.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:border-red-500/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </a>
              <a href={CENTRAL_CONFIG.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-pink-500 hover:border-pink-500/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={CENTRAL_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={CENTRAL_CONFIG.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-slate-100 tracking-wider uppercase border-l-2 border-blue-600 dark:border-blue-500 pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/mentor" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Meet Our Mentor</Link>
              </li>
              <li>
                <Link to="/visual-lab" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Physics Visual Lab</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Explore Physics Game</Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Results & Toppers</Link>
              </li>
              <li>
                <Link to="/student-app" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Classplus Student App</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact & Location</Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Programs */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-slate-100 tracking-wider uppercase border-l-2 border-blue-600 dark:border-blue-500 pl-3">
              Physics Programs
            </h3>
            <ul className="space-y-2 text-sm">
              {COURSES_DATA.slice(0, 5).map((course) => (
                <li key={course.id}>
                  <Link to={`/contact?course=${course.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>{course.title}</span>
                    <span className="text-[10px] bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">Enquire</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Contact details */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-slate-100 tracking-wider uppercase border-l-2 border-blue-600 dark:border-blue-500 pl-3">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>
                  {CENTRAL_CONFIG.fullAddress}, <br />
                  {CENTRAL_CONFIG.cityAndPinCode}
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <a href={`tel:${CENTRAL_CONFIG.phoneNumberFormatted}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {CENTRAL_CONFIG.phoneNumber}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <a href={`mailto:${CENTRAL_CONFIG.emailAddress}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">
                  {CENTRAL_CONFIG.emailAddress}
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href={CENTRAL_CONFIG.googleMapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 dark:bg-slate-800 my-10" />

        {/* Bottom footer bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} {CENTRAL_CONFIG.instituteName}. All rights reserved.</p>
          
          <div className="flex items-center space-x-4">
            <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Privacy Policy</span>
            </Link>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

