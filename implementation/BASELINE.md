# DESIGNMELA IMPLEMENTATION BASELINE & RECOVERY REPORT

**Date:** October 22, 2026  
**Target Website:** `https://www.designmela.com/`  
**Active Working Directory:** `C:\Users\pc\Desktop\DesignMela_New`  
**Git Branch:** `fix/security-accessibility-performance-analytics`  
**Base Commit:** `718cf2b` (`feat(chat): implement Gemini explicit context caching and add auto-open testing link support`)  
**Deployment Infrastructure:** Vercel Edge Network (`vercel.json`)  
**Local Dev Server:** `server.mjs` (`node server.mjs` running on port 8080)

---

## 1. BACKUP & VERIFIED RECOVERY POINTS

### Physical Directory Backup
- **Location:** `C:\Users\pc\Desktop\DesignMela_New_BACKUP_20261022\`
- **Contents:** Full copy of the repository (excluding `.git` and `node_modules` to prevent corruption/redundancy).
- **Verification Status:** Verified via filesystem check (`Test-Path C:\Users\pc\Desktop\DesignMela_New_BACKUP_20261022\index.html` -> `True`).
- **File Count:** 81 files, 22.46 MB transferred.

### Git Recovery Point
- **Git Tag:** `baseline-pre-implementation` (created on commit `718cf2b`).
- **Working Tree Status:** Clean. Untracked `audit/` folder preserved.

### Step-by-Step Rollback Procedure
If any unexpected visual or functional regressions occur:
1. **Instant Git Rollback:**
   ```bash
   git reset --hard baseline-pre-implementation
   git clean -fd -e audit/
   ```
2. **Filesystem Restoration (if Git is unusable):**
   ```powershell
   robocopy C:\Users\pc\Desktop\DesignMela_New_BACKUP_20261022 C:\Users\pc\Desktop\DesignMela_New /E /XD node_modules .git audit
   ```

---

## 2. REPOSITORY & ARCHITECTURE DISCOVERY

### File Structure
- `index.html` (90 KB, 1,618 lines) — Main single-page application & marketing page.
- `automation-finder.html` (41 KB) & `whatsapp-audit.html` (35 KB) — Interactive standalone utilities.
- `privacy.html` (46 KB) & `terms.html` (47 KB) — Legal disclosure pages.
- `404.html` (2.6 KB) — Branded 404 error page.
- `main.js` (167 KB, 4,399 lines) — Vanilla JavaScript orchestrating GSAP animations, PPP currency conversion, form state machine, and Dee chatbot widget.
- `style.css` (124 KB, 5,605 lines) — Complete stylesheet with custom CSS variables, responsive typography, and layout rules.
- `server.mjs` (3.9 KB) — Local development Node.js server with native API routing.
- `vercel.json` (538 B) — Vercel routing, rewrites, and asset cache headers.
- `api/chat.js` (28 KB) — Vercel Serverless function communicating with Google Gemini API (v1beta with context caching).
- `api/finder-ai.js` (4.3 KB) — Gemini integration for Automation Finder tool.
- `api/whatsapp-audit.js` (7.5 KB) — Gemini integration for WhatsApp Audit tool.

### Existing Integrations Audit
1. **Google Gemini AI:**
   - Active in `api/chat.js`, `api/finder-ai.js`, `api/whatsapp-audit.js`.
   - Vulnerability: Hardcoded base64 fallback keys in all 3 handlers.
2. **Web3Forms:**
   - Active for contact intake form (`#intake-form`), audit modal form (`#audit-form`), and standalone utility submissions.
   - Handled via AJAX `fetch('https://api.web3forms.com/submit', ...)` in `main.js`.
3. **Vercel Web Analytics:**
   - Injected in HTML heads: `/_vercel/insights/script.js` with `window.va`.
   - Only records basic pageviews; 0 custom conversion events currently tracked.
4. **Microsoft Clarity:**
   - Not currently integrated in the codebase.
5. **Google Analytics / Tag Manager:**
   - Not currently integrated in the codebase.

---

## 3. BASELINE LIGHTHOUSE & CORE WEB VITALS

Audited against `https://www.designmela.com/` using Google Lighthouse v13.5.0 (Headless Chromium 128 / Chromium 155):

| Category / Metric | Desktop Baseline | Mobile Baseline | Mobile CWV Target | Status |
|---|---|---|---|---|
| **Performance Score** | **97 / 100** | **69 / 100** | ≥ 90 / 100 | **FAIL (Mobile)** |
| **First Contentful Paint (FCP)** | 0.9 s | 3.3 s | ≤ 1.8 s | Poor |
| **Largest Contentful Paint (LCP)** | 0.9 s | **5.4 s** | ≤ 2.5 s | **CRITICAL FAIL** |
| **Total Blocking Time (TBT)** | 0 ms | 20 ms | ≤ 200 ms | PASS |
| **Cumulative Layout Shift (CLS)** | 0.000 | 0.000 | ≤ 0.1 | PASS |
| **Speed Index** | 1.3 s | 5.6 s | ≤ 3.4 s | Poor |
| **Accessibility Score** | **96 / 100** | **96 / 100** | 100 / 100 | Needs A11y fixes |
| **Best Practices Score** | **100 / 100** | **100 / 100** | 100 / 100 | PASS |
| **SEO Score** | **100 / 100** | **100 / 100** | 100 / 100 | PASS |

