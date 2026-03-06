import React, { useState } from "react";
import type { Errors } from './auth.types'; 

function LoginPage() {
  
   const [passwordHidden, setPasswordHidden] = useState(true);
   const [currentEmail, setCurrentEmail] = useState('');
   const [currentPassword, setCurrentPassword] = useState('');

   const [errors, setErrors] = useState<Errors>({});

   const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const newErrors = {
         email: '',
         password: '',
      };

      if (!currentEmail) {
         newErrors.email = 'Email is required';
      } else if (!EMAIL_REGEX.test(currentEmail)) {
         newErrors.email = 'Please enter a valid email address';
      };

      if (!currentPassword) {
         newErrors.password = 'Password is required';
      } else if (currentPassword.length < 8 || currentPassword.length > 64) {
         newErrors.password = 'Password must be 8-64 characters'
      };

      setErrors(newErrors);
   };
  
   return (
   <div className='w-screen h-screen bg-[#151515]'>
      <main className='text-white w-screen h-screen flex p-4 flex-col items-center gap-10'>
         <header className=''>
            <h1 className='text-4xl font-normal text-white text-center mt-27 mb-0'>Sign in</h1>
         </header>

         <form onSubmit={handleRegister} noValidate className='flex w-screen flex-col justify-between items-center gap-3 mt-4'>
            <div className="w-screen flex flex-col mt-2 mb-2 items-center">
               <label 
                  className='text-white flex flex-col gap-3 p-3 text-sm' 
                  htmlFor="email">Email

                  <input 
                     className={`${errors.email ? 'border-red-700' : 'border-[#3C3C3C]'} border-2 border-[#3C3C3C] rounded-xs px-2 h-[35px] w-[285px]`} 
                     type="email"
                     placeholder='email' 
                     value={currentEmail}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setCurrentEmail(e.target.value)
                     }
                  />
                  {errors.email && (
                     <span className="text-xs font-extralight text-red-500">{errors.email}</span>
                  )}
               </label>
               
               <label 
                  className='text-white flex flex-col gap-3 p-3 relative text-sm' 
                  htmlFor="password">Password
                  
                  <div className="relative w-[285px]">
                     <input 
                        className={`${errors.password ? 'border-red-700' : 'border-[#3C3C3C]'} border-2 border-[#3C3C3C] rounded-xs h-[35px] w-[285px] pr-10 pl-2`} 
                        type={passwordHidden ? 'password' : 'text'}
                        placeholder='password'
                        value={currentPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                           setCurrentPassword(e.target.value)
                        }
                     />
                     {passwordHidden && (
                        <svg 
                           className="absolute right-3 top-1/4 translate-y-1/4 cursor-pointer" 
                           onClick={() => setPasswordHidden(false)} 
                           id="pw-hidden-eye" 
                           width="12" 
                           height="12" 
                           viewBox="0 0 12 12" 
                           fill="none" 
                           xmlns="http://www.w3.org/2000/svg">
                           <path d="M0.85372 0.14685C0.65787 -0.0489498 0.341175 -0.0489498 0.147409 0.14685C-0.0463582 0.342649 -0.0484417 0.659261 0.145325 0.85506L11.1463 11.8532C11.3421 12.049 11.6588 12.049 11.8526 11.8532C12.0464 11.6574 12.0484 11.3407 11.8526 11.147L9.84408 9.13904C9.90034 9.08905 9.95659 9.03906 10.0108 8.98907C10.9858 8.08297 11.638 7.00191 11.9484 6.25829C12.0172 6.09373 12.0172 5.91043 11.9484 5.74588C11.638 5.00226 10.9858 3.91911 10.0108 3.0151C9.02943 2.10484 7.6814 1.33623 5.99792 1.33623C4.81448 1.33623 3.79773 1.71533 2.95599 2.2569L0.85372 0.14685ZM4.26027 3.55459C4.74989 3.20465 5.35203 2.99844 6 2.99844C7.65639 2.99844 9.00026 4.34196 9.00026 5.99792C9.00026 6.64572 8.79399 7.24562 8.44396 7.7372L7.72098 7.01441C7.98559 6.56865 8.07518 6.02083 7.93142 5.47926C7.64598 4.41278 6.54796 3.77955 5.4812 4.06492C5.30202 4.11283 5.13326 4.18365 4.98116 4.27322L4.25818 3.55043L4.26027 3.55459ZM6.77715 8.89533C6.52921 8.96199 6.26877 8.9974 6 8.9974C4.34361 8.9974 2.99974 7.65388 2.99974 5.99792C2.99974 5.72921 3.03516 5.46884 3.10183 5.22097L1.44544 3.56501C0.766212 4.33154 0.299505 5.1439 0.051567 5.74171C-0.017189 5.90627 -0.017189 6.08957 0.051567 6.25412C0.362011 6.99774 1.01415 8.08089 1.98924 8.9849C2.97057 9.89516 4.3186 10.6638 6.00208 10.6638C6.77923 10.6638 7.48555 10.4992 8.11685 10.2347L6.77923 8.89742L6.77715 8.89533Z" fill="#707070"/>
                        </svg>
                     )}

                     {!passwordHidden && (
                        <svg 
                           className="absolute right-3 top-1/4 translate-y-1/4 cursor-pointer" 
                           onClick={() => setPasswordHidden(true)} 
                           width="12" 
                           height="12" 
                           viewBox="0 0 14 11" 
                           fill="none" 
                           xmlns="http://www.w3.org/2000/svg">
                           <path d="M7 0C5.03662 0 3.46446 0.903571 2.31997 1.97902C1.18276 3.0471 0.422199 4.32143 0.0601406 5.19799C-0.0200469 5.39196 -0.0200469 5.60804 0.0601406 5.80201C0.422199 6.67857 1.18276 7.95536 2.31997 9.02098C3.46446 10.094 5.03662 11 7 11C8.96338 11 10.5355 10.0964 11.68 9.02098C12.8172 7.9529 13.5778 6.67857 13.9399 5.80201C14.02 5.60804 14.02 5.39196 13.9399 5.19799C13.5778 4.32143 12.8172 3.04464 11.68 1.97902C10.5355 0.906027 8.96338 0 7 0ZM3.50091 5.5C3.50091 4.56227 3.86956 3.66295 4.52577 2.99987C5.18198 2.3368 6.07198 1.96429 7 1.96429C7.92802 1.96429 8.81802 2.3368 9.47423 2.99987C10.1304 3.66295 10.4991 4.56227 10.4991 5.5C10.4991 6.43773 10.1304 7.33705 9.47423 8.00013C8.81802 8.6632 7.92802 9.03571 7 9.03571C6.07198 9.03571 5.18198 8.6632 4.52577 8.00013C3.86956 7.33705 3.50091 6.43773 3.50091 5.5ZM7 3.92857C7 4.79531 6.30261 5.5 5.44485 5.5C5.16541 5.5 4.90298 5.42634 4.67456 5.29375C4.65026 5.56138 4.67213 5.83638 4.74503 6.10893C5.07793 7.36607 6.3585 8.1125 7.60262 7.77612C8.84674 7.43973 9.58544 6.14576 9.25254 4.88862C8.95609 3.76652 7.90393 3.05201 6.79589 3.15022C6.92467 3.37857 7 3.64375 7 3.92857Z" fill="#707070"/>
                        </svg>
                     )}
                  </div>
                  {errors.password && (
                     <span className="text-xs font-extralight text-red-500">{errors.password}</span>
                  )}
               </label>
            </div>
            <button type="submit" className="w-[285px] h-[32px] bg-[#D60000]">Sign in</button>
         </form>
         <p className="font-light text-sm">Don't have an account? <span className="underline underline-offset-2 text-[#D60000]">Sign up</span></p>
      </main>
   </div>
  )
}

export default LoginPage;