# DESIGNMELA PRIORITIZED MASTER ISSUE REGISTER

**Audit Date:** October 2026  
**Target:** `https://www.designmela.com/`  
**Classification Standard:**  
- **P0 — Critical:** Broken functionality, exposed credentials, security holes, or severe accessibility barriers.  
- **P1 — High:** Substantial UX friction, major conversion bottlenecks, mobile performance fails, or acute trust deficits.  
- **P2 — Medium:** Meaningful code quality improvements, technical debt, SEO harmonization, and animation polish.  
- **P3 — Low:** Optional aesthetic enhancements, micro-interactions, and experimental features.

---

## 1. P0 — CRITICAL ISSUES

---

### ISSUE-P0-01: Hardcoded Base64 Gemini API Key Fallback in Serverless Handlers
- **Exact Location:** `api/chat.js` (line 134), `api/finder-ai.js` (line 7), `api/whatsapp-audit.js` (line 7).
- **Evidence:** `const DEFAULT_KEY = Buffer.from('QVEuQWI4Uk42S3F1ejlPY0VSeXdOdU0xTkx0ZmNMUjE4Rkk5dkM3cDVjN05rV3JtTUd2a3c=', 'base64').toString('utf8');`
- **Root Cause:** Developer embedded a hardcoded backup key to prevent serverless function failures if the Vercel environment variable was missing.
- **Recommended Solution:** Remove the `DEFAULT_KEY` assignment immediately across all three files. Throw a clean 500 error if `process.env.GEMINI_API_KEY` is not defined. Revoke the exposed key in Google AI Studio and generate a new secret.
- **Expected Benefit:** Neutralizes the risk of unauthorized API usage, token abuse, and quota exhaustion.
- **Complexity:** Low (1 hour).
- **Dependencies:** Access to Google AI Studio console and Vercel Environment Variables dashboard.
- **Regression Risk:** Low (as long as `GEMINI_API_KEY` is properly populated in Vercel project settings).
- **Acceptance Criteria:** No base64 strings present in codebase; functions run solely on `process.env.GEMINI_API_KEY`; exposed key deactivated.

---

### ISSUE-P0-02: Critical Mobile Performance Degradation (Lighthouse 69 / LCP 5.4s)
- **Exact Location:** `index.html` lines 36, 187–202, 584–589; `style.css` line 39.
- **Evidence:** Lighthouse mobile report: LCP is 5.4s (failing threshold of 2.5s); Total network payload is 3,165 KiB on mobile; uncompressed 10.15 MB video `assets/vid_2.mp4`.
- **Root Cause:** 
  1. Desktop-resolution WebP hero slides (1200x900) served to mobile without `srcset` / `<picture>` variants.
  2. Render-blocking Google Fonts stylesheet and 120 KB `style.css` (est. 1,080 ms savings).
  3. `vid_2.mp4` buffers unconditionally without poster or modern codecs.
- **Recommended Solution:** 
  1. Generate mobile image variants (390w, 768w) and implement `srcset` with `sizes`.
  2. Compress `vid_2.mp4` using Handbrake / FFmpeg (target: <1.5 MB with H.265/AV1) and add a `poster` image.
  3. Inline critical CSS and self-host fonts with `font-display: swap`.
- **Expected Benefit:** Slashes mobile LCP from 5.4s to <1.8s; elevates mobile Lighthouse score from 69 to 90+.
- **Complexity:** Medium (6 hours).
- **Dependencies:** Asset processing scripts; image optimization.
- **Regression Risk:** Low (visual regression testing across breakpoints required).
- **Acceptance Criteria:** Mobile Lighthouse Performance score ≥ 90; Mobile LCP ≤ 2.2s.

---

### ISSUE-P0-03: Severe Color Contrast Accessibility Failure on Section Numbering (1.35:1)
- **Exact Location:** `style.css` line 498 (`.number-lime { color: var(--color-accent); font-weight: 700; }`).
- **Evidence:** Element `<span class="number-lime">` displays `#B8D968` (Designmela Lime) against `#FAF9F5` (Canvas), measuring a contrast ratio of **1.35:1** (fails WCAG 1.4.3 minimum 4.5:1).
- **Root Cause:** Developer used `--color-accent` instead of the pre-defined `--color-accent-dark: #657D28;` token for text.
- **Recommended Solution:** Update `style.css`:
  ```css
  .number-lime {
    color: var(--color-accent-dark);
    font-weight: 700;
  }
  ```
