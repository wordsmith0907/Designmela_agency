# DESIGNMELA IMPLEMENTATION — EXACT ROLLBACK PLAN

**Date:** October 22, 2026  
**Reference Git Tag:** `baseline-pre-implementation`  
**Physical Backup Location:** `C:\Users\pc\Desktop\DesignMela_New_BACKUP_20261022\`  

---

## 1. SCENARIOS TRIGGERING ROLLBACK
- Unexpected visual styling deformation or layout breakdown on any device viewport.
- Unintended disruption to project intake form submissions or Web3Forms email delivery.
- Chatbot runtime failures caused by environment variable configuration issues.
- User request to restore the previous codebase state.

---

## 2. OPTION A — INSTANT LOCAL GIT ROLLBACK (RECOMMENDED)

If the changes have NOT been committed or deployed to remote:
1. Discard all uncommitted modifications and reset working directory to baseline commit:
   ```bash
   git reset --hard baseline-pre-implementation
   ```
2. Remove any untracked generated assets while strictly preserving the `audit/` folder:
   ```bash
   git clean -fd -e audit/
   ```
3. Return to `main` branch:
   ```bash
   git checkout main
   ```
4. Verify repository status:
   ```bash
   git status
   ```
   *Expected result: On branch main, working tree clean (with only untracked `audit/`).*

---

## 3. OPTION B — COMPLETE PHYSICAL FILESYSTEM RESTORATION

If Git becomes unresponsive or files need to be restored from the external physical backup created in Stage 0:
1. Run PowerShell robocopy restoration from backup directory:
   ```powershell
   robocopy C:\Users\pc\Desktop\DesignMela_New_BACKUP_20261022 C:\Users\pc\Desktop\DesignMela_New /E /XD node_modules .git audit
   ```
2. Confirm that `assets/vid_2.mp4` has restored to its original 10.15 MB size:
   ```powershell
   (Get-Item assets/vid_2.mp4).Length
   ```
   *Expected result: `10156639`.*

---

## 4. OPTION C — REMOTE / PRODUCTION VERCEL ROLLBACK (IF DEPLOYED)

If a deployment was authorized and promoted to production on Vercel, and a rollback is subsequently needed:
1. Open the Vercel Dashboard (`https://vercel.com/` > Designmela > Deployments).
2. Locate the previous production deployment corresponding to commit `718cf2b`.
3. Click the three dots (`...`) menu on that deployment and select **Instant Rollback**.
4. Vercel will instantly shift 100% of global traffic back to the previous deployment within seconds.
5. In Git, revert the merge commit or force checkout `main` at `718cf2b`:
   ```bash
   git checkout main
   git reset --hard 718cf2b
   git push origin main --force-with-lease
   ```
