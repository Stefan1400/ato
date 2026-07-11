import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, PieChart } from "lucide-react";
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useLogout } from "../features/auth/useAuth";
import { useToast } from "./Toast";
import LoadingScreen from "./LoadingScreen";
import { HomeIcon, LockIcon } from "../assets/svgs";

type DesktopAccountDropdownProps = {
  toggleDeleteAccountPopup: () => void;
};

export default function DesktopAccountDropdown({ toggleDeleteAccountPopup }: DesktopAccountDropdownProps) {
  const logoutMutation = useLogout();
  const { user } = useContext(AuthContext) as AuthContextType;
  const isAuthenticated = Boolean(user);
  const isNormalUser = isAuthenticated && user?.account_type === "user";
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const displayName = user?.account_type === "guest"
    ? "Guest"
    : (user?.email ? user.email.split("@")[0]?.split(/[._\- ]/)[0] || "Guest" : "Guest");
  const formattedDisplayName = displayName ? `${displayName.charAt(0).toUpperCase()}${displayName.slice(1)}` : "Guest";

  const closeDropdown = () => setOpen(false);
  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        try {
          showToast({ type: "success", message: "Logged out successfully", duration: 3000 });
        } catch (error) {
          console.error("Error during logout:", error);
        }
        closeDropdown();
        navigate("/");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        showToast({ type: "error", message: "Logout failed. Please try again.", duration: 3000 });
      }
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div ref={wrapperRef} className="hidden lg:block relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/5 hover:text-[#f4f4f4] cursor-pointer"
      >
        <span className="inline-flex h-4.5 w-4.5 rounded-full bg-orange-500" />
        <span>{formattedDisplayName}</span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-70 overflow-hidden rounded-xl border border-white/10 bg-[#090909]/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
          {logoutMutation.isPending && <LoadingScreen text="Signing out..." />}

          <div className="space-y-4 p-4">
            <nav className="space-y-2 text-sm text-white">
              <Link
                to="/dashboard"
                onClick={closeDropdown}
                className="group flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-white/5 cursor-pointer"
              >
                <HomeIcon />
                <span>Home</span>
              </Link>

              <Link
                to="/analytics"
                onClick={closeDropdown}
                className="group flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-white/5 cursor-pointer"
              >
                <PieChart className="h-4 w-4 text-white" />
                <span>Analytics</span>
              </Link>

              {isNormalUser && (
                <Link
                  to="/change-password"
                  onClick={closeDropdown}
                  className="group flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-white/5 cursor-pointer"
                >
                  <LockIcon />
                  <span>Change Password</span>
                </Link>
              )}
            </nav>

            <div className="border-t border-white/10 pt-4">
              {isNormalUser ? (
                <>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-[#111111] px-4 py-3 text-sm text-white transition hover:bg-[#1a1a1a] border border-white/10 cursor-pointer"
                  >
                    Sign Out
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleDeleteAccountPopup();
                      closeDropdown();
                    }}
                    className="mt-3 w-full rounded-lg bg-[#170606] px-4 py-3 text-sm font-semibold text-[#ff8f8f] transition hover:bg-[#220b0b] border border-[#650000] cursor-pointer"
                  >
                    Delete Account
                  </button>
                </>
              ) : (
                <div className="grid gap-3">
                  <Link
                    to="/signup"
                    onClick={closeDropdown}
                    className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f3f3f3] cursor-pointer"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={closeDropdown}
                    className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white transition hover:border-white/20 hover:bg-[#1a1a1a] cursor-pointer"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}