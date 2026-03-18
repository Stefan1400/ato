import { Link } from "react-router-dom"
import { useLogout } from "../features/auth/useAuth"
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useContext } from "react";
import LoadingScreen from "./LoadingScreen";
import { HomeIcon, SessionsIcon, LockIcon } from "../assets/svgs";
import { useNavigate } from "react-router-dom";

type MenuDropdownTypes = {
  toggleMenu: () => void;
  menuOpen: boolean;
  toggleDeleteAccountPopup: () => void;
};

function MenuDropdown({ toggleMenu, menuOpen, toggleDeleteAccountPopup }: MenuDropdownTypes) {
  const logoutMutation = useLogout();
  const { user } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toggleMenu();
        navigate('/login');
      }
    });
  };
  
  return (
    <div className={`${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all ease-initial duration-150 opacity-0 w-screen fixed left-0 top-0 h-screen z-800 bg-[#151515] pt-20 text-white`}>
      {logoutMutation.isPending && (
        <LoadingScreen text="Signing out..."/>
      )}
      
      <nav className='mt-2'>
         <ul className='flex flex-col gap-1 items-start text-[1.25rem] font-light [&>li]:w-screen [&>li]:p-3 [&>li>span]:ml-4 [&>li>a]:ml-4'>
            <li onClick={toggleMenu}>
              <Link className="flex flex-row items-center gap-3" to='/'>
                <HomeIcon />
                <span>Home</span>
              </Link>
            </li>
            <li onClick={toggleMenu}>
              <Link className="flex flex-row items-center gap-3" to='/analytics'>
                <SessionsIcon />
                <span>My Sessions</span>
              </Link>
            </li>
            {user && (
              <li onClick={toggleMenu}>
                <Link className="flex flex-row items-center gap-3" to='/change-password'>
                  <LockIcon />
                  <span>Change Password</span>
                </Link>
              </li>
            )}
            {!user ? (
              <li onClick={toggleMenu} className="flex flex-col gap-5 items-center justify-center mt-3">
                <Link 
                  className="w-90 py-2.5 text-[1rem] text-center rounded-xs bg-[#D60000] text-white font-medium mr-3"
                  to='/signup'>
                    Sign Up
                </Link>
                <Link 
                  className="w-90 py-2.5 text-[1rem] text-center rounded-xs bg-[#121212] border-2 border-[#2E2E2E] mr-3"
                  to='/login'>
                    Sign In
                </Link>
              </li>
            ) : (
              <li>
                <button onClick={handleLogout} className="w-full py-3 text-[1rem] rounded-xs bg-[#121212] border-2 border-[#2E2E2E]">Sign Out</button>
              </li>
            )}
            {user && (
              <li className='text-red-600 mt-70 flex items-center justify-center'>
                <button 
                  onClick={toggleDeleteAccountPopup} 
                  className="w-90 py-2.5 text-[1rem] rounded-xs bg-[#1E0A0A] border-2 border-[#790000]">
                    Delete Account
                </button>
              </li>
            )}
         </ul>
      </nav>
    </div>
  )
}

export default MenuDropdown