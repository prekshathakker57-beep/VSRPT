import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, 
  XCircle, Loader2, Smartphone, Sparkles, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/SEO";
import { CENTRAL_CONFIG, COURSES_DATA } from "../config";
import { trackAnalyticsEvent } from "../utils/analytics";
import GoogleFormsManager from "../components/GoogleFormsManager";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Mode state for form selection (App Interactive Form vs Google Forms Mode)
  const [activeFormMode, setActiveFormMode] = useState<"app" | "google_form">("app");
  const [googleFormUrl, setGoogleFormUrl] = useState<string>("");

  // URL query parameter extraction
  const intentParam = searchParams.get("intent");
  const sourceParam = searchParams.get("source");
  const gameParam = searchParams.get("game");
  const resultParam = searchParams.get("result");

  // Form State variables
  const [enquiryType, setEnquiryType] = useState<string>("Free Demo Lecture");
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [currentClass, setCurrentClass] = useState("11");
  const [courseInterested, setCourseInterested] = useState("NEET Physics Elite");
  const [learningMode, setLearningMode] = useState("Offline");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  
  // Anti-spam honeypot field (must remain empty)
  const [website, setWebsite] = useState("");

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [serverMessage, setServerMessage] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isFromPlayground, setIsFromPlayground] = useState(false);

  // Read URL parameters on mount / searchParams change
  useEffect(() => {
    if (intentParam === "demo") {
      setEnquiryType("Free Demo Lecture");
    } else if (intentParam === "admission") {
      setEnquiryType("Admission Enquiry");
    }

    if (sourceParam === "physics-playground") {
      setIsFromPlayground(true);
    }

    const courseQuery = searchParams.get("course");
    if (courseQuery) {
      const matched = COURSES_DATA.find(c => c.id === courseQuery);
      if (matched) {
        setCourseInterested(matched.title);
      }
    }
  }, [searchParams, intentParam, sourceParam]);

  // Client-side quick checks
  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!studentName.trim()) errors.push("Student name is required.");
    if (!parentName.trim()) errors.push("Parent name is required.");
    if (!phoneNumber.trim()) errors.push("Phone number is required.");
    if (!emailAddress.trim()) errors.push("Email address is required.");
    if (!consent) errors.push("You must consent to receive course updates.");

    // Simple email check
    if (emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      errors.push("Please enter a valid email address.");
    }
    // Simple phone check
    const digits = phoneNumber.replace(/\D/g, "");
    if (phoneNumber && digits.length < 10) {
      errors.push("Phone number must contain at least 10 digits.");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const getDeviceCategory = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "Mobile";
    }
    return "Desktop";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setSubmitSuccess(null);

    // Run client validations
    if (!validateForm()) return;

    setIsSubmitting(true);

    const now = new Date();
    const enquiryDate = now.toISOString().split("T")[0];
    const enquiryTime = now.toTimeString().split(" ")[0];

    const payload = {
      enquiryType,
      studentName,
      parentName,
      phoneNumber,
      emailAddress,
      currentClass,
      courseInterested,
      learningMode,
      message,
      consent,
      whatsappConsent,
      // Anti-spam honeypot
      website,
      // Metadata
      enquirySource: sourceParam || "Contact Page",
      sourcePage: location.pathname,
      gameName: gameParam || "",
      gameResult: resultParam || "",
      enquiryDate,
      enquiryTime,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      deviceCategory: typeof navigator !== "undefined" ? getDeviceCategory() : "Desktop"
    };

    try {
      // POST payload to server-side endpoint
      const response = await fetch("/api/send-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        
        if (sourceParam === "physics-playground") {
          setServerMessage("Great job exploring physics! Your enquiry has been received. Our team will contact you regarding your selected course or free demo lecture.");
        } else {
          setServerMessage(data.message || "Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.");
        }

        trackAnalyticsEvent("enquiry_submitted", {
          enquiry_type: enquiryType,
          source: sourceParam || "contact_page",
          game: gameParam || "none",
          result: resultParam || "none"
        });

        if (sourceParam === "physics-playground") {
          trackAnalyticsEvent("enquiry_submitted_from_playground", {
            game: gameParam,
            result: resultParam
          });
        }

        // Clear fields on success
        setStudentName("");
        setParentName("");
        setPhoneNumber("");
        setEmailAddress("");
        setMessage("");
        setConsent(false);
        setWhatsappConsent(false);
      } else {
        setSubmitSuccess(false);
        setServerMessage(data.error || "We could not submit your enquiry at the moment. Please call or WhatsApp us directly.");
        if (data.errors) setFormErrors(data.errors);
      }
    } catch (err) {
      console.error("Fetch form submit error:", err);
      setSubmitSuccess(false);
      setServerMessage("We could not submit your enquiry at the moment. Please call or WhatsApp us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessageUrl = `https://wa.me/${CENTRAL_CONFIG.whatsAppNumberFormatted}?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20the%20physics%20courses%20offered%20by%20${encodeURIComponent(CENTRAL_CONFIG.instituteName)}`;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pt-20">
      <SEO 
        title="Contact & Location" 
        description="Book your free physics demo lecture or submit an enquiry. Reach out directly via Phone, Email or WhatsApp, and visit our classroom in Kothrud, Pune."
      />

      {/* Hero Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-100 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-bold">
            Admissions Open
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 leading-tight">
            Let's Make Physics Easier.
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Attend a free conceptual session before making your final decision. Complete our short form or reach out directly via messaging tools.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="enquiry-form-section">
          
          {/* Left Column: Form Details & Info card */}
          <div className="lg:col-span-4 space-y-8 text-left">
            <div className="p-6 rounded-2xl border border-blue-100 bg-white shadow-md space-y-6">
              
              <div className="space-y-1">
                <h3 className="font-sans font-extrabold text-lg text-slate-900">V.S.R.P.T Physics Institute</h3>
                <span className="block text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Academic Office</span>
              </div>

              <div className="h-px bg-slate-100" />

              <ul className="space-y-4 text-xs">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-slate-600 leading-relaxed">
                    <strong>Address:</strong><br />
                    {CENTRAL_CONFIG.fullAddress},<br />
                    {CENTRAL_CONFIG.cityAndPinCode}
                  </span>
                </li>

                <li className="flex items-center space-x-3">
                  <Phone className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                  <span className="text-slate-600">
                    <strong>Call:</strong> <br />
                    <a href={`tel:${CENTRAL_CONFIG.phoneNumberFormatted}`} className="text-slate-900 hover:text-blue-600 font-semibold transition-colors">
                      {CENTRAL_CONFIG.phoneNumber}
                    </a>
                  </span>
                </li>

                <li className="flex items-center space-x-3">
                  <Mail className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                  <span className="text-slate-600">
                    <strong>Email:</strong> <br />
                    <a href={`mailto:${CENTRAL_CONFIG.emailAddress}`} className="text-slate-900 hover:text-blue-600 font-semibold transition-colors break-all">
                      {CENTRAL_CONFIG.emailAddress}
                    </a>
                  </span>
                </li>

                <li className="flex items-start space-x-3">
                  <Clock className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-slate-600 leading-relaxed">
                    <strong>Office Hours:</strong> <br />
                    {CENTRAL_CONFIG.workingHours}
                  </span>
                </li>
              </ul>

              <div className="h-px bg-slate-100" />

              {/* Direct WhatsApp Call to Action */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Instant Connects</span>
                <a
                  href={whatsappMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-md cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 animate-pulse" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Form & Google Forms */}
          <div className="lg:col-span-8 space-y-6">

            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveFormMode("app")}
                className={`flex-1 py-2 px-3 rounded-xl font-extrabold transition-all flex items-center justify-center space-x-2 ${
                  activeFormMode === "app"
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                <span>Interactive App Form</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormMode("google_form")}
                className={`flex-1 py-2 px-3 rounded-xl font-extrabold transition-all flex items-center justify-center space-x-2 ${
                  activeFormMode === "google_form"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Google Forms Mode</span>
              </button>
            </div>

            {/* Google Forms Section when selected */}
            {activeFormMode === "google_form" && (
              <div className="space-y-6">
                <GoogleFormsManager
                  activeFormUrl={googleFormUrl}
                  setActiveFormUrl={setGoogleFormUrl}
                  onFormCreated={(url) => setGoogleFormUrl(url)}
                />

                {/* Embedded Google Form View */}
                {googleFormUrl ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl overflow-hidden text-left space-y-3">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Live Embedded Google Form</span>
                      </span>
                      <a
                        href={googleFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Open in new tab ↗
                      </a>
                    </div>
                    <div className="w-full aspect-[4/5] min-h-[600px] rounded-xl overflow-hidden bg-slate-50">
                      <iframe
                        src={googleFormUrl}
                        className="w-full h-full border-0"
                        title="V.S.R.P.T Google Form"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 text-center space-y-3 text-xs">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      No Google Form Selected
                    </h4>
                    <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Click <strong>"Generate Form in Google Drive"</strong> above to auto-create an official admission form in your Drive, or paste an existing Google Form link to embed it live here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Default Interactive Form Container */}
            {activeFormMode === "app" && (
              <div className="rounded-2xl border border-blue-100 bg-white p-6 md:p-8 shadow-2xl text-left space-y-6">
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-sans font-extrabold text-xl text-slate-900">
                    {intentParam === "demo" ? "Book Your Free Physics Demo Lecture" : intentParam === "admission" ? "Apply For Admission" : "Submit An Enquiry"}
                  </h3>

                  {isFromPlayground && (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-mono uppercase bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">
                      <Sparkles className="h-3 w-3" />
                      <span>Playground Referral</span>
                    </span>
                  )}
                </div>

                <p className="text-slate-500 text-xs">Fill out your details below and our academic counseling team will reach out directly.</p>
              </div>

              {/* Server Responses / Status feedback */}
              <AnimatePresence>
                {submitSuccess === true && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-3"
                  >
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="block font-sans text-base font-extrabold text-emerald-950">Success!</strong>
                        <p className="leading-relaxed text-emerald-800">{serverMessage}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-emerald-800 font-medium">Already enrolled in V.S.R.P.T?</span>
                      <Link
                        to="/student-app"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-sm transition-all"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Open Student App</span>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {submitSuccess === false && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-3"
                  >
                    <div className="flex items-start space-x-3">
                      <XCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <strong className="block font-sans text-base font-extrabold text-rose-950">Submission Issue</strong>
                        <p className="leading-relaxed text-rose-800">{serverMessage}</p>
                        
                        {/* Sub-errors mapped */}
                        {formErrors.length > 0 && (
                          <ul className="mt-2 list-disc list-inside text-rose-700 space-y-0.5">
                            {formErrors.map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <a href={`tel:${CENTRAL_CONFIG.phoneNumberFormatted}`} className="px-3 py-2 rounded-lg bg-rose-600 text-white font-bold text-xs uppercase shadow-sm">
                            Call Office Directly
                          </a>
                          <a href={whatsappMessageUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>WhatsApp Support</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Honeypot field (hidden from view for normal users, but spam bots will fill it) */}
                <div className="hidden">
                  <label htmlFor="website">Do not fill this field</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Enquiry Type Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-500 uppercase">Enquiry Type</label>
                  <select
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none cursor-pointer disabled:opacity-55"
                  >
                    <option value="Free Demo Lecture">Free Demo Lecture</option>
                    <option value="Admission Enquiry">Admission Enquiry</option>
                    <option value="Course Information">Course Information</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-500 uppercase">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aditya Kulkarni"
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all disabled:opacity-55"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-500 uppercase">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Dr. Arvind Kulkarni"
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all disabled:opacity-55"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-500 uppercase">Primary Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all disabled:opacity-55"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-500 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="e.g. aditya@gmail.com"
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all disabled:opacity-55"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-500 uppercase">Current Class</label>
                    <select
                      value={currentClass}
                      onChange={(e) => setCurrentClass(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none cursor-pointer disabled:opacity-55"
                    >
                      <option value="11">Class 11 (Transitioning)</option>
                      <option value="12">Class 12 Boards / HSC</option>
                      <option value="dropper">Dropper / Repeater Batch</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-500 uppercase">Course Target</label>
                    <select
                      value={courseInterested}
                      onChange={(e) => setCourseInterested(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none cursor-pointer disabled:opacity-55"
                    >
                      {COURSES_DATA.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-500 uppercase">Learning Mode</label>
                    <div className="flex bg-slate-100 rounded-xl border border-slate-200 p-1">
                      {["Offline", "Online"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setLearningMode(mode)}
                          disabled={isSubmitting}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            learningMode === mode
                              ? "bg-blue-600 text-white shadow-sm font-extrabold"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {mode === "Offline" ? "Offline (Kothrud)" : "Online Live"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-500 uppercase">Custom Message (Optional)</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your previous marks or specific physics topics you struggle with..."
                    disabled={isSubmitting}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all disabled:opacity-55 resize-none"
                  />
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-3 pt-2 text-left">
                  {/* General mandatory consent */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={isSubmitting}
                      className="h-4.5 w-4.5 rounded border-slate-300 bg-slate-50 text-blue-600 focus:ring-blue-500/30 cursor-pointer disabled:opacity-55 mt-0.5"
                    />
                    <label htmlFor="consent" className="text-slate-600 text-[11px] leading-relaxed cursor-pointer select-none">
                      I consent to receive phone calls, SMS updates, and emails regarding demo schedules and course packages from {CENTRAL_CONFIG.instituteName} Pune. *
                    </label>
                  </div>

                  {/* WhatsApp optional consent */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="whatsappConsent"
                      checked={whatsappConsent}
                      onChange={(e) => setWhatsappConsent(e.target.checked)}
                      disabled={isSubmitting}
                      className="h-4.5 w-4.5 rounded border-slate-300 bg-slate-50 text-emerald-600 focus:ring-emerald-500/30 cursor-pointer disabled:opacity-55 mt-0.5"
                    />
                    <label htmlFor="whatsappConsent" className="text-slate-600 text-[11px] leading-relaxed cursor-pointer select-none">
                      I agree to receive updates about my enquiry through WhatsApp. (Optional)
                    </label>
                  </div>
                </div>

                {/* Submit trigger button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10 active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 text-white animate-spin" />
                        <span>PROCESSING ENQUIRY...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-white" />
                        <span>SUBMIT ENQUIRY FOR DEMO</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
            )}
          </div>

        </div>
      </section>

      {/* Embedded Location Map Section */}
      <section className="py-16 bg-blue-50/20 border-t border-blue-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-left space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Physical Office</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Visit our coaching classroom</h2>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden aspect-[21/9] min-h-[300px] shadow-2xl relative">
            <iframe
              src={CENTRAL_CONFIG.googleMapsEmbedUrl}
              className="absolute inset-0 w-full h-full border-0 grayscale opacity-85 focus:outline-none"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
