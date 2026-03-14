import { Link } from "react-router-dom"
import { useLogout } from "../features/auth/useAuth"
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useContext } from "react";
import LoadingScreen from "./LoadingScreen";
import { HomeIcon, SessionsIcon, LockIcon } from "../assets/svgs";

function MenuDropdown() {
  const logoutMutation = useLogout();
  const { user } = useContext(AuthContext) as AuthContextType;
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className='w-screen h-screen z-1000 bg-[#151515] pt-20 text-white'>
      {logoutMutation.isPending && (
        <LoadingScreen text="Signing out..."/>
      )}
      
      <nav className='mt-2'>
         <ul className='flex flex-col items-start gap-4 text-[1.4rem] font-light [&>li]:w-screen [&>li]:p-3 [&>li>span]:ml-4 [&>li>a]:ml-4'>
            <li>
              <Link className="flex flex-row items-center gap-3" to='/'>
                <HomeIcon />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link className="flex flex-row items-center gap-3" to='/my-sessions'>
                <SessionsIcon />
                <span>My Sessions</span>
              </Link>
            </li>
            <li>
              <Link className="flex flex-row items-center gap-3" to='/change-password'>
                <LockIcon />
                <span>Change Password</span>
              </Link>
            </li>
            {!user ? (
              <li className="flex flex-col gap-5 items-center">
                <button className="w-90 py-2.5 text-[1rem] rounded-xs bg-white text-black font-medium">
                  <Link to='/signup'>Sign Up</Link>
                </button>
                
                <button className="w-90 py-2.5 text-[1rem] rounded-xs bg-[#121212] border-2 border-[#2E2E2E]">
                  <Link to='/login'>Sign In</Link>
                </button>
              </li>
            ) : (
              <li>
                <button onClick={handleLogout} className="w-full py-3 text-[1rem] rounded-xs bg-[#121212] border-2 border-[#2E2E2E]">Sign Out</button>
              </li>
            )}
            {user && (
              <li className='text-red-600 mt-65'>
                <span>Delete Account</span>
              </li>
            )}
         </ul>
      </nav>
    </div>
  )
}

export default MenuDropdown