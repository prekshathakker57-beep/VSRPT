import { FileText, Globe, GraduationCap, AlertTriangle } from "lucide-react";
import SEO from "../components/SEO";
import { CENTRAL_CONFIG } from "../config";

export default function Terms() {
  return (
    <div className="bg-slate-50 text-slate-850 min-h-screen pt-20 text-left">
      <SEO title="Terms & Conditions" description="Review our enrollment guidelines, trial class provisions, result disclaimers, and Classplus system usage regulations." />

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-100 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-bold">
            Academic Guidelines
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Last Updated: July 18, 2026.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-600 text-sm leading-relaxed">
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <h2 className="font-sans font-bold text-lg">1. Free Demo & Admission Terms</h2>
          </div>
          <p>
            {CENTRAL_CONFIG.instituteName} offers a single, non-obligatory, <strong>Free Trial Lecture</strong> for students preparing for Class 11, Class 12, NEET, and JEE exams. Booking a trial lecture does not guarantee admission or reserve seat quotas in our batches. Batch enrollment is finalized only after verifying prerequisites, counseling the student, completing fee schedules, and signing standard registration receipts.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <h2 className="font-sans font-bold text-lg">2. Score & Result Representations</h2>
          </div>
          <p>
            All academic achievements, state topper marks, percentiles, and video testimonials displayed on our website reflect physical success stories from our past programs. Individual rankings depend on regular homework review, daily physical attendance, mock exam evaluations, and self-study hours. {CENTRAL_CONFIG.instituteName} does not guarantee particular examination results or entrance cut-off selections.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="font-sans font-bold text-lg">3. Classplus Student App Access</h2>
          </div>
          <p>
            Access to our digital educational resources, recorded chapter archives, and mock evaluations is provided exclusively to actively enrolled students through our official <strong>Classplus-powered Mobile Application</strong>. Enrolled students must keep their account login credentials confidential and prevent unauthorized screen-sharing or media distribution, which is strictly prohibited under intellectual property laws.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <Globe className="h-5 w-5 text-blue-600" />
            <h2 className="font-sans font-bold text-lg">4. Intellectual Property</h2>
          </div>
          <p>
            The custom visual designs, interactive projectile simulators, educational animation loops, custom CSS configurations, and course summaries displayed on this domain are the sole property of {CENTRAL_CONFIG.instituteName}. No content may be scraped, copied, or reproduced without explicit written permission from Prof. Rohit Deshmukh.
          </p>
        </div>

      </section>

    </div>
  );
}
