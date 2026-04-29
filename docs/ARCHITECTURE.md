# Hadaling — Architecture

A single document explaining how the system fits together. Written for a new engineer's first 1–3 days. Read top-to-bottom or skim by section header.

---

## 1. What this is

Hadaling is a **Somali → English language-learning PWA**. Users get 10 main lessons (5 exercises each), 6 practice modes (60 exercises each), a daily mix, vocab word-of-the-day, and a streak system. Content is managed by an admin via a `/admin` panel.

It's a **client-only app**: there is no Node server. The browser talks directly to Supabase (a hosted Postgres + auth + storage service). Vercel serves the static bundle.

```
                   ┌──────────────┐
                   │   Browser    │  React + Vite static bundle
                   │  (Hadaling)  │  served by Vercel
                   └──────┬───────┘
                          │  https
            ┌─────────────┼──────────────┐
            ▼             ▼              ▼
      ┌──────────┐  ┌──────────┐  ┌────────────────┐
      │ Supabase │  │  Vercel  │  │  Vercel        │
      │ (Postgres│  │ Analytics│  │  Speed Insights│
      │  + Auth) │  │          │  │                │
      └──────────┘  └──────────┘  └────────────────┘
```

There is no Node API layer. RLS policies in Postgres enforce who can read/write what. The browser holds the anon key (public by design); the admin authenticates via Supabase Auth and gets elevated privileges via JWT email match in RLS rules.

## 2. Tech stack

| Layer | What we use |
|---|---|
| Frontend framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Inline styles + Tailwind utilities (rare) |
| Icons | Phosphor Icons (`weight="fill"` always) |
| Audio | Howler.js |
| State (server) | Supabase |
| State (client) | `localStorage` via `src/utils/storage.js` wrapper, plus React Context |
| Auth | Supabase Auth (email + password, custom Gmail SMTP) |
| Tests | Vitest + React Testing Library |
| Analytics | Vercel Analytics + Speed Insights (free tier) |
| Error tracking | Custom `client_errors` Supabase table; Sentry-ready (env-gated) |
| Hosting | Vercel |
| PWA | `vite-plugin-pwa` + custom `public/sw.js` |

## 3. Top-level data flow (admin → user)

This is the most important diagram in the system. When admin edits content, here's how it reaches a user.

```
1. Admin opens /admin → logs in via Supabase Auth
   (email match against ADMIN_EMAILS in src/admin/adminConfig.js
   triggers the "admin write" RLS policies on every content table)

2. Admin edits a lesson title and clicks SAVE
   → src/admin/LessonManager.jsx fires
       supabase.from('lessons').update({ title_so: ... }).eq('id', n)
   → Postgres receives the UPDATE
   → "admin write lessons" RLS policy passes (jwt email matches)
   → row updated; updated_at trigger fires; row stored

3. A user opens the app on their phone
   → src/main.jsx mounts <DataProvider> from src/utils/DataContext.jsx
   → useEffect calls fetchLessons(), fetchPhrases(), fetchPracticeFeatures(),
     fetchOnboardingContent(), fetchProfileSetupContent()
   → each fetch hits Supabase, transforms snake_case columns to
     camelCase JS shape, caches to localStorage, sets state

4. All consumers read state via useData()
   → useData().lessonData, .practiceFeatures, .phrases, etc.
   → re-render with the admin's edit
```

**Latency:** admin's edit is visible to a user on their *next page load*, not in real time. Real-time would require Supabase Realtime channels — out of scope.

## 4. Authentication flow

The app has three identity states: **guest**, **awaiting confirmation**, and **authenticated**.

### 4.1 Signup

```
1. SignupPage.jsx submits supabase.auth.signUp({ email, password,
                                                 emailRedirectTo: '/profile-setup/0' })
2. With email confirmation enabled (Supabase Auth setting), the response
   has data.user but data.session === null.
3. We set storage.update({ awaitingEmailConfirmation: true,
                            pendingEmail: email, pendingName: name })
4. Show "check your email" screen.

5. User clicks the link in the email → lands on
   https://hadaling.vercel.app/profile-setup/0#access_token=...
6. supabase-js auto-detects the session in the URL hash,
   stores it in localStorage, fires SIGNED_IN.

7. App.jsx auth listener handles it:
   - If awaitingEmailConfirmation flag is set:
     - Ensure profiles row exists (handle_new_user trigger
       usually already created it, but we upsert defensively)
     - Sync storage with userId, userName, profileComplete
     - Clear awaitingEmailConfirmation flag
     - Navigate to /profile-setup/0 or /geel-world based on
       profile_complete
```

