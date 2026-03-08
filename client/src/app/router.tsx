import { Routes, Route } from "react-router-dom";
import RegisterPage from "../features/auth/RegisterPage";
import LoginPage from "../features/auth/LoginPage";
import HomePage from "../pages/HomePage";

export function AppRouter() {
   return (
      <Routes>
         <Route path="/" element={<HomePage />} />
         <Route path="/signup" element={<RegisterPage />} />
         <Route path="login" element={<LoginPage />} />
      </Routes>
   );
};