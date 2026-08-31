import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserRound } from "lucide-react";
import { useContext } from "react";
import { useCreateGuest } from "../features/auth/useAuth";
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useToast } from "../components/Toast";

const actionLinkClassName =
  "group flex w-full items-center justify-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#121212] px-5 py-4 text-base font-medium text-[#F5F5F5] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A1A1A] hover:cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A7BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70";

export default function WelcomePage() {
  const navigate = useNavigate();
  const createGuestMutation = useCreateGuest();
  const { setUser } = useContext(AuthContext) as AuthContextType;
  const { showToast } = useToast();

  const handleGuestContinue = () => {
    createGuestMutation.mutate(undefined, {
      onSuccess: (response) => {
        setUser(response.user);
        showToast({ type: "success", message: "Signed in as guest", duration: 3000 });
        navigate("/dashboard");
      },
      onError: () => {
        showToast({ type: "error", message: "Could not create a guest account. Please try again.", duration: 3000 });
      },
    });
  };

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

            <button
              type="button"
              onClick={handleGuestContinue}
              disabled={createGuestMutation.isPending}
              className={actionLinkClassName}
              aria-label='Create Guest'
            >
              <UserRound className="h-5 w-5" />
              <span>{createGuestMutation.isPending ? "Creating guest account..." : "Continue as Guest"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}