The `profile_setup_content` table drives the questions/copy on each setup screen. Field keys (`username`, `phone`, `birthday`, `city`) and validation rules are hardcoded in `ProfileSetup.jsx` — those are structural and tied to columns on the `profiles` table.

### 4.2 Login

`LoginPage.jsx` → `signInWithPassword` → on success, query the user's profile and route to `/geel-world` (if `profile_complete`) or `/profile-setup/0` otherwise. If Supabase returns "Email not confirmed", we surface that specific error.

### 4.3 Password reset

`ForgotPasswordPage` → `resetPasswordForEmail` → user clicks link → lands on `/reset-password` with a recovery session → `ResetPasswordPage` lets them set a new password via `updateUser({ password })`. The App.jsx listener has a `PASSWORD_RECOVERY` event branch that routes them there even if they hit the bare URL.

### 4.4 Logout

`AccountSecurityPage.jsx` calls `supabase.auth.signOut()` then `storage.reset()` then redirects to `/`.

### 4.5 Lesson gating

Lessons 1–3 are free for guests. Lesson 4+ requires `authComplete = true`. `LessonGuard` in `App.jsx` redirects unauth'd users to `/auth-gate`.

## 5. Storage layer

We use **two** persistence mechanisms:

### 5.1 `localStorage` (client-side state)

Wrapped by `src/utils/storage.js`. Single key: `hadaling:state`. One JSON blob holds:

- `onboardingComplete`, `intent`, `comfort` — onboarding answers
- `currentLesson`, `lessonsCompleted` — progression
- `xp`, `dahab`, `streak`, `longestStreak`, `lastActiveDate` — gamification
- `language` — `'so'` or `'en'`
- `authComplete`, `profileComplete`, `userId`, `userName`, `username` — identity
- `awaitingEmailConfirmation`, `pendingEmail`, `pendingName` — pending-confirmation flags
- `profileDraft` — work-in-progress profile fields between setup steps
- `dailyMix` — today's daily practice exercise list + progress
- `dailyStreak`, `lastDailyDate`, `longestDailyStreak` — daily streak

Always go through `storage.get()`, `storage.update()`, `storage.completeLesson()` etc. — never touch `localStorage` directly. The wrapper handles JSON serialization, defaults, and migration from a legacy `hadaling` key.

There are also a few independent localStorage keys for caches: `hadaling-data-cache`, `hadaling-phrases-cache`, `hadaling-practice-features-cache`, `hadaling-profile-setup-cache`, `hadaling-onboarding-cache`, `wotd_cache`, `hadaling-streak`. Those are managed by their respective fetch functions in `src/utils/dataService.js` and `src/utils/streak.js`.

### 5.2 Supabase Postgres

10 tables in `public.*` (see `supabase/migrations/20260429000000_baseline.sql` for the full schema). Schema and RLS are documented there.

Reading:
- `src/utils/dataService.js` — `fetchLessons`, `fetchPhrases`, `fetchOnboardingContent`, `fetchPracticeFeatures`, `fetchProfileSetupContent`
- `src/data/wordOfTheDay.js` — `fetchDailyWords`
- All consumer pages call these via `useData()` from `DataContext`

Writing:
- All admin pages in `src/admin/*Manager.jsx`
- Profile-related writes in `src/pages/ProfileSetup.jsx`, `ProfileEditPage.jsx`, `LoginPage.jsx`
- Errors via `src/utils/observability.js` → `client_errors` table

## 6. Caching & cache invalidation

`DataContext` reads from cache instantly on first paint, then re-fetches from Supabase in `useEffect` and replaces state. This means:

- **First paint is instant** (cache or hardcoded fallback)
- **Fresh data arrives ~few hundred ms later** (Supabase round-trip)
- **All consumers re-render** when state updates

Cache versioning: each data type has a string version constant in `DataContext.jsx`. If you change the *shape* of stored data (add a required field, rename a key), bump the version. Users' stale caches get cleared on next mount.

```js
const CACHE_VERSION = 'v5';                       // lessons + exercises shape
const PHRASES_CACHE_VERSION = 'v1';
const PRACTICE_FEATURES_CACHE_VERSION = 'v1';
```

Bumping the version is the safe way to deploy a breaking shape change.

## 7. Exercise system — lessons vs practice

These are **two separate exercise systems that share components**:

### 7.1 Lesson exercises (`exercises` table)