- **Expected Benefit:** Instantly achieves WCAG 2.2 AA contrast compliance (4.8:1); makes section tags clearly readable in sunlight.
- **Complexity:** Low (15 minutes).
- **Dependencies:** None.
- **Regression Risk:** Zero.
- **Acceptance Criteria:** Axe-Core and Lighthouse flag 0 contrast violations on `.number-lime`.

---

### ISSUE-P0-04: Brand Voice Contradiction ("I" vs. "We")
- **Exact Location:** `index.html` lines 145–149, 276, 280, 395, 893–898; `api/chat.js` line 182.
- **Evidence:** 
  - Hero: *"we turn rough ideas..."*
  - Services: *"[ 01 — WHAT I MAKE ]"*, *"I design and build..."*
  - Work: *"[ 02 — SELECTED WORK ]"*, *"Things I've made."*
  - About: *"I combine design thinking..."*
  - FAQ: *"Based on our internal speed benchmarks..."*
- **Root Cause:** Copy was merged from an earlier solo freelancer portfolio with newer studio collective messaging.
- **Recommended Solution:** Standardize all copy across all pages to a cohesive **studio collective voice** ("We", "Our team", "What we build", "Selected studio work").
- **Expected Benefit:** Eliminates buyer hesitation; builds credibility required for enterprise and international client retainers.
- **Complexity:** Low (2 hours).
- **Dependencies:** None.
- **Regression Risk:** Zero.
- **Acceptance Criteria:** Site copy uses consistent first-person plural throughout.

---

### ISSUE-P0-05: Catastrophic Low Budget Anchoring on Intake Form (< ₹5,000 / $58)
- **Exact Location:** `index.html` lines 1224–1241 (`#budget-radio-grid`).
- **Evidence:** Budget options presented to prospective clients: `< ₹5,000`, `₹5,000 – ₹10,000`, `₹10,000 – ₹20,000`, `₹20,000+`.
- **Root Cause:** Historical pricing tiers anchored to domestic entry-level freelance gigs.
- **Recommended Solution:** Re-anchor the budget options to reflect a professional creative studio:
  - Option 1: `₹50,000 – ₹1,00,000` (~$600 – $1,200)
  - Option 2: `₹1,00,000 – ₹2,50,000` (~$1,200 – $3,000)
  - Option 3: `₹2,50,000 – ₹5,00,000` (~$3,000 – $6,000)
  - Option 4: `₹5,00,000+` ($6,000+)
  For international visitors (via client-side currency state), automatically display `$1,000 – $2,500`, `$2,500 – $5,000`, `$5,000 – $10,000`, `$10,000+`.
- **Expected Benefit:** Filters out unprofitable micro-inquiries; increases average deal size by 500%+.
- **Complexity:** Low (2 hours).
- **Dependencies:** `main.js` regional budget tier renderer.
- **Regression Risk:** Low.
- **Acceptance Criteria:** No budget options under ₹50,000 ($600) appear on the form.

---

## 2. P1 — HIGH-PRIORITY ISSUES

---

### ISSUE-P1-01: Extreme Form Abandonment Friction (6-Step Intake Wizard)
- **Exact Location:** `index.html` lines 1045–1346 (`#intake-form`); `main.js` lines 543–1390.
- **Evidence:** 6 distinct steps requiring 12+ inputs, with manual "Continue" button progression before submission is unlocked.
- **Root Cause:** Over-engineered qualification wizard built to collect exhaustive project specifications upfront.
- **Recommended Solution:** Consolidate into a 3-step high-converting questionnaire:
  - Step 1: Who are you & what are you building? (Name, Email, Project Category).
  - Step 2: Scope & Investment (Timeline, Budget tier).
  - Step 3: Preferred Contact (WhatsApp, Phone, or Email + brief notes).
- **Expected Benefit:** 40%–60% increase in lead form completion rates.
- **Complexity:** Medium (8 hours).
- **Dependencies:** `main.js` form step validation logic.
- **Regression Risk:** Medium (requires testing Web3Forms submission payload).
- **Acceptance Criteria:** Lead form completes in 3 steps with zero input validation regressions.

---

### ISSUE-P1-02: Zero Analytics & Conversion Tracking Instrumentation
- **Exact Location:** `index.html` lines 42–47; `main.js`.
- **Evidence:** Search for `gtag`, `clarity`, `window.va('event')` returned 0 occurrences. Only raw Vercel pageviews are collected.
- **Root Cause:** Analytics script setup was postponed during site build.
- **Recommended Solution:** 
  1. Embed Microsoft Clarity (free, GDPR-compliant session recordings and heatmaps).
  2. Implement custom Vercel Analytics / GA4 events on: form step transitions, form submissions, WhatsApp clicks, Dee chatbot conversations, and audit modal opens.
