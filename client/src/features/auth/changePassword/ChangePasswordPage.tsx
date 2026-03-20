function ChangePasswordPage() {
  return (
    <div className='w-screen h-screen bg-[#151515] text-white flex flex-col items-center px-6 pt-21'>
      <main className='text-white w-screen h-screen flex p-4 flex-col items-center gap-5'>
         <header>
            <h1 className='text-3xl font-normal text-white text-center mt-10'>Change Password</h1>
            <p>Password must be 8-64 characters</p>
         </header>

         <form noValidate className='flex w-screen flex-col justify-between items-center gap-3'>
            <div className="w-screen flex flex-col mt-2 mb-2 items-center">
               <label 
                  className='text-white flex flex-col gap-3 p-3 text-sm' 
                  htmlFor="current-password">Current password

                  <input 
                     className='border-2 border-[#3C3C3C] rounded-xs px-2 h-[35px] w-[285px]' 
                     type="password"
                     placeholder='Current password' 
                  />
               </label>
               
               <label 
                  className='text-white flex flex-col gap-3 p-3 relative text-sm' 
                  htmlFor="password">New password
                  
                  <div className="relative w-[285px]">
                     <input 
                        className=' border-2 border-[#3C3C3C] rounded-xs h-[35px] w-[285px] pr-10 pl-2' 
                        type="password"
                        placeholder='New password'
                     />
                  </div>
               </label>
               <label 
                  className='text-white flex flex-col gap-3 p-3 relative text-sm' 
                  htmlFor="password">Confirm new password
                  
                  <div className="relative w-[285px]">
                     <input 
                        className=' border-2 border-[#3C3C3C] rounded-xs h-[35px] w-[285px] pr-10 pl-2' 
                        type="password"
                        placeholder='Confirm new password'
                     />
                  </div>
               </label>
            </div>
            <button type="submit" className="w-[285px] h-[32px] bg-[#D60000]">Change Password</button>
         </form>
      </main>
   </div>
  )
}

export default ChangePasswordPage;