- Used inside the 10 main lessons
- 5 types: `choose`, `fillgap`, `order`, `listen`, `scenario`
- Stored in `public.exercises` with FK to `public.lessons`
- Columns use Postgres arrays (`text[]`) for `options`, `sentence`, `words`
- Admin tab: **Lessons** → click a lesson → Exercises panel
- Read by: `LessonPlay.jsx` via `useData().lessonData[id].exercises`

### 7.2 Practice exercises (`practice_exercises` table)

- Used inside the 6 practice modes (vocabulary, plurals, etc.)
- Same 5 types plus `scramble` and `sentenceBuilder`
- Stored in `public.practice_exercises` with FK to `public.practice_features`
- Columns use `jsonb` for `options`, `sentence`, `pieces`, `words`, `distractors`
- Admin tab: **Practice** → click a feature → Exercises list
- Read by: `PracticeSession.jsx` via `useData().practiceFeatures[key].exercises`

**Why two tables?** Historical — they were seeded separately and have different field semantics. Practice exercises support optional fields (`somali_full`, `distractors`, `hint`, `mode`) that lesson exercises don't need. The data-type drift (`text[]` vs `jsonb`) is a known inconsistency from earlier; not worth a destructive migration.

**The transformation layer:** `dataService.js` converts DB-side `snake_case` (e.g. `correct_index`, `chunk_id`, `correct_answer`) to JS-side `camelCase` (`correctIndex`, `chunkId`, `answer`). The exercise components only see camelCase. Field-name mappings are documented in the function.

## 8. Gamification — XP, dahab, streak

Three currencies, all client-side tracked:

- **XP** — gained from completing exercises (+10 per correct in lessons, scaled in practice). Display only; no spend mechanic.
- **Dahab** — earned from lesson completion (default 5/lesson) and daily mix tier bonuses. Spend mechanic: streak freezes (50 dahab each).
- **Streak** — consecutive days with at least one lesson completed. Resets if a day is missed unless a freeze is consumed.

Two streak systems coexist (a known TODO):
- `src/utils/storage.js` `completeLesson` / `checkStreak` — the simple system used by lessons
- `src/utils/streak.js` `getStreakData` / `recordLessonCompletion` — a richer system with milestones, freezes, and XP multipliers, used by GeelWorld and AppShell modals

Don't mix them in new code; pick one. Long-term cleanup is to consolidate.

Daily mix logic lives in `src/utils/dailyMix.js`. It picks 15 exercises from completed lessons, weighted 40% weak chunks / 40% recent / 20% decayed. The lesson data passed in must come from `useData()` (live Supabase content), not the hardcoded fallback — `DailyPractice.jsx` does this.

## 9. Service worker / PWA

`public/sw.js` precaches the app shell + 140 audio files. Cache name embeds the git SHA so each deploy invalidates the previous service worker (`scripts/inject-sw-version.mjs` runs in `npm run build`).

Cache strategy:
- `/audio/*` — cache-first, fall back to network, return empty 404 if both fail
- `/assets/*.js`, `/assets/*.css` — cache-first (filenames are content-hashed by Vite, so a new deploy always has new filenames)
- Navigation requests — network-first, fall back to cached `/index.html` for offline

The PWA manifest (`public/manifest.json`) defines the home-screen icon, splash background color (`#17B5D2` to match the icon), and "standalone" display mode.

The iOS install banner (`src/components/IOSInstallPrompt.jsx`) detects iOS Safari + non-standalone and shows a one-tap "use Hadaling from your home screen" hint. Doesn't auto-install (Apple doesn't expose the API for PWAs).

## 10. Observability

Three layers:

### 10.1 Vercel Analytics

`@vercel/analytics` mounted as a component in `main.jsx`. Auto-tracks page views, web vitals, device/browser. Custom events are tracked via `trackEvent()` in `src/utils/observability.js`. Events fire at every funnel choke point: `onboarding_step_viewed`, `signup_submitted`, `email_confirmed`, `lesson_started`, `lesson_completed`, `daily_practice_started`, `daily_practice_completed`, `upgrade_page_viewed`, etc.

### 10.2 Vercel Speed Insights

`@vercel/speed-insights` mounted alongside Analytics. Auto-tracks Core Web Vitals (LCP, INP, CLS) per page. No custom code needed.

### 10.3 Error reporting

`reportError(err, context)` in `src/utils/observability.js` does two things:

- If `VITE_SENTRY_DSN` is set in the build env, captures via Sentry
- Always also writes to `public.client_errors` Supabase table as a fallback