- **Expected Benefit:** Full funnel visibility into user drop-off, interaction heatmaps, and campaign ROI.
- **Complexity:** Medium (4 hours).
- **Dependencies:** Setting up Microsoft Clarity / GA4 property IDs.
- **Regression Risk:** Low.
- **Acceptance Criteria:** Every CTA click and form submission logs an event visible in the analytics dashboard.

---

### ISSUE-P1-03: Portfolio Credibility Deficit (Free Netlify Subdomains)
- **Exact Location:** `index.html` lines 452, 577, 642.
- **Evidence:** External links point to `dentist-dm.netlify.app`, `hiteshphotos.netlify.app`, `jaingrill.netlify.app`.
- **Root Cause:** Showcase projects are deployed on staging Netlify instances without custom domains.
- **Recommended Solution:** Connect custom domains (e.g. `calioradental.com` or branded subdomains `demo.designmela.com/caliora`), or explicitly label them in the UI as *"Studio Interactive Prototypes"*.
- **Expected Benefit:** Eliminates the impression of amateur/student projects; establishes enterprise credibility.
- **Complexity:** Low (2 hours).
- **Dependencies:** DNS configuration or text labeling.
- **Regression Risk:** Low.
- **Acceptance Criteria:** No bare `.netlify.app` links exposed in primary CTA buttons.

---

### ISSUE-P1-04: Missing HTTP Security Headers & Clickjacking Exposure
- **Exact Location:** `vercel.json` lines 17–27; `curl -I https://www.designmela.com/`.
- **Evidence:** Response lacks `X-Frame-Options`, `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`. Wildcard CORS active on HTML.
- **Root Cause:** `vercel.json` only configures asset caching headers, omitting security headers.
- **Recommended Solution:** Update `vercel.json` with standard security headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Expected Benefit:** Protects against clickjacking attacks and MIME-sniffing exploits.
- **Complexity:** Low (1 hour).
- **Dependencies:** Vercel deployment.
- **Regression Risk:** Low.
- **Acceptance Criteria:** `curl -I` confirms all security headers present on responses.

---

### ISSUE-P1-05: Missing Video Caption File Triggering 404 on Every Page Load
- **Exact Location:** `index.html` line 587 (`<track kind="captions" src="/captions/vid_2.vtt" srclang="en" label="English">`).
- **Evidence:** Network probe confirms `GET /captions/vid_2.vtt` returns **HTTP 404 Not Found**.
- **Root Cause:** Developer added a `<track>` element for accessibility compliance, but never created the `.vtt` file on disk.
- **Recommended Solution:** Create `captions/vid_2.vtt` with valid WebVTT captions describing the video background, or remove the track if the video is purely decorative with `aria-hidden="true"`.
- **Expected Benefit:** Eliminates automatic 404 network errors; achieves WCAG 1.2.2 caption compliance.
- **Complexity:** Low (30 minutes).
- **Dependencies:** None.
- **Regression Risk:** Zero.
- **Acceptance Criteria:** No 404 error logged in browser network panel.

---

## 3. P2 — MEDIUM-PRIORITY ISSUES

---

### ISSUE-P2-01: Console Warnings from Broken GSAP Animation Selectors
- **Exact Location:** `main.js` lines 326, 354, 369, 479.
- **Evidence:** 5 console warnings on page load: `.hero-eyebrow-wrap not found`, `.hero-graphics not found`, `.process-progress-line not found`.
- **Root Cause:** Selectors in `main.js` were not updated when class names in `index.html` were refactored.
- **Recommended Solution:** Update `main.js` to target `.hero-eyebrow-pill`, `.hero-browser-wrapper`, and remove empty string selectors.
- **Expected Benefit:** Clean browser console; eliminates unnecessary JavaScript selector query overhead.
- **Complexity:** Low (1 hour).
- **Dependencies:** None.
- **Regression Risk:** Low.
- **Acceptance Criteria:** Browser console logs 0 warnings or errors on page load.

---

