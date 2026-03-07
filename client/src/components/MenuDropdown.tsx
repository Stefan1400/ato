function MenuDropdown() {
  return (
    <div className='w-screen h-screen z-1000 bg-[#151515] pt-20 pl-6 text-white'>
      <nav className='mt-2'>
         <ul className='flex flex-col items-start gap-7 text-[1.5rem] font-light'>
            <li>Home</li>
            <li>View Sessions</li>
            <li>Change Password</li>
            <li>Sign Out</li>
            <li className='text-red-600 mt-75'>Delete Account</li>
         </ul>
      </nav>
    </div>
  )
}

export default MenuDropdown