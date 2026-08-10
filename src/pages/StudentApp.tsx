import { useState } from "react";
import { 
  Smartphone, Monitor, HelpCircle, PhoneCall, MessageCircle, Download, 
  CheckCircle2, Sparkles, Key, LogIn, ChevronRight, BookOpen, Clock, 
  Play, Laptop, AlertCircle, Copy, Check 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";
import { CENTRAL_CONFIG } from "../config";
import PostAdmissionAppInvitation from "../components/PostAdmissionAppInvitation";

export default function StudentApp() {
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyOrgCode = () => {
    navigator.clipboard.writeText(CENTRAL_CONFIG.classplus.orgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const appFeatures = [
    { title: "Daily Live Interactive Lectures", desc: "Watch live physics derivations on our high-definition digital boards with active voice-asking features." },
    { title: "Recorded Archives for Revision", desc: "Missed a session or prepping for a major CET test? Review fully categorized lesson archives 24/7." },
    { title: "Online Tests & Analytics", desc: "Simulate exact computer-based JEE/NEET patterns. Receive precise, mistake-highlighting scorecards." },
    { title: "Premium PDFs & Cheatsheets", desc: "Download vector formula logs, DPPs (Daily Practice Problems), and step-by-step board derivation sheets." },
    { title: "Immediate Doubt Forums", desc: "Take a photo of any difficult numerical and upload it. Get video resolutions from doubt mentors instantly." }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pt-20 text-left">
      <SEO 
        title="Student Mobile App Onboarding" 
        description="Access daily live lectures, recorded formula archives, PDF files and JEE/NEET test schedules through our Classplus-powered student app."
      />

      {/* Hero Header */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-100 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-bold">
            Student Portal
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 leading-tight">
            Your Learning Continues on the Student App.
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Students enrolled with {CENTRAL_CONFIG.instituteName} can access live classes, course material, tests, announcements, and learning resources through our official student app.
          </p>

          {/* State Switcher Toggle */}
          <div className="pt-6 flex justify-center items-center gap-3">
            <span className="text-xs text-slate-400 font-mono font-bold">PREVIEW PORTAL STATE:</span>
            <div className="inline-flex bg-slate-100 border border-slate-200 p-1 rounded-xl">
              <button
                onClick={() => setIsAdmitted(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isAdmitted ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Prospective App Promo
              </button>
              <button
                onClick={() => setIsAdmitted(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  isAdmitted ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="h-3 w-3 animate-pulse" />
                <span>Admission Confirmed Onboarding</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatePresence mode="wait">
          {isAdmitted ? (
            // STATE 2: Welcoming Post-Admission Onboarding card
            <motion.div
              key="admitted-invitation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <PostAdmissionAppInvitation />
              
              <div className="mt-8 p-4 rounded-xl bg-white border border-blue-100 text-center max-w-2xl mx-auto flex items-center space-x-2 text-xs text-slate-500 shadow-sm">
                <AlertCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                <span>The invitation above is presented automatically to students once their admission has been verified by our Classplus administrator.</span>
              </div>
            </motion.div>
          ) : (
            // STATE 1: General marketing and download promotion
            <motion.div
              key="general-promo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              
              {/* Left Side: Features and Steps */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Promo list */}
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Features packed inside our Mobile App:</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {appFeatures.map((feat, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-blue-100 bg-white shadow-sm text-left space-y-1.5">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        <h4 className="font-sans font-bold text-sm text-slate-900">{feat.title}</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Steps */}
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Onboarding Registration Steps:</h2>
                  <ol className="space-y-4 text-xs text-slate-600">
                    <li className="flex items-start space-x-3">
                      <span className="h-6 w-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-650 shrink-0 mt-0.5">1</span>
                      <p className="leading-relaxed"><strong>Download the app:</strong> Click the store badges or scan the QR code to install our customized student application from the Play Store or App Store.</p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="h-6 w-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-650 shrink-0 mt-0.5">2</span>
                      <p className="leading-relaxed"><strong>Register/Sign-In:</strong> Launch the app and input the active 10-digit mobile number registered during your institute admission.</p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="h-6 w-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-650 shrink-0 mt-0.5">3</span>
                      <p className="leading-relaxed"><strong>Enter Org Code:</strong> If prompted for a Classplus Organization Code, type in our verified keyword: <strong className="text-slate-950 font-mono">{CENTRAL_CONFIG.classplus.orgCode}</strong>.</p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="h-6 w-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-650 shrink-0 mt-0.5">4</span>
                      <p className="leading-relaxed"><strong>Verify OTP:</strong> Complete the secure mobile verification by entering the 4-digit code sent via SMS, and immediately access your custom profile dashboard.</p>
                    </li>
                  </ol>
                </div>

              </div>

              {/* Right Side: Smartphone Mockup & Badges */}
              <div className="lg:col-span-5 flex flex-col items-center">
                
                {/* Smartphone Mockup */}
                <div className="relative w-full max-w-[280px] aspect-[9/19] rounded-[36px] border-[12px] border-slate-900 bg-white shadow-2xl overflow-hidden ring-4 ring-slate-200">
                  
                  {/* Speaker and Camera notch */}
                  <div className="absolute top-0 inset-x-0 h-5 bg-slate-900 z-20 rounded-b-xl flex items-center justify-center">
                    <div className="w-12 h-1 bg-black rounded-full" />
                    <div className="w-2.5 h-2.5 bg-black rounded-full ml-2" />
                  </div>

                  {/* App UI Screen Inside Mockup */}
                  <div className="absolute inset-0 pt-6 px-4 bg-white flex flex-col justify-between text-left pb-4 z-10">
                    
                    {/* Mock header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mt-1">
                      <div className="flex items-center space-x-1.5">
                        <Smartphone className="h-4 w-4 text-blue-600 animate-pulse" />
                        <span className="font-mono text-[9px] font-bold text-slate-800 uppercase tracking-wider">{CENTRAL_CONFIG.classplus.orgCode}</span>
                      </div>
                      <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">LIVE BATCH</span>
                    </div>

                    {/* Mock body scroll */}
                    <div className="flex-1 py-3 space-y-3.5 overflow-hidden">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="block text-[8px] text-slate-450 font-mono font-bold uppercase">Active Subject</span>
                        <span className="block text-xs text-slate-900 font-bold font-sans">Chapter 4: Rotational Dynamics</span>
                        <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 w-3/4" />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <span className="block text-[8px] text-emerald-600 font-mono font-bold uppercase">• NEXT ONLINE TEST</span>
                        <span className="block text-[10px] text-slate-800 font-semibold font-sans">Electrostatics Mock – NEET Pattern</span>
                        <span className="block text-[9px] text-slate-450 font-mono">Sunday, 10:00 AM | 45 MCQs</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-center">
                        <span className="block text-[10px] text-blue-600 font-bold font-sans">14 recorded lessons available</span>
                      </div>
                    </div>

                    {/* Mock footer navigation */}
                    <div className="border-t border-slate-100 pt-2 flex justify-around text-[8px] font-mono text-slate-500">
                      <span className="text-blue-600 font-extrabold">BATCHES</span>
                      <span>TESTS</span>
                      <span>FILES</span>
                      <span>DOUBTS</span>
                    </div>

                  </div>

                </div>

                {/* Quick Download badges & Org copy underneath mockup */}
                <div className="mt-8 space-y-4 w-full max-w-[280px]">
                  
                  {/* Org Code Copy Widget */}
                  <div className="flex items-center justify-between bg-white border border-blue-100 px-3.5 py-2.5 rounded-xl text-left shadow-sm">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-mono uppercase font-bold">ORG CODE:</span>
                      <strong className="text-slate-900 text-sm font-mono font-bold">{CENTRAL_CONFIG.classplus.orgCode}</strong>
                    </div>
                    <button
                      onClick={handleCopyOrgCode}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all border border-blue-100 cursor-pointer"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* App Links and Badges */}
                  <div className="space-y-2">
                    <a
                      href={CENTRAL_CONFIG.classplus.androidLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-md cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-emerald-600" />
                      <span>Android App Store</span>
                    </a>

                    {CENTRAL_CONFIG.classplus.iphoneLink && (
                      <a
                        href={CENTRAL_CONFIG.classplus.iphoneLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-md cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-blue-600" />
                        <span>iOS Apple Store</span>
                      </a>
                    )}

                    <a
                      href={CENTRAL_CONFIG.classplus.webLoginLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-1.5 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
                    >
                      <span>Open Student Web Login</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </section>

      {/* Support hotline contact footer */}
      <section className="py-16 bg-blue-50/20 border-t border-blue-100 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="font-sans font-bold text-lg text-slate-900">Need help getting onboarded?</h3>
          <p className="text-slate-600 text-xs leading-relaxed max-w-lg mx-auto">
            Our app administrators can troubleshoot registered mobile numbers or organizational codes. Get in touch with us directly via phone or WhatsApp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={`tel:${CENTRAL_CONFIG.classplus.supportPhoneNumber}`}
              className="px-5 py-3 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:text-slate-900 hover:border-blue-300 transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <PhoneCall className="h-4 w-4 text-blue-600" />
              <span>Call: {CENTRAL_CONFIG.classplus.supportPhoneNumber}</span>
            </a>

            <a
              href={`https://wa.me/${CENTRAL_CONFIG.classplus.supportPhoneNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:text-emerald-600 hover:border-emerald-300 transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              <span>WhatsApp App Support</span>
            </a>
          </div>

          <div className="pt-8 text-[11px] text-slate-500 font-mono">
            // Technical Integration Limitation: This website is a premium marketing & enquiry gateway. <br />
            // Accounts, admissions registration, fee structures, and attendance databases exist independently inside Classplus's secure ecosystem.
          </div>
        </div>
      </section>

    </div>
  );
}
