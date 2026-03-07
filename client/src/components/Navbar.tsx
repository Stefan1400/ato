function Navbar() {
   return (
   <nav className='fixed left-0 top-0 w-screen h-16 px-6 border-b-1 border-[#2A2A2A] text-white z-[1000]'>
      <ul className='w-full h-full flex justify-between items-center border-none'>
         <li>
            <h1 className='text-[1.1rem] font-medium'>ato</h1>
         </li>
         <li>
            <div className='w-[35px] h-[35px] cursor-pointer flex justify-center items-center bg-[#373737] border-none rounded-full'>
               <span className='font-bold'>S</span>
            </div>
         </li>
      </ul>
   </nav>
  )
}

export default Navbar;