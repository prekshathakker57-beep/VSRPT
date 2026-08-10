import { useState } from "react";
import { Download, Copy, Check, PhoneCall, Smartphone, Sparkles, ExternalLink, Atom } from "lucide-react";
import { CENTRAL_CONFIG } from "../config";

export default function PostAdmissionAppInvitation() {
  const [copied, setCopied] = useState(false);

  const handleCopyOrgCode = () => {
    navigator.clipboard.writeText(CENTRAL_CONFIG.classplus.orgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl transition-colors duration-300">
      {/* Absolute ambient lights */}
      <div className="absolute -top-24 -right-24 h-48 w-48 bg-blue-600/5 dark:bg-blue-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-purple-600/5 dark:bg-purple-600/20 blur-3xl rounded-full" />

      <div className="relative flex flex-col lg:flex-row gap-8 items-center">
        {/* Left Section: Welcome Message & Steps */}
        <div className="flex-1 space-y-5 text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Registration Completed Successfully!</span>
          </div>

          <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-slate-900 dark:text-white leading-tight">
            Welcome to <span className="text-blue-600 dark:text-blue-400 font-extrabold">{CENTRAL_CONFIG.instituteName}</span>! <br />
            Your admission has been confirmed.
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Your profile has been registered in our database. Download our official student app below to access your daily live classes, homework archives, weekly test results, and reference materials.
          </p>

          {/* Org Code Copy Widget */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
            <div className="flex-1">
              <span className="block text-slate-400 dark:text-slate-500 text-xs font-mono uppercase tracking-wider">Classplus Organisation Code</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold text-lg tracking-wider">{CENTRAL_CONFIG.classplus.orgCode}</span>
            </div>
            <button
              onClick={handleCopyOrgCode}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-all focus:outline-none cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Org Code</span>
                </>
              )}
            </button>
          </div>

          {/* Core App Store Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={CENTRAL_CONFIG.classplus.androidLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-blue-300 dark:hover:border-blue-700 transition-all text-xs font-bold shrink-0 cursor-pointer"
            >
              <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Download for Android</span>
            </a>

            {CENTRAL_CONFIG.classplus.iphoneLink && (
              <a
                href={CENTRAL_CONFIG.classplus.iphoneLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-blue-300 dark:hover:border-blue-700 transition-all text-xs font-bold shrink-0 cursor-pointer"
              >
                <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Download for iPhone</span>
              </a>
            )}

            <a
              href={CENTRAL_CONFIG.classplus.webLoginLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all text-xs font-bold shrink-0 cursor-pointer shadow-lg shadow-blue-500/10"
            >
              <span>Open Student Web Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Right Section: Interactive Vector QR Code Mockup */}
        <div className="w-full lg:w-64 shrink-0 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="relative bg-white p-3 rounded-xl shadow-md">
            {/* Vector SVG Representation of a QR Code */}
            <svg
              className="w-36 h-36 text-slate-950"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-label="App Download QR Code"
            >
              {/* QR Code Outer Frame Squares */}
              <rect x="0" y="0" width="30" height="30" />
              <rect x="4" y="4" width="22" height="22" fill="white" />
              <rect x="8" y="8" width="14" height="14" />

              <rect x="70" y="0" width="30" height="30" />
              <rect x="74" y="4" width="22" height="22" fill="white" />
              <rect x="78" y="8" width="14" height="14" />

              <rect x="0" y="70" width="30" height="30" />
              <rect x="4" y="74" width="22" height="22" fill="white" />
              <rect x="8" y="78" width="14" height="14" />

              {/* Smaller alignment squares */}
              <rect x="75" y="75" width="10" height="10" />
              <rect x="77" y="77" width="6" height="6" fill="white" />
              <rect x="79" y="79" width="2" height="2" />

              {/* Mock QR Dot Matrix */}
              <rect x="35" y="5" width="5" height="15" />
              <rect x="45" y="10" width="10" height="5" />
              <rect x="60" y="0" width="5" height="10" />
              <rect x="35" y="25" width="15" height="5" />
              <rect x="55" y="20" width="10" height="10" />
              <rect x="5" y="35" width="10" height="5" />
              <rect x="20" y="40" width="15" height="10" />
              <rect x="0" y="55" width="5" height="10" />
              <rect x="15" y="60" width="10" height="5" />
              
              <rect x="40" y="40" width="20" height="20" />
              <rect x="45" y="45" width="10" height="10" fill="white" />
              
              <rect x="70" y="35" width="15" height="5" />
              <rect x="90" y="40" width="10" height="15" />
              <rect x="65" y="50" width="10" height="10" />
              <rect x="80" y="60" width="15" height="5" />
              
              <rect x="35" y="70" width="5" height="20" />
              <rect x="45" y="80" width="10" height="15" />
              <rect x="60" y="75" width="5" height="10" />
              <rect x="55" y="90" width="15" height="5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
                <Atom className="h-5 w-5 text-blue-600 animate-pulse" />
              </div>
            </div>
          </div>
          <span className="block mt-4 text-xs font-semibold text-slate-800 dark:text-slate-200">Scan to Download App</span>
          <span className="block mt-1 text-[10px] text-slate-400 font-mono">Compatible with Android & iOS</span>

          <div className="h-px bg-slate-200 dark:bg-slate-800 w-full my-4" />

          <a
            href={`tel:${CENTRAL_CONFIG.classplus.supportPhoneNumber}`}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <PhoneCall className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>App Support: {CENTRAL_CONFIG.classplus.supportPhoneNumber}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

