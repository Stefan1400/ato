import { Link } from "react-router-dom"
import { useLogout } from "../features/auth/useAuth"
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useContext } from "react";
import LoadingScreen from "./LoadingScreen";
import { HomeIcon, SessionsIcon, LockIcon } from "../assets/svgs";
import { useNavigate } from "react-router-dom";
import { useToast } from "./Toast";

type MenuDropdownTypes = {
  toggleMenu: () => void;
  menuOpen: boolean;
  toggleDeleteAccountPopup: () => void;
};

function MenuDropdown({ toggleMenu, menuOpen, toggleDeleteAccountPopup }: MenuDropdownTypes) {
  const logoutMutation = useLogout();
  const { user } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        try {
          console.log('User logged out successfully');
          showToast({ type: 'success', message: 'Logged out successfully', duration: 3000 });
        } catch (error) {
          console.error('Error during logout:', error);
        }
        toggleMenu();
        navigate('/login');
      },
      onError: (error) => {
        console.error('Logout failed:', error);
        showToast({ type: 'error', message: 'Logout failed. Please try again.', duration: 3000 });
      }
    });
  };
  
  return (
    <div className={`${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'} lg:hidden fixed inset-0 z-800`}>
      <div className={`${menuOpen ? 'opacity-100' : 'opacity-0'} absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200`} />

      <div className={`relative mx-4 mt-20 overflow-hidden rounded-[28px] border border-white/10 bg-[#090909]/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] transition-all duration-200 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0'}`}>
        {logoutMutation.isPending && (
          <LoadingScreen text="Signing out..." />
        )}

        <div className="px-6 py-5">
          <nav>
            <ul className="flex flex-col gap-2 text-sm text-white">
              <li onClick={toggleMenu}>
                <Link className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/5" to='/'>
                  <HomeIcon />
                  <span>Home</span>
                </Link>
              </li>
              <li onClick={toggleMenu}>
                <Link className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/5" to='/analytics'>
                  <SessionsIcon />
                  <span>My Sessions</span>
                </Link>
              </li>
              {user && (
                <li onClick={toggleMenu}>
                  <Link className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/5" to='/change-password'>
                    <LockIcon />
                    <span>Change Password</span>
                  </Link>
                </li>
              )}
            </ul>

            <div className="mt-5 border-t border-white/10 pt-5">
              {!user ? (
                <div onClick={toggleMenu} className="grid gap-3">
                  <Link className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f3f3f3]" to='/signup'>
                    Sign Up
                  </Link>
                  <Link className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white transition hover:border-white/20 hover:bg-[#1a1a1a]" to='/login'>
                    Sign In
                  </Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="w-full rounded-2xl bg-[#111111] px-4 py-3 text-sm text-white transition hover:bg-[#1a1a1a] border border-white/10">
                  Sign Out
                </button>
              )}

              {user && (
                <div className="mt-3">
                  <button
                    onClick={toggleDeleteAccountPopup}
                    className="w-full rounded-2xl bg-[#170606] px-4 py-3 text-sm font-semibold text-[#ff8f8f] transition hover:bg-[#220b0b] border border-[#650000]"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default MenuDropdown