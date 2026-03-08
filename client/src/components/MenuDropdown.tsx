import { Link } from "react-router-dom"

function MenuDropdown() {
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
            <li>
              <span>Sign Out</span>
            </li>
            <li className='text-red-600 mt-65'>
              <span>Delete Account</span>
            </li>
         </ul>
      </nav>
    </div>
  )
}

export default MenuDropdown