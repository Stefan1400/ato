import { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import RegisterPage from "../features/auth/RegisterPage";
import LoginPage from "../features/auth/LoginPage";
import HomePage from "../pages/HomePage";
import AnalyticsPage from "../features/analytics/AnalyticsPage";
import ChangePasswordPage from "../features/auth/changePassword/ChangePasswordPage";
import { AuthContext } from "./AuthProvider";
import LoadingScreen from "../components/LoadingScreen";
import WelcomePage from "../pages/WelcomePage";
import NotFoundPage from "../pages/NotFoundPage";

function WelcomeRoute({ children }: { children: React.ReactNode }) {
   const auth = useContext(AuthContext);

   if (!auth) return null;
   if (auth.isLoading) return <LoadingScreen text="Loading..." />;

   if (auth.user) {
      return <Navigate to="/dashboard" replace />;
   }

   return children;
}

function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
   const auth = useContext(AuthContext);
   const location = useLocation();

   if (!auth) return null;
   if (auth.isLoading) return <LoadingScreen text="Loading..." />;

   if (auth.user) {
      const allowedGuestPaths = ['/signup', '/login'];

      if (auth.user.account_type === 'guest' && allowedGuestPaths.includes(location.pathname)) {
         return children;
      }

      return <Navigate to="/dashboard" replace state={{ from: location }} />;
   }

   return children;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
   const auth = useContext(AuthContext);

   if (!auth || auth.isLoading) {
      return <LoadingScreen text="Loading..." />;
   }

   if (!auth.user) {
      return <Navigate to="/" replace />;
   }

   return children;
}

export function AppRouter() {
   return (
      <Routes>
         <Route path="/" element={
            <WelcomeRoute>
               <WelcomePage />
            </WelcomeRoute>
         } />
         <Route path="/dashboard" element={
            <ProtectedRoute>
               <HomePage />
            </ProtectedRoute>
         } />
         <Route path="/signup" element={
            <GuestOnlyRoute>
               <RegisterPage />
            </GuestOnlyRoute>
         } />
         <Route path="/login" element={
            <GuestOnlyRoute>
               <LoginPage />
            </GuestOnlyRoute>
         } />
         <Route path="/analytics" element={
            <ProtectedRoute>
               <AnalyticsPage />
            </ProtectedRoute>
         } />
         <Route path="/change-password" element={
            <ProtectedRoute>
               <ChangePasswordPage />
            </ProtectedRoute>
         } />
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
   );
};