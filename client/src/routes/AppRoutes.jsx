import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../layouts/AppLayout";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

import { HomePage } from "../pages/Home";
import { MatchDetailsPage } from "../pages/MatchDetails";
import { MatchesPage } from "../pages/Matches";
import { ProfilePage } from "../pages/Profile";
import { ResultsPage } from "../pages/Results";
import { StandingsPage } from "../pages/Standings";
import AdminDashboard from "../pages/AdminDashboard";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-app-bg text-app-primary"><div className="animate-spin rounded-full h-10 w-10 border-4 border-app-primary border-t-transparent"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-app-bg text-app-primary"><div className="animate-spin rounded-full h-10 w-10 border-4 border-app-primary border-t-transparent"></div></div>;
  if (user) return <Navigate to="/app" replace />;
  return children;
};

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected App Routes */}
        <Route path="/app" element={<ProtectedRoute><AppLayout><PageTransition><HomePage /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/app/matches" element={<ProtectedRoute><AppLayout><PageTransition><MatchesPage /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/app/match/:id" element={<ProtectedRoute><AppLayout><PageTransition><MatchDetailsPage /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/app/results" element={<ProtectedRoute><AppLayout><PageTransition><ResultsPage /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/app/standings" element={<ProtectedRoute><AppLayout><PageTransition><StandingsPage /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/app/profile" element={<ProtectedRoute><AppLayout><PageTransition><ProfilePage /></PageTransition></AppLayout></ProtectedRoute>} />
        <Route path="/app/admin" element={<ProtectedRoute><AppLayout><PageTransition><AdminDashboard /></PageTransition></AppLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}