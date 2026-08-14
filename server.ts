import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { Resend } from "resend";
import twilio from "twilio";

dotenv.config();

// Simple in-memory rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic security and parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API endpoint for enquiry submissions
  app.post("/api/send-enquiry", async (req, res) => {
    try {
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

      // Rate limit check
      if (isRateLimited(clientIp)) {
        return res.status(429).json({
          success: false,
          error: "Too many enquiry attempts from this IP address. Please wait a few minutes before trying again or call us directly."
        });
      }

      const {
        enquiryType = "Free Demo Lecture",
        studentName,
        studentFullName,
        parentName,
        parentGuardianName,
        phoneNumber,
        emailAddress,
        currentClass,
        courseInterested,
        courseTarget,
        learningMode,
        message,
        customMessage,
        consent,
        marketingConsent,
        whatsappConsent = false,
        // Honeypot field for anti-spam
        website,
        // Metadata fields
        enquirySource = "Contact Page",
        sourcePage = "/contact",
        gameName = "",
        gameResult = "",
        enquiryDate,
        enquiryTime,
        pageUrl,
        deviceCategory = "Desktop"
      } = req.body;

      const rawStudentName = studentFullName || studentName || "";
      const rawParentName = parentGuardianName || parentName || "";
      const rawCourse = courseTarget || courseInterested || "NEET Physics Elite";
      const rawMessage = customMessage || message || "";
      const rawConsent = marketingConsent !== undefined ? marketingConsent : consent;

      // 1. Basic Spam Protection - Honeypot Check
      if (website) {
        console.warn("Spam submission blocked via Honeypot check.");
        return res.status(200).json({
          success: true,
          message: "Enquiry submitted successfully (spam-trap)."
        });
      }

      // 2. Server-side validation
      const errors: string[] = [];
      if (!rawStudentName || rawStudentName.trim().length === 0) errors.push("Student name is required.");
      if (rawStudentName && rawStudentName.length > 100) errors.push("Student name cannot exceed 100 characters.");
      if (!rawParentName || rawParentName.trim().length === 0) errors.push("Parent name is required.");
      if (rawParentName && rawParentName.length > 100) errors.push("Parent name cannot exceed 100 characters.");
      if (!phoneNumber || phoneNumber.trim().length === 0) errors.push("Phone number is required.");
      if (!emailAddress || emailAddress.trim().length === 0) errors.push("Email address is required.");
      if (!rawConsent) errors.push("Consent is required to submit the form.");
      if (rawMessage && rawMessage.length > 1000) errors.push("Message cannot exceed 1000 characters.");

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailAddress && !emailRegex.test(emailAddress)) {
        errors.push("Invalid email address format.");
      }

      // Phone validation (at least 10 digits)
      const phoneDigits = phoneNumber ? phoneNumber.replace(/\D/g, "") : "";
      if (phoneNumber && phoneDigits.length < 10) {
        errors.push("Invalid phone number. Please enter a valid 10-digit number.");
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }

      // Sanitization & Reference Number
      const cleanStudentName = rawStudentName.trim();
      const cleanParentName = rawParentName.trim();
      const cleanPhone = phoneNumber.trim();
      const cleanEmail = emailAddress.trim();
      const cleanMessage = rawMessage ? rawMessage.trim() : "No custom message provided.";
      const courseInterestedVal = rawCourse;
      const enquiryRef = `VSRPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const formattedDateStr = enquiryDate || new Date().toISOString().split("T")[0];
      const formattedTimeStr = enquiryTime || new Date().toTimeString().split(" ")[0];
      const dateString = `${formattedDateStr} ${formattedTimeStr} IST`;
      const whatsappLink = `https://wa.me/${cleanPhone.replace(/\D/g, "")}`;

      // Check API Keys availability
      const resendApiKey = process.env.RESEND_API_KEY;
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioWhatsappFrom = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
      const instituteWhatsappTo = process.env.INSTITUTE_WHATSAPP_TO || "whatsapp:+919876543210";

      const isResendConfigured = resendApiKey && resendApiKey !== "MY_GEMINI_API_KEY" && resendApiKey.trim().length > 0;
      const isTwilioConfigured = twilioSid && twilioAuthToken && twilioSid.trim().length > 0;

      // Google Apps Script Web App Integration
      const appsScriptUrl = process.env.APPS_SCRIPT_URL || process.env.VITE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbwkrKX1zG7y_3xFPeE8xRM9PD1hledHIU1l9bEoVTxJyNpjyak6iAt4TDWM4Absku2N/exec";

      const appsScriptPayload = {
        enquiryType,
        studentFullName: cleanStudentName,
        parentGuardianName: cleanParentName,
        phoneNumber: cleanPhone,
        emailAddress: cleanEmail,
        currentClass,
        courseTarget: courseInterestedVal,
        learningMode,
        customMessage: cleanMessage,
        marketingConsent: rawConsent,
        whatsappConsent: whatsappConsent
      };

      let appsScriptSuccess = false;
      if (appsScriptUrl && appsScriptUrl.trim().length > 0) {
        try {
          console.log(`[Google Apps Script] Forwarding enquiry to: ${appsScriptUrl}`);
          const gasRes = await fetch(appsScriptUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(appsScriptPayload),
            redirect: "follow"
          });
          console.log(`[Google Apps Script] Response status: ${gasRes.status}`);
          if (gasRes.ok) {
            appsScriptSuccess = true;
            console.log("[Google Apps Script] Submission successfully recorded in Google Sheets.");
          } else if (gasRes.status === 401) {
            console.warn("[Google Apps Script] Received 401 Unauthorized. Ensure your Web App deployment settings in Apps Script are set to 'Who has access: Anyone'.");
          }
        } catch (gasErr) {
          console.error("[Google Apps Script] Network forwarding error:", gasErr);
        }
      }

      // DEMO MODE / SANDBOX FALLBACK
      if (!isResendConfigured && !isTwilioConfigured) {
        console.log("==================================================");
        console.log("ENQUIRY RECEIVED & PROCESSED");
        console.log(`Ref: ${enquiryRef}`);
        console.log(`Type: ${enquiryType}`);
        console.log(`Student: ${cleanStudentName} | Parent: ${cleanParentName}`);
        console.log(`Phone: ${cleanPhone} | Email: ${cleanEmail}`);
        console.log(`Course: ${courseInterestedVal} | Class: ${currentClass} | Mode: ${learningMode}`);
        console.log(`Message: ${cleanMessage}`);
        console.log(`Google Apps Script Status: ${appsScriptSuccess ? "Synced" : "Processed"}`);
        console.log("==================================================");

        return res.status(200).json({
          success: true,
          demoMode: !isResendConfigured && !isTwilioConfigured,
          appsScriptSynced: appsScriptSuccess,
          enquiryRef,
          deliveryStatus: {
            appsScriptRecorded: appsScriptSuccess,
            emailNotificationSent: false,
            whatsappNotificationSent: false,
            applicantConfirmationSent: false
          },
          message: "Thank you! Your enquiry has been submitted successfully. Our academic counselling team will contact you shortly."
        });
      }

      // PREPARE DISPATCH TASKS
      const dispatchTasks: Promise<any>[] = [];

      // Task 1: Institute Admin Email via Resend
      if (isResendConfigured) {
        const resend = new Resend(resendApiKey);
        const toEmail = process.env.ENQUIRY_TO_EMAIL || "prekshathakker57@gmail.com";
        const fromEmail = process.env.ENQUIRY_FROM_EMAIL || "contact@vsrpt.com";

        const adminEmailSubject = `New Website Enquiry – ${cleanStudentName} – ${courseInterestedVal}`;
        const adminEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background-color: #0b1528; padding: 24px; text-align: center; border-bottom: 4px solid #2563eb;">
              <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">V.S.R.P.T</h2>
              <p style="color: #93c5fd; margin: 6px 0 0 0; font-size: 13px;">New Enquiry Reference: <strong>${enquiryRef}</strong></p>
            </div>
            <div style="padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;">
              <div style="background-color: #f8fafc; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1e3a8a;">Enquiry Type: ${enquiryType}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Received on ${dateString}</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 40%; color: #475569;">Student Name:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${cleanStudentName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Parent / Guardian:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${cleanParentName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Phone Number:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                    <a href="tel:${cleanPhone}" style="color: #2563eb; font-weight: bold; text-decoration: none;">${cleanPhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">WhatsApp Chat:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                    <a href="${whatsappLink}" target="_blank" style="color: #059669; font-weight: bold; text-decoration: none;">Click to Chat on WhatsApp</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Email Address:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                    <a href="mailto:${cleanEmail}" style="color: #2563eb; text-decoration: none;">${cleanEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Current Class:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">Class ${currentClass}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Course Interested:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #1e3a8a;">${courseInterestedVal}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Learning Mode:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${learningMode}</td>
                </tr>
                ${gameName ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Playground Challenge:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #d97706;">${gameName} (${gameResult === "won" ? "Challenge Completed" : "Attempted"})</td>
                </tr>
                ` : ""}
              </table>

              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #94a3b8; margin: 20px 0;">
                <strong style="display: block; margin-bottom: 6px; color: #334155; font-size: 13px;">Student / Parent Message:</strong>
                <p style="margin: 0; white-space: pre-wrap; font-style: italic; color: #475569;">${cleanMessage}</p>
              </div>

              <div style="background-color: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 11px; color: #64748b; margin-top: 24px;">
                <strong>Submission Metadata:</strong> Source: ${enquirySource} | Device: ${deviceCategory} | Page: ${sourcePage} | WhatsApp Consent: ${whatsappConsent ? "Yes" : "No"}
              </div>
            </div>
          </div>
        `;

        dispatchTasks.push(
          resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: adminEmailSubject,
            html: adminEmailHtml,
          }).then((res) => ({ type: "admin_email", res }))
        );

        // Applicant Confirmation Email
        const applicantEmailSubject = `We Have Received Your Enquiry – V.S.R.P.T`;
        const applicantEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background-color: #0b1528; padding: 24px; text-align: center; border-bottom: 4px solid #2563eb;">
              <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">V.S.R.P.T</h2>
              <p style="color: #93c5fd; margin: 6px 0 0 0; font-size: 13px;">“Physics is not something to fear. It is something to explore.”</p>
            </div>
            <div style="padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;">
              <h3 style="margin-top: 0; color: #1e3a8a;">Hello ${cleanStudentName},</h3>
              <p>Thank you for reaching out to <strong>V.S.R.P.T</strong>. We have received your enquiry regarding our <strong>${courseInterestedVal}</strong> program.</p>
              
              ${enquirySource === "physics-playground" ? `
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 14px; border-radius: 8px; margin: 16px 0; color: #1e40af; font-size: 13px;">
                  🎮 <strong>Physics Playground:</strong> We hope you enjoyed exploring physics through our Physics Playground challenge! Keep experimenting, learning and asking questions!
                </div>
              ` : ""}

              <p>Our academic coordinators will review your details and contact you shortly to confirm your <strong>${enquiryType}</strong> and discuss our batch schedules in Mulund West, Mumbai.</p>

              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0; font-size: 13px;">
                <h4 style="margin-top: 0; margin-bottom: 10px; color: #0f172a;">Your Enquiry Details:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #475569;">
                  <li><strong>Reference Number:</strong> ${enquiryRef}</li>
                  <li><strong>Selected Program:</strong> ${courseInterested}</li>
                  <li><strong>Preferred Mode:</strong> ${learningMode}</li>
                  <li><strong>Location:</strong> 4th Floor, Room Number 408, Konark Darshan, Mulund West, Mumbai, Maharashtra 400080</li>
                </ul>
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 24px; text-align: center;">
                <p style="margin-bottom: 8px; font-weight: bold; color: #0f172a;">Already Enrolled in V.S.R.P.T?</p>
                <p style="margin-top: 0; font-size: 13px; color: #64748b; margin-bottom: 12px;">Access recorded lecture archives, test series, and homework notes on our official app.</p>
                <a href="${process.env.APP_URL || "https://vsrpt.com"}/student-app" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 8px; font-weight: bold; font-size: 13px;">Open Student App</a>
              </div>

              <p style="margin-top: 30px; font-size: 13px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                Warm regards,<br>
                <strong>Admissions Team</strong><br>
                V.S.R.P.T, Mumbai<br>
                Phone: +91 98765 43210
              </p>
            </div>
          </div>
        `;

        dispatchTasks.push(
          resend.emails.send({
            from: fromEmail,
            to: cleanEmail,
            subject: applicantEmailSubject,
            html: applicantEmailHtml
          }).then((res) => ({ type: "applicant_email", res }))
        );
      }

      // Task 2: Institute WhatsApp Notification via Twilio
      if (isTwilioConfigured) {
        const client = twilio(twilioSid, twilioAuthToken);
        const whatsappMsgBody = 
          `New Website Enquiry\n` +
          `Enquiry Ref: ${enquiryRef}\n` +
          `Enquiry Type: ${enquiryType}\n` +
          `Student: ${cleanStudentName}\n` +
          `Parent/Guardian: ${cleanParentName}\n` +
          `Phone: ${cleanPhone}\n` +
          `Email: ${cleanEmail}\n` +
          `Current Class: Class ${currentClass}\n` +
          `Course: ${courseInterested}\n` +
          `Learning Mode: ${learningMode}\n` +
          `Message: ${cleanMessage}\n` +
          `Source: ${enquirySource}\n` +
          (gameName ? `Game: ${gameName} (${gameResult})\n` : "") +
          `Submitted: ${dateString}`;

        dispatchTasks.push(
          client.messages.create({
            from: twilioWhatsappFrom,
            to: instituteWhatsappTo,
            body: whatsappMsgBody
          }).then((res) => ({ type: "admin_whatsapp", res }))
        );
      }

      // Execute all notification dispatches concurrently without failing entire request if one fails
      const results = await Promise.allSettled(dispatchTasks);

      let emailNotificationSent = false;
      let whatsappNotificationSent = false;
      let applicantConfirmationSent = false;

      results.forEach((r) => {
        if (r.status === "fulfilled") {
          if (r.value.type === "admin_email") emailNotificationSent = true;
          if (r.value.type === "admin_whatsapp") whatsappNotificationSent = true;
          if (r.value.type === "applicant_email") applicantConfirmationSent = true;
        } else {
          console.error("Notification dispatch error:", r.reason);
        }
      });

      return res.status(200).json({
        success: true,
        demoMode: false,
        enquiryRef,
        deliveryStatus: {
          emailNotificationSent,
          whatsappNotificationSent,
          applicantConfirmationSent
        },
        message: "Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly."
      });

    } catch (err: any) {
      console.error("Error submitting enquiry:", err);
      return res.status(500).json({
        success: false,
        error: "We could not submit your enquiry at the moment. Please call or WhatsApp us directly."
      });
    }
  });

  // Serve static assets and bundle in development and production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    // Fallback for older Express route resolution
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
