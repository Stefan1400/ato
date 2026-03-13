import { Link } from "react-router-dom"
import { useLogout } from "../features/auth/useAuth"
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useContext } from "react";

function MenuDropdown() {
  const logoutMutation = useLogout();
  const { user } = useContext(AuthContext) as AuthContextType;

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className='w-screen h-screen z-1000 bg-[#151515] pt-20 text-white'>
      <nav className='mt-2'>
         <ul className='flex flex-col items-start gap-4 text-[1.4rem] font-light [&>li]:w-screen [&>li]:p-3 [&>li>span]:ml-4 [&>li>a]:ml-4'>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <span>My Sessions</span>
            </li>
            <li>
              <span>Change Password</span>
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