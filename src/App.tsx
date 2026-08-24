import ErrorBoundary from "@/components/layout/ErrorBoundary";
import PageWrapper from "@/components/layout/PageWrapper";
import AuthModal from "@/features/auth/AuthModal";
import ResetPassword from "@/features/auth/ResetPassword";
import Feed from "@/features/feed/Feed";
import Fixtures from "@/features/fixtures/Fixtures";
import Leaderboard from "@/features/leaderboard/Leaderboard";
import OnboardingModal from "@/features/onboarding/OnboardingModal";
import Profile from "@/features/profile/Profile";
import { Route, Routes } from "react-router-dom";
import UsernameSetupModal from "@/features/auth/UsernameSetupModal";

function App() {
  return (
    <ErrorBoundary>
      <AuthModal />
      <OnboardingModal />
      <UsernameSetupModal />

      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <PageWrapper>
              <Fixtures />
            </PageWrapper>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PageWrapper>
              <Leaderboard />
            </PageWrapper>
          }
        />
        <Route
          path="/feed"
          element={
            <PageWrapper>
              <Feed />
            </PageWrapper>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <PageWrapper>
              <Profile />
            </PageWrapper>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
