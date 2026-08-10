import { ShieldAlert, FileText, Lock, Globe, Eye } from "lucide-react";
import SEO from "../components/SEO";
import { CENTRAL_CONFIG } from "../config";

export default function Privacy() {
  return (
    <div className="bg-slate-50 text-slate-850 min-h-screen pt-20 text-left">
      <SEO title="Privacy Policy" description="Review our data privacy commitment, outlining secure Resend email forms processing and privacy-friendly website visitor analytics." />

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-100 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-bold">
            Legal Compliance
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Last Updated: July 18, 2026.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-600 text-sm leading-relaxed">
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <Lock className="h-5 w-5 text-blue-600" />
            <h2 className="font-sans font-bold text-lg">1. Commitment to Data Privacy</h2>
          </div>
          <p>
            At {CENTRAL_CONFIG.instituteName} Pune, we treat student and parent data privacy with high sensitivity. We do not sell, distribute, or rent submitted personal variables (including name, telephone coordinates, and email addresses) to any third-party marketing companies.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="font-sans font-bold text-lg">2. Secure Form Submission & Email Delivery</h2>
          </div>
          <p>
            When a visitor submits our website's demo enquiry form, the details are compiled and transmitted securely to our admissions database through the <strong>Resend API</strong> using an encrypted server-to-server connection. No sensitive personal information is stored inside the browser's logs or passed within GET query URLs.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <Eye className="h-5 w-5 text-blue-600" />
            <h2 className="font-sans font-bold text-lg">3. Privacy-Friendly Website Analytics</h2>
          </div>
          <p>
            To monitor website traffic volumes and optimize student experiences, we utilize <strong>Vercel Web Analytics</strong>. This tracking mechanism is privacy-friendly, does not collect personal identifiers, does not use cookies to track students across third-party websites, and is fully compliant with modern global privacy directives.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-900">
            <Globe className="h-5 w-5 text-blue-600" />
            <h2 className="font-sans font-bold text-lg">4. Marketing & Form Consent</h2>
          </div>
          <p>
            By ticking our demo reservation consent checkbox, you grant permission to {CENTRAL_CONFIG.instituteName} to contact you regarding batch timings, trial lectures, fee sheets, and educational updates. You can opt out or request complete deletion of your submitted variables from our local databases at any time by emailing us at: <a href={`mailto:${CENTRAL_CONFIG.emailAddress}`} className="text-blue-600 underline font-semibold">{CENTRAL_CONFIG.emailAddress}</a>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-100 text-xs text-slate-550 leading-relaxed flex items-start space-x-2.5 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <span>This privacy directive applies solely to the public-facing marketing website of the institute. Once students are admitted and login to our official student application, their profile and activities are protected in accordance with Classplus's secure student platform guidelines.</span>
        </div>

      </section>

    </div>
  );
}
