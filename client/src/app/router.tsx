import { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import RegisterPage from "../features/auth/RegisterPage";
import LoginPage from "../features/auth/LoginPage";
import HomePage from "../pages/HomePage";
import AnalyticsPage from "../features/analytics/AnalyticsPage";
import ChangePasswordPage from "../features/auth/changePassword/ChangePasswordPage";
import { AuthContext } from "./AuthProvider";
import LoadingScreen from "../components/LoadingScreen";

function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
   const auth = useContext(AuthContext);
   const location = useLocation();

   if (!auth) return null;
   if (auth.isLoading) return <LoadingScreen text="Loading..." />;

   if (auth.user) {
      return <Navigate to="/" replace state={{ from: location }} />;
   }

   return children;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
   const auth = useContext(AuthContext);

   if (!auth || auth.isLoading) {
      return <LoadingScreen text="Loading..." />;
   }

   if (!auth.user) {
      return <Navigate to="/login" replace />;
   }

   return children;
}

export function AppRouter() {
   return (
      <Routes>
         <Route path="/" element={<HomePage />} />
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
         <Route path="/analytics" element={<AnalyticsPage />} />
         <Route path="/change-password" element={
            <ProtectedRoute>
               <ChangePasswordPage />
            </ProtectedRoute>
         } />
      </Routes>
   );
};