# Quran Hero / Hifz Avengers (`quran-hero-app`) — Project Guide (`CLAUDE.md`)

## 1. What the App Does
A gamified, superhero-themed Quran memorization (Hifz / Jadeed) and revision (Murajaat) web application built for a 9-year-old child, with multi-student profile support.
- **Child / Student View:** Colorful superhero avatars, daily Jadeed & Murajaat logging, **15-line standard Misri Tajweed Mushaf** line targets, Juz 1–30 Murajaat dropdown selector, streak counters, confetti celebrations, a spin-the-wheel Treat Vault, and a Grand Prize progress tracker.
- **Main Student Dashboard:** Overview across multiple students so switching or adding students is effortless.
- **Parent Portal:** Set daily line targets, update current Quran bookmarks (Juz, Surah, Page/Line) with auto-advance, configure Sipara-based long-term goals (supporting both forward and backward Surah completion order within a Juz, e.g., Juz 26 backwards), view multi-week Sipara pacing forecasts, and manage custom treats/rewards.

## 2. How It's Structured
- `server.mjs` — Custom zero-dependency Node.js production HTTP server that serves the Vite `dist/` bundle and provides `/api/state` (`GET`/`POST`) with atomic queued disk writes to `DATA_DIR/hifz-state.json` and automatic backup (`hifz-state.backup.json`). Listens on both `PORT` (3000) and port `80` when needed in container environments.
- `Dockerfile` — Multi-step `node:22-alpine` container image building the Vite frontend and running `node server.mjs` with `/data` as the persistent volume directory.
- `src/`
  - `App.tsx` — Root state manager, student switcher, server sync with local storage fallback, and tab navigation.
  - `components/`
    - `StudentDashboard.tsx` — Multi-student overview and profile management.
    - `HeroHeader.tsx`, `HeroAvatarSvg.tsx`, `HeroPickerModal.tsx` — Superhero theme & avatar selector.
    - `GoalProgressBanner.tsx`, `DailyLogForm.tsx` — Daily Jadeed (15-line Misri Mushaf lines) & Murajaat (Juz 1–30) logging.
    - `TreatVault.tsx`, `TreatSpinWheelModal.tsx`, `CelebrationModal.tsx`, `GrandPrizeModal.tsx` — Gamification & rewards.
    - `TrendsAndForecast.tsx` — Pacing analytics and completion projections.
    - `ParentModule.tsx` — Parent controls, bookmark manager, Sipara long-term goal calculator, and data backup/restore.
  - `data/` — `quranMetadata.ts` (Juz 1–30, Surahs, and 15-line Misri Mushaf structure), `heroes.ts`, `defaultState.ts`.
  - `utils/` — `hifzMath.ts` (progress & Sipara line calculations), `sound.ts`, `dialogHelpers.ts`.

## 3. How to Run It Locally
- **Development mode (Vite HMR):**
  ```bash
  cd /Users/tag/.gemini/antigravity/scratch/quran-hero-app
  npm install
  npm run dev
  ```
- **Production mode (with local disk persistence in `./data`):**
  ```bash
  npm run build
  npm start
  ```
  Opens at `http://localhost:3000`.

## 4. How to Deploy It
- **GitHub Repository:** `https://github.com/tag1427/hifz-avengers.git`
- **Production Server:** **Contabo VPS** managed via **Coolify** (Docker build).
- **Persistent Volume:** In Coolify, a persistent volume is mounted to `/data` inside the container (`DATA_DIR=/data`) so `hifz-state.json` is never lost across redeployments.
- **Domains:** Coolify auto-generated `sslip.io` domain and free ClouDNS domain `tagsolutions.cloud-ip.cc`.
- **To Deploy Changes:**
  ```bash
  cd /Users/tag/.gemini/antigravity/scratch/quran-hero-app
  git add .
  git commit -m "Describe changes"
  git push origin main
  ```
  Then trigger **Deploy** in Coolify (if auto-deploy webhook is not enabled).

## 5. What's Finished
- Multi-student profile support and main student dashboard.
- Server-side persistent JSON storage (`server.mjs` + `/data/hifz-state.json` + automatic backup and client merge protection so redeploys never overwrite existing data).
- 15-line Misri Tajweed Mushaf line-based Jadeed targets and Sipara tracking (replacing variable-length Ayat targets).
- Juz 1–30 dropdown selector for Murajaat and backward/forward Surah order calculation inside any Sipara.
- Gamified rewards (Treat Spin Wheel, Treat Vault, Superhero themes, sound effects, and confetti).

## 6. What's Still Pending
- Live and actively used on Coolify. Future tweaks are added incrementally based on the child's Hifz routine.

## 7. Problems We Hit & How We Fixed Them
- **Docker build failing on Coolify because `src/data` was ignored:** Default `.gitignore` / `.dockerignore` had a `data` rule that accidentally excluded `src/data/` (`quranMetadata.ts`, `heroes.ts`, `defaultState.ts`). Fixed by anchoring `/data` to the root directory only (`4389c99`).
- **Coolify proxy returning 502 / error page on initial deploy:** Configured `server.mjs` and `Dockerfile` to expose and listen cleanly on both port `3000` and port `80` (`356f686`), and configured the domain mapping properly in Coolify.
- **Protecting live student entries during code updates:** Built `server.mjs` with queued atomic file writes, a `.backup.json` fallback, and versioned state merging so redeploying the container never resets or overwrites logged Hifz data (`ee80dd7`).
- **Ayat counts being uneven in length for daily targets:** Replaced Ayat-based goals with **15-line standard Misri Mushaf lines** (`79e749f`) so every page has an identical 15-line unit of effort.
