import { useState } from "react";

function Navbar() {

   const [menuOpen, setMenuOpen] = useState(false);

   return (
   <nav className='fixed left-0 top-0 w-screen h-16 px-6 border-b-1 border-[#2A2A2A] text-white z-[1000]'>
      <ul className='w-full h-full flex justify-between items-center border-none'>
         <li className="flex gap-6 items-center">
            <h1 className='text-[1.1rem] font-medium'>ato</h1>
         </li>

         <li>
            {!menuOpen && (
               <button onClick={() => setMenuOpen(true)}>
                  <svg width="24" height="15" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect width="24" height="2" rx="0.5" fill="#B6B6B6"/>
                     <rect y="13" width="24" height="2" rx="0.5" fill="#B6B6B6"/>
                  </svg>
               </button>
            )}

            {menuOpen && (
               <button onClick={() => setMenuOpen(false)}>
                  <svg width="24" height="15" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect width="19.4691" height="1" rx="0.454925" transform="matrix(0.719087 0.69492 -0.951834 0.306615 0.867188 0.0664062)" fill="#D9D9D9"/>
                     <rect width="19.4691" height="1" rx="0.454925" transform="matrix(0.719087 -0.69492 0.951834 0.306615 0 13.5273)" fill="#D9D9D9"/>
                  </svg>
               </button>
            )}
         </li>
      </ul>
   </nav>
  )
}

export default Navbar;