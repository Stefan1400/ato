import { useState } from "react";
import { EyeSlashedIcon, EyeIcon } from "../../../assets/svgs";
import type { ChangePasswordErrors } from "../auth.types";
import { useChangePassword } from "../useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/Toast";
import { useLogout } from "../useAuth";

function ChangePasswordPage() {

   const changePasswordMutation = useChangePassword();
   const navigate = useNavigate();
   const { showToast } = useToast();
   const logoutMutation = useLogout();
   
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmNewPassword, setConfirmNewPassword] = useState('');
   
   const [currentPasswordHidden, setCurrentPasswordHidden] = useState(true);
   const [newPasswordHidden, setNewPasswordHidden] = useState(true);
   const [confirmNewPasswordHidden, setConfirmNewPasswordHidden] = useState(true);
   
   const [errors, setErrors] = useState<ChangePasswordErrors>({});

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const newErrors = {
         currentPassword: '',
         newPassword: '',
         confirmNewPassword: '',
      };

      type FieldName = 'currentPassword' | 'newPassword' | 'confirmNewPassword';

      function validateInput(name: FieldName, value: string) {
         if (!value) {
            newErrors[name] = 'Password is required';
         } else if (value.length < 8 || value.length > 64) {
            newErrors[name] = 'Password must be 8-64 characters'
         };
      };

      validateInput('currentPassword', currentPassword);
      validateInput('newPassword', newPassword);
      validateInput('confirmNewPassword', confirmNewPassword);

      if (newPassword !== confirmNewPassword) {
         newErrors.confirmNewPassword = 'Passwords must match';
      };

      const hasErrors = Object.values(newErrors).some(Boolean);

      if (hasErrors) {
         setErrors(newErrors);
         showToast({ type: 'error', message: 'Please fix the errors', duration: 3000 });
         return;
      };

      changePasswordMutation.mutate(
         {
            current_password: currentPassword,
            new_password: newPassword,
         },
         {
            onSuccess: () => {
               setCurrentPassword('');
               setNewPassword('');
               setConfirmNewPassword('');
               setErrors({
                  currentPassword: '',
                  newPassword: '',
                  confirmNewPassword: '',
               });
               logoutMutation.mutate();
               navigate('/login');
               showToast({ type: 'success', message: 'Password changed successfully', duration: 3000 });
            },
            onError: () => {
               showToast({ type: 'error', message: 'Failed to change password', duration: 3000 });
            }
         }
      )
      
   };

   return (
      <div className="relative z-10 min-h-screen bg-[#090909] px-4 py-10 pt-25 text-white flex items-center justify-center">
         <div className="page-background-gradient"></div>
         
         <main className="mx-auto flex w-full max-w-md flex-col rounded-[32px] border border-white/10 bg-[#090909] p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-10">
            <div className="mb-6 text-center">
               <h1 className="mt-4 text-3xl font-semibold tracking-[0.02em] text-white">Change Password</h1>
               <p className="mt-3 text-sm text-[#c5c5c5]">Use a strong password between 8 and 64 characters.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-5">
               <label className="flex flex-col gap-2 text-sm text-[#e5e5e5]" htmlFor="current-password">
                  Current password
                  <div className="relative">
                     <input
                        className="w-full rounded-2xl border border-[#2f2f2f] bg-[#0a0a0a] px-4 py-3 text-white outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10"
                        type={currentPasswordHidden ? 'password' : 'text'}
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                     />
                     <button
                        type="button"
                        onClick={() => setCurrentPasswordHidden(!currentPasswordHidden)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] transition hover:text-white cursor-pointer"
                     >
                        {currentPasswordHidden ? 'Show' : 'Hide'}
                     </button>
                  </div>
                  {errors?.currentPassword && <span className="text-xs text-red-500">{errors?.currentPassword}</span>}
               </label>

               <label className="flex flex-col gap-2 text-sm text-[#e5e5e5]" htmlFor="new-password">
                  New password
                  <div className="relative">
                     <input
                        className="w-full rounded-2xl border border-[#2f2f2f] bg-[#0a0a0a] px-4 py-3 text-white outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10"
                        type={newPasswordHidden ? 'password' : 'text'}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                     />
                     <button
                        type="button"
                        onClick={() => setNewPasswordHidden(!newPasswordHidden)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] transition hover:text-white cursor-pointer"
                     >
                        {newPasswordHidden ? 'Show' : 'Hide'}
                     </button>
                  </div>
                  {errors?.newPassword && <span className="text-xs text-red-500">{errors?.newPassword}</span>}
               </label>

               <label className="flex flex-col gap-2 text-sm text-[#e5e5e5]" htmlFor="confirm-new-password">
                  Confirm new password
                  <div className="relative">
                     <input
                        className="w-full rounded-2xl border border-[#2f2f2f] bg-[#0a0a0a] px-4 py-3 text-white outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10"
                        type={confirmNewPasswordHidden ? 'password' : 'text'}
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmNewPassword(e.target.value)}
                     />
                     <button
                        type="button"
                        onClick={() => setConfirmNewPasswordHidden(!confirmNewPasswordHidden)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8f8f] transition hover:text-white cursor-pointer"
                     >
                        {confirmNewPasswordHidden ? 'Show' : 'Hide'}
                     </button>
                  </div>
                  {errors?.confirmNewPassword && <span className="text-xs text-red-500">{errors?.confirmNewPassword}</span>}
               </label>

               <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#D60000] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ff1717] cursor-pointer"
               >
                  Change Password
               </button>
            </form>
         </main>
      </div>
   )
}

export default ChangePasswordPage;