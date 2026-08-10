import React, { useState, useEffect } from "react";
import { 
  FileText, Plus, ExternalLink, RefreshCw, CheckCircle2, 
  List, Eye, ShieldAlert, Sparkles, Lock, LogOut
} from "lucide-react";
import { User } from "firebase/auth";
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  createAdmissionGoogleForm, 
  fetchFormDetails, 
  fetchFormResponses, 
  GoogleFormDetails, 
  GoogleFormResponse 
} from "../lib/googleForms";

interface GoogleFormsManagerProps {
  onFormCreated?: (formUrl: string) => void;
  activeFormUrl: string;
  setActiveFormUrl: (url: string) => void;
}

export default function GoogleFormsManager({
  onFormCreated,
  activeFormUrl,
  setActiveFormUrl
}: GoogleFormsManagerProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  // Form State
  const [customFormInput, setCustomFormInput] = useState<string>("");
  const [isCreatingForm, setIsCreatingForm] = useState<boolean>(false);
  const [createdForm, setCreatedForm] = useState<GoogleFormDetails | null>(null);
  const [responses, setResponses] = useState<GoogleFormResponse[]>([]);
  const [isLoadingResponses, setIsLoadingResponses] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Confirmation Modal for Google Drive Form Creation (Mandatory Workspace-Integration pattern)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, tok) => {
        setUser(u);
        setToken(tok);
        setIsAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setStatusMessage("");
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setStatusMessage("Signed in successfully with Google Workspace permissions!");
      } else {
        setStatusMessage("Google sign-in popup was closed. Click 'Sign in with Google' when ready.");
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setStatusMessage("Google sign-in popup was closed before completing.");
      } else {
        setStatusMessage(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setCreatedForm(null);
    setResponses([]);
    setStatusMessage("Signed out from Google session.");
  };

  const handleConfirmCreateForm = async () => {
    setShowConfirmModal(false);
    if (!token) {
      setStatusMessage("Please sign in with Google first.");
      return;
    }

    setIsCreatingForm(true);
    setStatusMessage("Creating V.S.R.P.T Google Form in your Drive...");

    try {
      const formDetails = await createAdmissionGoogleForm(
        token, 
        "V.S.R.P.T Admissions & Free Demo Enquiry Form"
      );
      setCreatedForm(formDetails);
      if (formDetails.responderUri) {
        setActiveFormUrl(formDetails.responderUri);
        if (onFormCreated) onFormCreated(formDetails.responderUri);
      }
      setStatusMessage("New Google Form created in your Google Drive!");
    } catch (err: any) {
      console.error("Create form failed:", err);
      setStatusMessage(err.message || "Could not create Google Form.");
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleFetchResponses = async () => {
    if (!token || !createdForm?.formId) {
      setStatusMessage("Sign in and create/select a form to fetch Google Form responses.");
      return;
    }

    setIsLoadingResponses(true);
    try {
      const resList = await fetchFormResponses(createdForm.formId, token);
      setResponses(resList);
      setStatusMessage(`Successfully fetched ${resList.length} response(s) from Google Forms!`);
    } catch (err: any) {
      console.error("Fetch responses failed:", err);
      setStatusMessage(err.message || "Could not fetch responses.");
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const extractFormIdFromUrl = (url: string) => {
    const match = url.match(/\/forms\/d\/e\/([a-zA-Z0-9_-]+)/) || url.match(/\/forms\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleApplyCustomUrl = () => {
    if (!customFormInput.trim()) return;
    setActiveFormUrl(customFormInput.trim());
    setStatusMessage("Active Google Form updated!");
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/50 to-white p-5 md:p-6 shadow-sm space-y-5 text-left text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-sans font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <span>Google Forms Integration</span>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase">
                Official API
              </span>
            </h4>
            <p className="text-slate-500 text-[11px]">
              Sync admission queries, embed live Google Forms, or manage responses in Google Drive.
            </p>
          </div>
        </div>

        {/* Auth status or sign-in button */}
        <div>
          {user ? (
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-slate-700 font-semibold truncate max-w-[130px]">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleSignOut}
                title="Sign out from Google"
                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="gsi-material-button text-xs transition-all shadow-sm hover:shadow"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: '8px',
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isSigningIn ? 'wait' : 'pointer'
              }}
            >
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span className="font-bold text-slate-700">
                {isSigningIn ? "Signing in..." : "Sign in with Google"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Option A: Generate Form in Google Drive */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h5 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Create Official Form in Drive</span>
            </h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Automatically builds a full V.S.R.P.T admission form with 8 pre-structured questions directly in your Google Drive.
            </p>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isCreatingForm}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>{isCreatingForm ? "Creating in Drive..." : "Generate Form in Google Drive"}</span>
          </button>
        </div>

        {/* Option B: Connect Custom Google Form URL */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h5 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-indigo-600" />
              <span>Link Existing Google Form</span>
            </h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Paste any existing Google Form share/embed link to display it directly on this page.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://docs.google.com/forms/d/e/..."
              value={customFormInput}
              onChange={(e) => setCustomFormInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleApplyCustomUrl}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0"
            >
              Apply
            </button>
          </div>
        </div>

      </div>

      {/* Status Alert feedback */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {/* Form Details & Responses Viewer */}
      {createdForm && (
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                Google Form Ready
              </span>
              <h5 className="font-bold text-sm text-slate-100">{createdForm.info.title}</h5>
            </div>
            
            <a
              href={createdForm.responderUri}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Open in Google Forms</span>
            </a>
          </div>

          <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
            <button
              onClick={handleFetchResponses}
              disabled={isLoadingResponses}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold flex items-center space-x-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingResponses ? 'animate-spin' : ''}`} />
              <span>Sync Live Responses ({responses.length})</span>
            </button>
          </div>

          {responses.length > 0 && (
            <div className="pt-2 text-[11px] text-slate-300 space-y-2">
              <span className="font-mono text-emerald-400">Total Submitted Responses: {responses.length}</span>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {responses.map((resp, idx) => (
                  <div key={resp.responseId || idx} className="p-2.5 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Submitted: {new Date(resp.lastSubmittedTime).toLocaleString()}
                    </span>
                    <div className="text-xs text-slate-200">
                      {resp.answers ? `${Object.keys(resp.answers).length} fields answered` : "Response logged"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Google Drive Resource Creation */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  Create Google Form in Your Drive?
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  This will use your connected Google Workspace account to create a new file titled 
                  <strong> "V.S.R.P.T Admissions & Free Demo Enquiry Form"</strong> with 8 structured questions in your Google Drive.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-1 font-mono">
              <div>• File Name: V.S.R.P.T Admissions & Free Demo Enquiry Form</div>
              <div>• Questions: 8 fields (Name, Phone, Email, Course, Class, etc.)</div>
              <div>• Permission: Google Drive File Creation</div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCreateForm}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow"
              >
                Confirm & Create Form
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
