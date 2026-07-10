import { Link } from "react-router-dom";
import { LogIn, UserRound } from "lucide-react";

const actionLinkClassName =
  "group flex w-full items-center justify-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#121212] px-5 py-4 text-base font-medium text-[#F5F5F5] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A1A1A] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A7BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] active:translate-y-0";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090909] px-6 py-25 text-white sm:px-8 lg:px-10">
      <div className="w-full max-w-xl rounded-[28px] border border-[#2A2A2A] bg-[#090909] p-8 py-20 shadow-[0_16px_60px_rgba(0,0,0,0.35)] sm:p-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Welcome to ato</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-[#A8A8A8] sm:text-lg">
            Log into an existing account or continue as guest
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:gap-4">
            <Link to="/login" className={actionLinkClassName}>
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>

            <Link to="/dashboard" className={actionLinkClassName}>
              <UserRound className="h-5 w-5" />
              <span>Continue as Guest</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}