import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { storage } from './utils/storage';
import { supabase } from './utils/supabase';

// Core pages — loaded immediately
import Home from './pages/Home';
import GeelWorld from './pages/GeelWorld';

// Lazy-loaded pages — loaded on demand
const Onboarding = lazy(() => import('./pages/Onboarding'));
const LessonIntro = lazy(() => import('./pages/LessonIntro'));
const LessonPlay = lazy(() => import('./pages/LessonPlay'));
const LessonComplete = lazy(() => import('./pages/LessonComplete'));
const Astaanta = lazy(() => import('./pages/Astaanta'));
const Progress = lazy(() => import('./pages/Progress'));
const PracticeHub = lazy(() => import('./pages/PracticeHub'));
const PracticeSession = lazy(() => import('./pages/PracticeSession'));
const DailyPractice = lazy(() => import('./pages/DailyPractice'));
const About = lazy(() => import('./pages/About'));
const AuthGate = lazy(() => import('./pages/AuthGate'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const UpgradePage = lazy(() => import('./pages/UpgradePage'));
const AdminPage = lazy(() => import('./admin/AdminPage'));

const FREE_LESSON_LIMIT = 3;

function LessonGuard({ children }) {
  const { id } = useParams();
  const lessonId = parseInt(id, 10);
  if (Number.isFinite(lessonId) && lessonId > FREE_LESSON_LIMIT) {
    const { authComplete } = storage.get();
    if (!authComplete) return <Navigate to="/auth-gate" replace />;
  }
  return children;
}

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    storage.checkStreak();
    const onVisible = () => {
      if (document.visibilityState === 'visible') storage.checkStreak();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  // Handle email-confirmation return: when SIGNED_IN fires and we were awaiting
  // confirmation, create the profile row if missing and route to setup or home.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== 'SIGNED_IN' || !session) return;
      const state = storage.get();
      if (!state.awaitingEmailConfirmation) return;

      const userId = session.user.id;
      const email = session.user.email;
      const name = session.user.user_metadata?.name || state.pendingName || '';

      let { data: profile } = await supabase
        .from('profiles')
        .select('profile_complete, name')
        .eq('id', userId)
        .maybeSingle();

      if (!profile) {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ id: userId, name, profile_complete: false }, { onConflict: 'id' });
        if (upsertError) console.warn('Profile auto-create failed:', upsertError);
        profile = { profile_complete: false, name };
      }

      storage.update({
        awaitingEmailConfirmation: false,
        authComplete: true,
        userId,
        userEmail: email,
        userName: profile.name || name,
        profileComplete: profile.profile_complete || false,
        pendingEmail: null,
        pendingName: null,
      });

      navigate(profile.profile_complete ? '/home' : '/profile-setup/0');
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const state = storage.get();

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={
          state.onboardingComplete ? <Navigate to="/home" replace /> : <Navigate to="/onboarding/0" replace />
        } />
        <Route path="/onboarding/:step" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/lesson/:id" element={<LessonGuard><LessonIntro /></LessonGuard>} />
        <Route path="/lesson/:id/play" element={<LessonGuard><LessonPlay /></LessonGuard>} />
        <Route path="/lesson/:id/complete" element={<LessonComplete />} />
        <Route path="/auth-gate" element={<AuthGate />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile-setup/:step" element={<ProfileSetup />} />
        <Route path="/astaanta" element={<Astaanta />} />
        <Route path="/progress" element={<PracticeHub />} />
        <Route path="/progress/stats" element={<Progress />} />
        <Route path="/practice/daily" element={<DailyPractice />} />
        <Route path="/practice/:featureKey" element={<PracticeSession />} />
        <Route path="/about" element={<About />} />
        <Route path="/geel-world" element={<GeelWorld />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
