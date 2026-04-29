# Relaunch Kit

The app was shelved in a deliberately complete-but-not-team-ready state. This doc is the single source of truth for everything that was knowingly left out.

Read top-to-bottom before reopening the codebase. Anything not on this list is either done (see git log) or out of scope for the initial launch.

---

## §1 — Must do before flipping launch on (you)

These three are the launch blockers. Nothing else in this doc gates the launch.

### 1.1 Legal pages
- **Privacy Policy** — required by GDPR, CCPA, COPPA, the App Store, Google Play, and Supabase ToS. Cover: what's collected (email, name, phone, birthday, city, lesson progress), where it's stored (Supabase EU region — confirm), retention, third parties (Supabase, Vercel, Sentry if enabled).
- **Terms of Service** — covers acceptable use, account termination, IP ownership of lesson content.
- **Cookie / storage notice** — auth tokens and PII live in `localStorage`. EU users need a banner or in-app disclosure.
- **GDPR Article 17 — Right to erasure** — a "Delete my account" button in `/account-security`. Must delete the `auth.users` row (cascades to `profiles`) and clear `localStorage`.
- **GDPR Article 20 — Right to portability** — a "Download my data" button that exports the `profiles` row + `lessonsCompleted`/`xp`/`dahab`/`streak` from `localStorage` as JSON.

Stub routes can be `/privacy`, `/terms`. Hardcoded markdown is fine — these don't need to live in the admin panel.

### 1.2 iPhone PWA audio smoke test
You haven't validated audio on a real iPhone home-screen install. Howler handles most of it, but iOS Safari has known traps:
- First playback after fresh install sometimes fails silently (gesture requirement).
- Standalone-mode autoplay differs from in-Safari behavior.
- Background-tab behavior differs.

Run this on a real iPhone before launch:
1. Add to home screen, open from icon (standalone mode).
2. Play lesson 1 audio — should fire on tap, no delay.
3. Background the app, return — audio should still work.
4. Force-quit, reopen, play audio first thing — most likely failure point.
5. Test on iOS Safari (not standalone) too — different audio context.

If audio fails, lessons fail. There is no text-only fallback today.

### 1.3 UX walkthrough with 5 strangers
You haven't watched anyone use the app. Pre-launch, sit 5 people down (mix Somali speakers and English speakers) and watch silently. Bias towards thumbs-and-eyeballs feedback, not opinions:
- Do they finish onboarding or bail?
- Do they find the language toggle in Astaanta?
- Do the 6 practice features feel distinct or blurred?
- Does the streak modal feel celebratory or annoying?

This is the cheapest insight you'll ever get.

---

## §2 — Post-launch month 1 (hand to senior engineer)

These don't block launch but should be the engineer's first sprint. Each is documented in code where relevant.

### 2.1 Consolidate the two streak systems
`src/utils/streak.js` and `src/utils/storage.js` both write streak state to different localStorage keys (`hadaling-streak` vs `hadaling:state`). Documented in the file headers and `ARCHITECTURE.md §8`. They will drift in edge cases. Consolidate into a single source of truth.

### 2.2 Offline indicator + write queue
Service worker caches lessons + audio, but:
- No "you're offline" UI.
- Profile/progress writes silently fail when offline.
- No retry queue when connection returns.
Matters more than usual because the audience includes Somalis on patchy internet.

### 2.3 Account recovery when email is lost
No backup codes, no security questions. If a user loses email access they're locked out forever. Today: requires manual Supabase admin work. Add a recovery flow.

### 2.4 Admin panel localization
`src/admin/*` is English-only. Probably fine while you're the only admin, but if you ever onboard a Somali content editor, this needs translating.

### 2.5 Supabase error translation
Login/signup got friendly Somali messages, but other surfaces (account-security, profile-edit, password reset) still pass raw English Supabase errors to the user.

### 2.6 Date format localization
`new Date().toISOString()` everywhere. Should use the user's locale for display. Storage format can stay ISO.

### 2.7 Diaspora phone validation
Placeholder `+252 61 XXX XXXX` is Somali-only. Many users will be in US/UK/Canada. Either accept any E.164 or detect locale and adjust.

### 2.8 Split Onboarding.jsx
Single oversized file. Low priority but flagged in earlier review.

