# VSRPT Physics Institute Website - Full-Stack Production Build

A complete, high-performance, responsive full-stack website for **Apex Physics Institute**, located in Kothrud, Pune. This website is built on a modern **React + Vite + TypeScript** stack powered by an **Express.js** backend. It features custom interactive physics simulators, a 3D Physics Playground, responsive multi-page routing, server-side secure email and WhatsApp notifications, and detailed visitor analytics.

---

## Key Features

1. **Interactive Pendulum Hero (Home Page):** An interactive Newtonian pendulum bob simulating simple harmonic motion across different gravity settings (Earth, Moon, Jupiter) with a smooth follower angle animation.
2. **"Physics Playground" (Explore Page):** An expanded interactive game section featuring a 3D carousel to select between 5 physics simulators:
   - **Projectile Challenge (Playable):** An HTML5 canvas game demonstrating launch angle ($\theta$), initial speed ($V_0$), and gravity ($g$). Features Web Audio API synth sounds, difficulty barricades, oscillating targets, and score tracking with `localStorage` persistence.
   - **Gravity Drop (Coming Soon):** Predict free-fall speeds.
   - **Pendulum Match (Coming Soon):** Oscillation time periods.
   - **Lens Focus (Coming Soon):** Optics and focal length.
   - **Collision Lab (Coming Soon):** Momentum and conservation laws.
3. **Win & Loss Result Modals:** Pauses the game attempt to evaluate win or loss. Displays educational feedback and direct CTA buttons to book a Free Demo or Apply for Admission with tracking query parameters.
4. **"What If Earth Split" Space Simulation (Explore Page):** A custom animated canvas player displaying tectonic faulting, mass centers splitting, escaping water/atmosphere particles, and multi-body orbital mechanics.
5. **Multi-Channel Enquiry System (Contact Page):** Secure server-side form endpoint `/api/send-enquiry` supporting enquiry pre-filling, hidden metadata tracking (device category, referral source, game results), and rate limiting.
6. **Classplus Student Portal (Student App Page):** Guides active admissions to play store and web login configurations with custom setup cards.

---

## Setup Instructions for Backend Notifications

The server-side endpoint `/api/send-enquiry` dispatches notifications to both the institute administration and the student applicant.

### 1. Resend Email Setup (Resend API)
1. Sign up for a free account at [resend.com](https://resend.com).
2. Go to **Domains** and verify your custom domain (e.g. `apexphysicsinstitute.com`) by adding DKIM and SPF records in your DNS provider.
3. Generate an API Key under **API Keys**.
4. Configure environment variables:
   ```env
   RESEND_API_KEY="re_yourPrivateAPIKey"
   ENQUIRY_FROM_EMAIL="enquiries@yourdomain.com"
   ENQUIRY_TO_EMAIL="admissions@yourdomain.com"
   ```

### 2. Twilio WhatsApp Setup (Twilio API)
1. Sign up at [twilio.com](https://twilio.com) and create a project.
2. Under **Messaging -> Try it Out -> Send a WhatsApp message**, activate the Twilio WhatsApp Sandbox or register your WhatsApp Business Sender.
3. Obtain your **Account SID** and **Auth Token** from the Twilio Console dashboard.
4. Configure environment variables:
   ```env
   TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxx"
   TWILIO_AUTH_TOKEN="your_auth_token"
   TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"
   INSTITUTE_WHATSAPP_TO="whatsapp:+919876543210"
   ```

### 3. Demo / Sandbox Mode Fallback
If `RESEND_API_KEY` and `TWILIO_ACCOUNT_SID` are not set in the environment, the server automatically operates in **Demo Mode**. Form submissions will succeed without error, and enquiry summary details will be logged securely in the node.js server console.

---

## Environment Variables Reference

| Variable Name | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Optional | API Key for Google Gemini model calls |
| `APP_URL` | Auto-injected | Canonical public URL of the application |
| `RESEND_API_KEY` | Recommended | API key for Resend email delivery service |
| `ENQUIRY_FROM_EMAIL` | Recommended | Verified domain sender email for enquiries |
| `ENQUIRY_TO_EMAIL` | Recommended | Target receiver email address for admin notifications |
| `TWILIO_ACCOUNT_SID` | Optional | Twilio Account SID for WhatsApp messaging |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio Auth Token for WhatsApp messaging |
| `TWILIO_WHATSAPP_FROM` | Optional | Twilio WhatsApp sender number |
| `INSTITUTE_WHATSAPP_TO` | Optional | Institute receiver WhatsApp number |

---

## Analytics & Tracking (Vercel)

Pre-configured with `@vercel/analytics` and a custom non-PII `trackAnalyticsEvent` utility to track user interactions safely:
- `physics_playground_opened`
- `physics_game_selected`
- `physics_game_started`
- `physics_game_completed`
- `physics_game_won`
- `physics_game_lost`
- `playground_demo_clicked`
- `playground_admission_clicked`
- `enquiry_submitted`

---

## Installation & Local Execution

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server (Express + Vite on port 3000)
npm run dev

# 3. Build for production (esbuild bundles server.ts to dist/server.cjs)
npm run build

# 4. Start production server
npm run start
```
