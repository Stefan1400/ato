import React, { useContext, useState } from "react";
import type { Errors } from './auth.types'; 
import { useRegister } from "./useAuth";
import { AuthContext } from "../../app/AuthProvider";
import type { AuthContextType } from "../../app/AuthProvider";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";

function RegisterPage() {

   const registerMutation = useRegister();
   const { setUser } = useContext(AuthContext) as AuthContextType;
   const navigate = useNavigate();
   const { showToast } = useToast();

   const [passwordHidden, setPasswordHidden] = useState(true);
   const [currentEmail, setCurrentEmail] = useState('');
   const [currentPassword, setCurrentPassword] = useState('');
   const [termsChecked, setTermsChecked] = useState(false);

   const [errors, setErrors] = useState<Errors>({});

   const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const newErrors = {
         email: '',
         password: '',
         terms: ''
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
      }

      if (!termsChecked) {
         newErrors.terms = 'You must accept the terms and conditions';
      };
      
      const hasErrors = Object.values(newErrors).some(Boolean)
      
      if (hasErrors) {
         setErrors(newErrors);
         showToast({ type: 'error', message: 'Please fix the errors', duration: 3000 });
         return;
      };

      registerMutation.mutate({
         email: currentEmail,
         password: currentPassword,
      },
      {
         onSuccess: (response) => {
            setUser(response.user);
            setCurrentEmail('');
            setCurrentPassword('');
            setTermsChecked(false);
            setErrors(prev =>
               Object.fromEntries(
                  Object.keys(prev).map(key => [key, ""])
               )
            );
            showToast({ type: 'success', message: 'Account created successfully', duration: 3000 });
            navigate('/');
         },
         onError: () => {
            showToast({ type: 'error', message: 'Registration failed. Please try again.', duration: 3000 });
         }
      });
   };
  
   return (
      <div className="min-h-screen bg-[#090909] px-4 py-10 text-white  flex items-center justify-center">
         <main className="mx-auto flex w-full max-w-md flex-col rounded-[32px] border border-white/10 p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-10">
            <div className="mb-8 text-center">
               <h1 className="mt-4 text-4xl font-semibold tracking-[0.04em] text-white">Sign up</h1>
               <p className="mt-3 text-sm text-[#c5c5c5]">Create your free account.</p>
            </div>

            <form onSubmit={handleRegister} noValidate className="flex w-full flex-col gap-5">
               <label className="flex flex-col gap-2 text-sm text-[#e5e5e5]" htmlFor="email">
                  Email
                  <input
                     className={`${errors.email ? 'border-red-500 text-white' : 'border-[#2f2f2f] text-white'} rounded-2xl border bg-[#0a0a0a] px-4 py-3 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10`}
                     type="email"
                     placeholder="name@example.com"
                     value={currentEmail}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentEmail(e.target.value)}
                  />
                  {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
               </label>

               <label className="flex flex-col gap-2 text-sm text-[#e5e5e5] relative" htmlFor="password">
                  Password
                  <div className="relative">
                     <input
                        className={`${errors.password ? 'border-red-500 text-white' : 'border-[#2f2f2f] text-white'} w-full rounded-2xl border bg-[#0a0a0a] px-4 py-3 pr-11 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10`}
                        type={passwordHidden ? 'password' : 'text'}
                        placeholder="Create a password"
                        value={currentPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                     />
                     <button
                        type="button"
                        onClick={() => setPasswordHidden(!passwordHidden)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] transition hover:text-white"
                     >
                        {passwordHidden ? 'Show' : 'Hide'}
                     </button>
                  </div>
                  {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
               </label>

               <label className="flex cursor-pointer items-start gap-3 text-sm text-[#d1d1d1]">
                  <input
                     type="checkbox"
                     checked={termsChecked}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTermsChecked(e.target.checked)}
                     className="mt-1 h-4 w-4 rounded border-[#2f2f2f] bg-[#0a0a0a] accent-[#D60000]"
                  />
                  <span className="leading-5">
                     I agree to the <a className="font-semibold text-[#D60000]" href="#">Terms</a> and <a className="font-semibold text-[#D60000]" href="#">Privacy Policy</a>
                  </span>
               </label>
               {errors.terms && <span className="text-xs text-red-500">{errors.terms}</span>}

               <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#D60000] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ff1717] cursor-pointer"
               >
                  Sign up
               </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#b5b5b5]">
               Already have an account?{' '}
               <Link to="/login" className="font-semibold text-white transition hover:text-[#D60000]">
                  Sign in
               </Link>
            </p>
         </main>
      </div>
   )
}

export default RegisterPage;