### Primary Bottlenecks Identified
1. **LCP Image & Render-Blocking Delivery:**
   - Mobile devices download full 1200x900 desktop WebP slides without responsive `srcset`/`sizes`.
   - Render-blocking Google Fonts and 124 KB `style.css` delay first paint by over 1.0s on cellular throttled connections.
2. **Heavy Video Payload:**
   - `assets/vid_2.mp4` is **10.15 MB** (10,156,639 bytes), lacks modern AV1/WebM formats, and lacks a `poster` image.
   - Buffering on mobile network simulations aborts (`net::ERR_ABORTED`).

---

## 4. BASELINE CONSOLE ERRORS & NETWORK DEFECTS

### Browser Console Warnings (Chromium DevTools)
5 repetitive warnings emitted by GSAP v3.12.5 on page load:
1. `[WARNING] GSAP target .hero-eyebrow-wrap not found. https://gsap.com`
2. `[WARNING] GSAP target  not found. https://gsap.com`
3. `[WARNING] GSAP target .hero-graphics not found. https://gsap.com`
4. `[WARNING] GSAP target  not found. https://gsap.com`
5. `[WARNING] GSAP target .process-progress-line not found. https://gsap.com`

### Network Failures
1. **HTTP 404 Not Found on Captions:**
   - Request: `GET /captions/vid_2.vtt`
   - Trigger: `<track kind="captions" src="/captions/vid_2.vtt" ...>` in `index.html` (line 587).
   - Defect: File `/captions/vid_2.vtt` does not exist on disk.
2. **Video Buffer Timeouts:**
   - Repeated `net::ERR_ABORTED` on mobile network throttling for `assets/vid_2.mp4`.

---

## 5. ACCESSIBILITY & SECURITY DEFECTS CONFIRMED

1. **Color Contrast Failure:**
   - Class: `.number-lime` in `style.css`.
   - Text color `#B8D968` against background `#FAF9F5`.
   - Measured Contrast Ratio: **1.35:1** (fails WCAG 1.4.3 minimum 4.5:1).
2. **WCAG 2.5.3 Accessible Name vs. Visible Text Mismatches:**
   - 7 buttons/links have `aria-label`s that do not begin with the exact visible text string (e.g. `aria-label="Navigate to frequently asked questions section"` vs visible `FAQ`).
3. **Missing Skip-to-Content Link (WCAG 2.4.1):**
   - Keyboard users must tab through all nav items before reaching main content.
4. **Hardcoded Base64 Gemini API Keys:**
   - Present in `api/chat.js` (line 134), `api/finder-ai.js` (line 7), and `api/whatsapp-audit.js` (line 7).
5. **Missing HTTP Security Headers:**
   - `vercel.json` lacks `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, and `Strict-Transport-Security`.
6. **Unrestricted API Endpoints:**
   - `/api/chat`, `/api/finder-ai`, and `/api/whatsapp-audit` lack rate limiting, request size limits, and input schema validation.

---

## 6. VIEWPORT CAPTURES BASELINE REFERENCE

Reference screenshots preserved in `audit/screenshots/`:
- **Desktop (1440px):** `desktop-1440-viewport.png`, `desktop-1440-hero.png`, `desktop-1440-full.png`
- **Tablet Landscape (1024px):** `tablet-landscape-1024-viewport.png`, `tablet-landscape-1024-full.png`
- **Tablet Portrait (768px):** `tablet-portrait-768-viewport.png`, `tablet-portrait-768-full.png`, `tablet-portrait-768-menu-open.png`
- **Mobile Standard (390px):** `mobile-standard-390-viewport.png`, `mobile-standard-390-full.png`, `mobile-standard-390-menu-open.png`
- **Mobile Small (320px):** `mobile-small-320-viewport.png`, `mobile-small-320-full.png`, `mobile-small-320-menu-open.png`
- **Sub-pages:** `page_automation-finder-desktop.png`, `page_whatsapp-audit-desktop.png`, `page_privacy-desktop.png`, `page_terms-desktop.png`, `page_404-desktop.png`
- **Interactive States:** `chatbot-opened.png`, `dee-chat-live-tested.png`

---

## 7. CHECKPOINT VERIFICATION

- [x] Separate Git branch created: `fix/security-accessibility-performance-analytics`.
- [x] Uncommitted work checked and verified clean.
- [x] Local physical backup created and verified (`DesignMela_New_BACKUP_20261022`).
- [x] Git baseline tag created (`baseline-pre-implementation`).
- [x] Audit reports and evidence reviewed.
- [x] Integrations cataloged.
- [x] Baseline metrics and defects documented.
- [x] Rollback plan documented.

**STAGE 0 COMPLETED. Ready to proceed to STAGE 1 — SECURITY REPAIRS.**
