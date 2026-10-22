# DESIGNMELA PRODUCTION DEPLOYMENT CHECKLIST

> [!IMPORTANT]
> **DEPLOYMENT GATE: STOP. DO NOT DEPLOY.**
> This checklist is prepared for execution ONLY AFTER EXPLICIT USER AUTHORIZATION has been granted.
> No remote pushes, Vercel deployments, or credential revocations have been performed.

---

## 1. PRE-DEPLOYMENT ENVIRONMENT VERIFICATION
- [x] **API Key Policy (No Rotation Needed):**
  - The existing Gemini API key is preserved. No actions are required in Google AI Studio.
  - The key has been completely removed from active source code and hidden in `.env` / `.env.local` (gitignored).
- [ ] **Vercel Project Environment Variables:**
  - Verify that `GEMINI_API_KEY` is present in Vercel Dashboard > Designmela > Settings > Environment Variables for Production and Preview.
  - No changes or updates to credentials are required.

---

## 2. CODEBASE & BRANCH VERIFICATION
- [ ] Confirm active branch is `fix/security-accessibility-performance-analytics`.
- [ ] Verify that Git status contains only the intended technical fixes:
  - `api/_security.js`
  - `api/chat.js`
  - `api/finder-ai.js`
  - `api/whatsapp-audit.js`
  - `assets/vid_2.mp4` (compressed 720p)
  - `assets/vid_2-poster.webp`
  - `assets/hero-slide-*-mobile.webp`
  - `assets/logo-icon-96.webp` & `assets/logo-text-400.webp`
  - `index.html`
  - `main.js`
  - `server.mjs`
  - `style.css`
  - `vercel.json`
  - `implementation/` reports and screenshots
- [ ] Confirm that `git status` shows **zero untracked or modified files outside of these approved repairs**.
- [ ] Confirm that zero credentials or secrets are present in commits or staged files.

---

## 3. DEPLOYMENT STEPS (WHEN AUTHORIZED)
1. Commit all verified changes to local branch:
   ```bash
   git add api/ assets/ index.html main.js server.mjs style.css vercel.json implementation/
   git commit -m "feat(perf-a11y-sec): resolve mobile bottlenecks, remove hardcoded secrets, fix contrast and instrument conversion analytics"
   ```
2. Push branch to remote repository:
   ```bash
   git push origin fix/security-accessibility-performance-analytics
   ```
3. Create a Vercel Preview Deployment from the push.
4. Verify the Preview URL:
   - Test Dee chatbot response (`POST /api/chat`).
   - Test Skip to Content (`Tab` -> `Enter`).
   - Check browser console for 0 errors and 0 warnings.
   - Verify video playback and mobile layout.
5. Merge branch into `main` (via GitHub Pull Request or fast-forward merge):
   ```bash
   git checkout main
   git merge --ff-only fix/security-accessibility-performance-analytics
   git push origin main
   ```
6. Verify live deployment at `https://www.designmela.com/`.

---

## 4. POST-DEPLOYMENT VERIFICATION
- [ ] Verify that the live website's Dee chatbot assistant answers normally using the existing Vercel environment variable.
- [ ] In Vercel Analytics dashboard, confirm new custom events (`primary_cta_click`, `whatsapp_click`, `form_step_viewed`) are registering without errors.
- [ ] Zero credential rotation or external actions needed.
