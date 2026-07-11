import { Link } from "react-router-dom";
import { AuthContext } from "../app/AuthProvider";
import { useContext } from "react";
import { X, LucideMenu } from "lucide-react";
import DesktopAccountDropdown from "./DesktopAccountDropdown";

interface NavbarProps {
   toggleMenu: () => void;
   menuOpen: boolean;
   toggleDeleteAccountPopup: () => void;
};

function Navbar({ toggleMenu, menuOpen, toggleDeleteAccountPopup }: NavbarProps) {
   const auth = useContext(AuthContext);
   const isAuthenticated = Boolean(auth?.user);
   const displayName = auth?.user?.account_type === 'guest'
      ? 'Guest'
      : (auth?.user?.email || 'Guest');

   return (
      <nav className='fixed left-0 top-0 w-full h-16 px-4 lg:px-6 text-white z-1000 border-b border-[#2E2E2E] bg-[#090909]/95 backdrop-blur-sm'>
         <div className='flex h-full w-full items-center justify-between'>
            {!menuOpen ? (
               <Link to={isAuthenticated ? '/dashboard' : '/'} className='text-[1.1rem] font-semibold tracking-[0.08em] lowercase text-white hover:text-[#f4f4f4]'>
                  ato
               </Link>
            ) : (
               <span className='font-medium text-white truncate max-w-45'>{displayName}</span>
            )}
            

            <div className='flex items-center gap-4'>
               {auth?.user?.account_type === 'user' && (
                  <DesktopAccountDropdown toggleDeleteAccountPopup={toggleDeleteAccountPopup} />
               )}

               <button
                  onClick={toggleMenu}
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-[#2E2E2E] bg-[#111111] text-[#b6b6b6] transition-colors duration-200 hover:border-[#3e3e3e] hover:text-white lg:hidden'
                  aria-label='Toggle menu'
               >
                  {menuOpen ? (
                     <X size={24} />
                  ) : (
                     <LucideMenu size={24} />
                  )}
               </button>
            </div>
         </div>
      </nav>
   )
}

export default Navbar;