### 2.9 Extract shared input components
Signup/Login/ForgotPassword/ResetPassword/ProfileEdit duplicate input field markup. Pull into a single `<TextField />` once the engineer has touched all five.

### 2.10 Enable Sentry account
Code is wired and env-gated. Sign up for Sentry, drop the DSN in Vercel env as `VITE_SENTRY_DSN`, redeploy. Errors start flowing immediately.

---

## §3 — Bugs to investigate (may already be broken)

Not confirmed broken — confirmed *unverified*. Each needs a 30-minute look before declaring fine.

### 3.1 Weak chunks adaptation
`storage.js` tracks `chunkStats` and `weakChunks`, but I never confirmed the daily practice algorithm actually uses them to bias selection. May be cosmetic. Trace from `chunkStats` write → daily mix selection.

### 3.2 lessonData.js drift
`src/data/lessonData.js` is the hardcoded fallback for offline-first-load. If admin edits in Supabase drift far from this file, returning users on flaky connections see stale lessons. Either: (a) periodically regenerate the fallback from the DB, or (b) version the fallback and force-fetch when stale.

### 3.3 Storage update races
Pattern `storage.update({ x: storage.get().x + 1 })` is everywhere. Sync today (localStorage). The day someone migrates to IndexedDB, every one of these races. Add a comment to `storage.js` warning, or refactor to atomic increments.

### 3.4 dailyMix timezone edges
Daily reset uses local-date strings. User flying across timezones (or DST changes) may double-claim a daily reward or skip a day. Verify with a test that mocks `Date`.

### 3.5 Daily practice "fresh" detection
`yaabViewedDate` is in storage but I never traced its actual gating logic. May fire stale.

---

## §4 — Future-product roadmap (not blockers)

Things that would make Hadaling a stronger product but are explicitly *not* needed for launch. Don't let them sneak into scope.

- **Web push notifications** for streak reminders. iOS 16.4+ supports it for PWAs.
- **Share button** for streak/milestone — free virality.
- **Leaderboard / friends** — single biggest engagement multiplier in language apps.
- **Spaced repetition** for vocabulary using `chunkStats` as the scheduling signal.
- **Pronunciation practice** via Web Speech API.
- **Daily streak email** for users about to break their streak.
- **A/B testing infrastructure** — once you have users, you'll want to test copy and pricing variants.
- **Real payments** — replace the "Coming soon" toast in `UpgradePage.jsx` with Stripe or RevenueCat.
- **CI/CD** — GitHub Actions running `npm test` + `npm run build` on every PR.
- **Branch protection** — require passing CI before merging to `main`.
- **Staging environment** — separate Vercel project + Supabase project for pre-prod testing.

---

## §5 — Smoke test before pressing the relaunch button

Run these in order. If any fails, do not launch.

```bash
# 1. Tests pass
npm test

# 2. Build is clean
npm run build

# 3. Lint is clean
npm run lint

# 4. Bundle size hasn't regressed
# Compare dist/assets/index-*.js gzip size to last shipped release
ls -la dist/assets/index-*.js
```

Then, manually walk every flow on a real iPhone:

- [ ] Onboarding 0 → 5 → home
- [ ] Lesson 1 → 2 → 3 (guest mode)
- [ ] Lesson 4 → forced to /auth-gate
- [ ] Signup with new email → email confirmation link → /profile-setup/0
- [ ] Profile setup completes → /geel-world
- [ ] Lesson 4 plays after auth (audio works!)
- [ ] Daily practice (all 6 features)
- [ ] Streak shows correctly
- [ ] Edit profile → username, phone, city
- [ ] Forgot password flow end-to-end
- [ ] Change password from /account-security
- [ ] Sign out → redirected appropriately
- [ ] Delete account (once §1.1 is built) → user is fully gone
- [ ] Upgrade page shows "Coming soon" toast
- [ ] PWA install on iPhone home screen
- [ ] Audio plays first try after install

---

## §6 — When you reopen the codebase

Order of operations for the first session back:

1. Read `CLAUDE.md` — refresh on conventions.
2. Read this doc top-to-bottom.
3. `git log --oneline -20` — refresh on what shipped last.
4. `npm install && npm test && npm run build` — confirm dev environment still works.
5. Pick §1.1 (legal). It's the only blocker. Everything else can wait until after launch.

Don't try to do §2 work before launch. The whole point of shelving was to ship lean and harden after.