Errors are deduped per session and capped at 20/session to avoid spam. PII (emails, JWTs, long opaque tokens) is scrubbed before persisting.

`ErrorBoundary` (`src/components/ErrorBoundary.jsx`) catches uncaught render errors and reports them. Throughout the codebase, any `try/catch` that previously did `console.warn(...)` was converted to `reportError(...)` because Vite strips `console.*` in production builds (would otherwise vanish).

To browse errors:

```sql
select * from client_errors
where created_at > now() - interval '24 hours'
  and environment = 'production'
order by created_at desc;
```

## 11. Admin panel scope

`/admin` is password-gated (Supabase Auth, admin email matched in `src/admin/adminConfig.js` and in every RLS policy). Tabs:

- **Lessons** — edit lesson titles, ability tag, explanation, chunks. Click a lesson to edit its 5 exercises.
- **Phrases** — feedback / encouragement / celebration text.
- **Word of Day** — daily vocab.
- **Onboarding** — copy for the 6 onboarding screens.
- **Practice** — feature card content + per-feature exercises.
- **Profile Setup** — copy for the 4 profile setup screens.

**Editable from admin:** any educational content (titles, prompts, options, descriptions, audio mappings, sort order, is_active flag).

**NOT editable from admin** (intentionally — design must stay uniform):
- Card colors, backgrounds, icons
- Button styles, layouts, animations
- Profile setup field types (text/date/select), validation rules, icon mapping
- Onboarding flow ordering
- Geel mascot variants

If a new field needs to be admin-editable, add it to the relevant `*Manager.jsx` and surface it in `dataService.js`'s transformation. If it's a UI/design thing, hardcode it in the component.

## 12. Testing strategy

- **Unit tests** for utilities with non-trivial logic: `storage.js`, `streak.js`, `speedScore.js`, `shuffleOptions.js`, `observability.js`.
- **Component tests** for the auth/identity surface: `SignupPage`, `LoginPage`, `ProfileSetup`, `ProfileEditPage`, `AccountSecurityPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `AuthGate`, `Onboarding`, `LessonComplete`, `App.jsx auth listener`.
- **One exercise test** (`ChooseExercise`) covers the dispatch + correctness pattern shared across exercise components.
- Two regression tests pin the previously-fixed bugs: ProfileSetup data loss + DailyPractice dahab double-count.

121 tests total. Run with `npm test`. The Node 25 + happy-dom localStorage shim lives in `vitest.setup.js` (Node ships an experimental localStorage stub that overrides happy-dom's; the shim restores a working in-memory implementation).

## 13. Common pitfalls / gotchas

Quick reference for things that have bitten us:

- **Don't bypass `storage`**. Always use `storage.get()` / `storage.update()`. Direct `localStorage.setItem` skips the migration logic and JSON serialization.
- **Don't add `console.log` and expect it to ship**. Vite drops `console.*` in production builds (`vite.config.js` esbuild drop). Use `reportError()` for errors that matter.
- **Bump cache versions** in `DataContext.jsx` when you change the *shape* of fetched data. Otherwise users with stale caches see broken UI.
- **Profile setup steps are content-driven now.** `ProfileSetup.jsx` reads from `useData().profileSetupContent` if available, falls back to translation keys. The 4 step keys (`username`, `phone`, `birthday`, `city`) are hardcoded — they map 1:1 to columns in the `profiles` table and changing them requires a schema change.
- **Two streak systems exist.** Pick one; long-term cleanup is to consolidate.
- **The exercises ↔ practice_exercises drift** (`text[]` vs `jsonb`) is intentional and stable. Don't try to unify it without a real reason.
- **Admin email is hardcoded** in RLS policies AND in `src/admin/adminConfig.js`. Changing it requires both updates.
- **Email confirmation redirect URLs** must be in Supabase's allowed Redirect URLs list (Authentication → URL Configuration). Use `https://hadaling.vercel.app/**` (wildcard) so deep paths like `/profile-setup/0` work.
- **`localStorage` is the source of truth for client state.** Server-side data lives in Supabase; client-only progress (XP, streak) lives in localStorage. Be careful when wiping it (account deletion, "reset progress").
- **The PWA service worker is aggressive.** When you ship a new version, users on the old service worker see stale content until the SW updates. We mitigate by including the git SHA in the cache name; new deploys force a refresh.

---

## File map (quick reference)