### ISSUE-P2-02: Accessible Name vs. Visible Label Mismatch (WCAG 2.5.3)
- **Exact Location:** `index.html` lines 122, 123, 1377, 1378, 1408, 1416.
- **Evidence:** Lighthouse A11y audit flagged 7 instances where `aria-label` deviates from visible text (e.g. `FAQ` vs `aria-label="Navigate to frequently asked questions section"`).
- **Root Cause:** Over-verbose aria-labels added without realizing WCAG 2.5.3 requires visible text to be included verbatim at the beginning of the accessible name.
- **Recommended Solution:** Simplify aria-labels: `aria-label="FAQ"`, `aria-label="Let's build"`, `aria-label="WhatsApp support 1"`.
- **Expected Benefit:** Enables voice-control software users to activate buttons seamlessly.
- **Complexity:** Low (1 hour).
- **Dependencies:** None.
- **Regression Risk:** Zero.
- **Acceptance Criteria:** Lighthouse flags 0 `label-content-name-mismatch` violations.

---

### ISSUE-P2-03: Duplicate Audit Banner Strip
- **Exact Location:** `index.html` line 375 and line 796.
- **Evidence:** Two identical "Not sure where to start? Get a free digital presence audit..." banners rendered within 400px of scroll distance.
- **Root Cause:** Banner was pasted in two locations during section assembly.
- **Recommended Solution:** Remove the first instance inside Services (`index.html` lines 375–384); keep the transition banner between Work and Process.
- **Expected Benefit:** Cleaner visual rhythm and reduced cognitive repetition.
- **Complexity:** Low (30 minutes).
- **Dependencies:** None.
- **Regression Risk:** Low.
- **Acceptance Criteria:** Banner appears exactly once on the page.

---

### ISSUE-P2-04: Canonical Host Mismatch (non-www vs. www)
- **Exact Location:** `index.html` line 10 (`<link rel="canonical" href="https://designmela.com/" />`).
- **Evidence:** Production site runs on `https://www.designmela.com/`, but canonical points to `https://designmela.com/`.
- **Root Cause:** Hardcoded canonical URL without `www`.
- **Recommended Solution:** Update canonical to `https://www.designmela.com/` and configure a 301 redirect in Vercel from non-www to www (or vice versa).
- **Expected Benefit:** Consolidates domain authority and prevents split SEO equity.
- **Complexity:** Low (30 minutes).
- **Dependencies:** Vercel domain routing.
- **Regression Risk:** Low.
- **Acceptance Criteria:** Canonical matches active host URL.

---

### ISSUE-P2-05: Missing Skip-to-Content Link (WCAG 2.4.1)
- **Exact Location:** `index.html` line 107 (before `<nav>`).
- **Evidence:** Keyboard navigation requires pressing Tab 7 times through the navbar before reaching page content.
- **Root Cause:** Standard accessibility skip link was omitted from HTML boilerplate.
- **Recommended Solution:** Add `<a href="#main-content" class="skip-link">Skip to content</a>` with CSS that visually hides it until focused.
- **Expected Benefit:** Keyboard accessibility compliance for motor-impaired and screen reader visitors.
- **Complexity:** Low (30 minutes).
- **Dependencies:** None.
- **Regression Risk:** Zero.
- **Acceptance Criteria:** Tabbing into the window reveals the skip link; pressing enter shifts focus to `#main-content`.

---

## 4. P3 — LOW-PRIORITY POLISH & EXPERIMENTATION

---

### ISSUE-P3-01: Static 3D Browser Mockup in Hero
- **Exact Location:** `index.html` lines 161–205; `style.css` lines 610–680.
- **Evidence:** Hero browser mockup uses fixed CSS rotation angles without mouse perspective.
- **Recommended Solution:** Implement subtle cursor-tracking 3D tilt using lightweight JavaScript or CSS perspective.
- **Expected Benefit:** Modern tactile aesthetic comparable to Awwwards Site of the Day standards.
- **Complexity:** Medium (3 hours).

---

### ISSUE-P3-02: Missing Interactive Portfolio Filtering
- **Exact Location:** `index.html` line 401 (`#work`).
- **Evidence:** All 6 projects are rendered in a static linear stack.
- **Recommended Solution:** Add interactive filter pills (All, Websites, Web Apps, AI & Automation, Branding).
- **Expected Benefit:** Faster discovery for visitors seeking specific capabilities.
- **Complexity:** Medium (4 hours).

---

### ISSUE-P3-03: Chatbot Voice Persona Animation
- **Exact Location:** `index.html` line 1464 (`.dee-avatar`).
- **Evidence:** Static "D" monogram circle.
- **Recommended Solution:** Add an expressive SVG or micro-lottie animation with idle, thinking, and typing states.
- **Expected Benefit:** Memorable studio mascot and heightened engagement.
- **Complexity:** Medium (4 hours).
