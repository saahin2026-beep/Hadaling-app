import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { storage } from './utils/storage';

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

function LessonGuard({ children }) {
  // Auth gate disabled for testing — all lessons accessible
  return children;
}

export default function App() {
  useEffect(() => { storage.checkStreak(); }, []);

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