```
src/
├── App.jsx                       # routes + LessonGuard + auth listener
├── main.jsx                      # bootstraps the app, mounts Analytics
│
├── components/                   # reusable UI
│   ├── AppShell.jsx              # streak modals, IOSInstallPrompt mount
│   ├── BottomNav.jsx             # bottom navigation bar
│   ├── ErrorBoundary.jsx         # catches render errors → reportError
│   ├── Toast.jsx                 # ephemeral notification component
│   ├── *Modal.jsx                # streak / freeze / milestone modals
│   ├── ProfilePopup.jsx          # tap-name-to-see profile mini view
│   └── IOSInstallPrompt.jsx      # iOS Safari "Add to Home Screen"
│
├── exercises/                    # the 7 exercise components
│   └── *Exercise.jsx             # lesson + practice exercise types
│
├── pages/                        # route-level components
│   ├── Onboarding.jsx            # 6 onboarding screens
│   ├── Home.jsx                  # lesson list
│   ├── GeelWorld.jsx             # daily / streak / WOTD landing
│   ├── LessonIntro|Play|Complete.jsx
│   ├── PracticeHub|Session.jsx
│   ├── DailyPractice.jsx
│   ├── Astaanta.jsx              # profile + settings
│   ├── AuthGate|SignupPage|LoginPage.jsx
│   ├── ForgotPasswordPage|ResetPasswordPage.jsx
│   ├── ProfileSetup|ProfileEditPage|AccountSecurityPage.jsx
│   ├── UpgradePage.jsx           # stub today (no payment integration)
│   └── About.jsx
│
├── admin/                        # /admin panel — password-gated
│   ├── AdminPage.jsx             # session check + dashboard mount
│   ├── AdminAuth.jsx             # login form
│   ├── AdminDashboard.jsx        # tab container
│   └── *Manager.jsx              # one per content table
│
├── utils/
│   ├── DataContext.jsx           # hydrates from cache, syncs from Supabase
│   ├── dataService.js            # all Supabase fetch functions
│   ├── storage.js                # localStorage wrapper
│   ├── streak.js                 # streak / milestones / freezes
│   ├── speedScore.js             # dahab + speed math
│   ├── shuffleOptions.js         # pure function — preserve correctIndex
│   ├── dailyMix.js               # 15-exercise daily picker
│   ├── audio.js                  # Howler.js wrapper with LRU cache
│   ├── observability.js          # tracking + error reporting
│   ├── translations.js           # all i18n strings (~250 keys × 2 langs)
│   ├── useLanguage.js            # hook: lang + setLang + t()
│   ├── useFocusTrap.js           # hook: keyboard focus trap for modals
│   └── supabase.js               # createClient(URL, KEY)
│
└── data/
    ├── lessonData.js             # hardcoded fallback for lessons
    ├── practiceFeatures.js       # hardcoded fallback for practice
    ├── phrases.js                # hardcoded fallback for phrases
    ├── lessons.js                # lesson list summary for Home
    ├── somaliCities.js           # 27 Somali cities (city dropdown)
    ├── wordOfTheDay.js           # WOTD fetch + sync helpers
    └── dailyFacts.js             # GeelWorld fact-of-the-day

supabase/
├── migrations/                   # version-controlled DB schema
│   ├── 20260429000000_baseline.sql
│   ├── 20260429000001_seed_profile_setup.sql
│   └── 20260429000002_seed_practice_feature_descriptions.sql
└── README.md                     # migration workflow

public/
├── sw.js                         # service worker
├── manifest.json                 # PWA manifest
└── audio/                        # 140 lesson + WOTD audio files

scripts/
└── inject-sw-version.mjs         # sets cache name to git SHA at build
```

---

## Where to make changes for common tasks

| Task | Where |
|---|---|
| Add a new lesson | `/admin` UI; no code |
| Edit lesson exercise content | `/admin` UI; no code |
| Add a new exercise *type* | `src/exercises/NewExercise.jsx` + `LessonPlay.jsx` switch + DB CHECK constraint |
| Change profile setup question text | `/admin` UI → Profile Setup tab |
| Add a new profile setup *field* | DB schema change + `ProfileSetup.jsx` STEP_CONFIGS + admin migrator + `profiles` table column |
| Change app colors / icons | Hardcoded in components — design is locked |
| Add a translation string | `src/utils/translations.js` (both `so` and `en`) |
| Add a tracked event | `trackEvent('event_name', { props })` from `src/utils/observability.js` |
| Add a DB column | New migration in `supabase/migrations/`, run in Supabase editor, update `dataService.js` transform |
| Change admin email | Update `src/admin/adminConfig.js` AND every RLS policy in DB |

For anything not on this list, ask before guessing.
