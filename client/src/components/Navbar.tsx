import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../app/AuthProvider";
import { useContext } from "react";
import { X, LucideMenu } from "lucide-react";
import DesktopAccountDropdown from "./DesktopAccountDropdown";

interface NavbarProps {
   toggleMenu: () => void;
   menuOpen: boolean;
   toggleDeleteAccountPopup: () => void;
};

const primaryButtonClassName =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-white px-3 py-1.5 text-sm font-medium text-[#090909] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E5E5E5] hover:cursor-pointer hover:shadow-[0_10px_30px_rgba(255,255,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A7BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] active:translate-y-0 sm:px-4 sm:py-2 sm:text-base lg:px-4 lg:py-2";

  function Navbar({ toggleMenu, menuOpen, toggleDeleteAccountPopup }: NavbarProps) {
   const auth = useContext(AuthContext);
   const isAuthenticated = Boolean(auth?.user);
   const location = useLocation();
   const hideMenuToggle = !isAuthenticated && ['/', '/signup', '/login', '/get-started'].includes(location.pathname);
   const showGetStarted = !isAuthenticated && location.pathname === '/get-started';

   return (
      <nav className='fixed left-0 top-0 w-full h-16 px-4 lg:px-6 text-white z-1000 border-b border-[#2E2E2E] bg-[#090909]/95 backdrop-blur-sm'>
         <div className='flex h-full w-full items-center justify-between'>
            <Link to={isAuthenticated ? '/dashboard' : '/'} className='text-[1.1rem] font-semibold tracking-[0.08em] lowercase text-white hover:text-[#f4f4f4]'>
               ato
            </Link>
            

            <div className='ml-auto flex items-center gap-4'>
               {Boolean(auth?.user) && (
                  <DesktopAccountDropdown toggleDeleteAccountPopup={toggleDeleteAccountPopup} />
               )}

               {!hideMenuToggle && (
                  <button
                     onClick={toggleMenu}
                     className='flex h-10 w-10 items-center justify-center rounded-full border border-[#2E2E2E] bg-[#111111] text-[#b6b6b6] transition-colors duration-200 hover:border-[#3e3e3e] hover:text-white lg:hidden'
                     aria-label='Toggle Menu'
                  >
                     {menuOpen ? (
                        <X size={24} />
                     ) : (
                        <LucideMenu size={24} />
                     )}
                  </button>
               )}
            </div>
            
            {showGetStarted && (
               <Link to="/" className={`${primaryButtonClassName}`}>
                  Get Started
               </Link>
            )}
         </div>
      </nav>
   )
}

export default Navbar;