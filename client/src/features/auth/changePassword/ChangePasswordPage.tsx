import { useState } from "react";
import { EyeSlashedIcon, EyeIcon } from "../../../assets/svgs";
import type { ChangePasswordErrors } from "../auth.types";
import { useChangePassword } from "../useAuth";

function ChangePasswordPage() {

   const changePasswordMutation = useChangePassword();
   
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
            }
         }
      )
      
   };

   return (
    <div className='w-screen h-screen bg-[#151515] text-white flex flex-col items-center px-6 pt-21'>
      <main className='text-white w-screen h-screen flex p-4 flex-col items-center gap-5'>
         <header>
            <h1 className='text-3xl font-normal text-white text-center mt-10'>Change Password</h1>
            <p>Password must be 8-64 characters</p>
         </header>

         <form onSubmit={handleSubmit} noValidate className='flex w-screen flex-col justify-between items-center gap-3'>
            <div className="w-screen flex flex-col mt-2 mb-2 items-center">
               <label 
                  className='text-white flex flex-col gap-3 p-3 relative text-sm' 
                  htmlFor="current-password">Current password

                  <div className="relative w-[285px]">
                     <input 
                        className='border-2 border-[#3C3C3C] rounded-xs px-2 h-[35px] w-[285px]' 
                        type={currentPasswordHidden ? 'password' : 'text'}
                        placeholder='Current password' 
                        value={currentPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                           setCurrentPassword(e.target.value)
                        }
                     />

                     {currentPasswordHidden && (
                        <EyeSlashedIcon 
                           className="absolute right-3 top-1/4 translate-y-1/4 cursor-pointer" 
                           onClick={() => setCurrentPasswordHidden(false)}
                        />
                     )}

                     {!currentPasswordHidden && (
                        <EyeIcon 
                           className="absolute right-3 top-1/4 translate-y-1/4 cursor-pointer" 
                           onClick={() => setCurrentPasswordHidden(true)}
                        />
                     )}
                  </div>
                  {errors?.currentPassword && (
                     <span className="text-xs font-extralight text-red-500">{errors?.currentPassword}</span>
                  )}
               </label>
               
               <label 
                  className='text-white flex flex-col gap-3 p-3 relative text-sm' 
                  htmlFor="password">New password
                  
                  <div className="relative w-[285px]">
                     <input 
                        className=' border-2 border-[#3C3C3C] rounded-xs h-[35px] w-[285px] pr-10 pl-2' 
                        type={newPasswordHidden ? 'password' : 'text'}
                        placeholder='New password'
                        value={newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                           {setNewPassword(e.target.value)}
                        }
                     />

                     {newPasswordHidden && (
                        <EyeSlashedIcon 
                           className="absolute right-3 top-1/4 translate-y-1/4 cursor-pointer" 
                           onClick={() => setNewPasswordHidden(false)}
                        />
                     )}

                     {!newPasswordHidden && (
                        <EyeIcon 
                           className="absolute right-3 top-1/4 translate-y-1/4 cursor-pointer" 
                           onClick={() => setNewPasswordHidden(true)}
                        />
                     )}
                  </div>
                  {errors?.newPassword && (
                     <span className="text-xs font-extralight text-red-500">{errors?.newPassword}</span>
                  )}
               </label>
               <label 
                  className='text-white flex flex-col gap-3 p-3 relative text-sm' 
                  htmlFor="password">Confirm new password
                  
                  <div className="relative w-[285px]">
                     <input 
                        className=' border-2 border-[#3C3C3C] rounded-xs h-[35px] w-[285px] pr-10 pl-2' 
                        type={confirmNewPasswordHidden ? 'password' : 'text'}
                        placeholder='Confirm new password'
                        value={confirmNewPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                           {setConfirmNewPassword(e.target.value)}
                        }
                     />

                     {confirmNewPasswordHidden && (
                        <EyeSlashedIcon 
                           className="absolute right-3 top-1/4 translate-y-1/4 cursor-pointer" 
                           onClick={() => setConfirmNewPasswordHidden(false)}
                        />
                     )}

                     {!confirmNewPasswordHidden && (
                        <EyeIcon 
                           className="absolute right-3 top-1/4 translate-y-1/4 cursor-pointer" 
                           onClick={() => setConfirmNewPasswordHidden(true)}
                        />
                     )}
                  </div>
                  {errors?.confirmNewPassword && (
                     <span className="text-xs font-extralight text-red-500">{errors?.confirmNewPassword}</span>
                  )}
               </label>
            </div>
            <button type="submit" className="w-[285px] h-[32px] bg-[#D60000]">Change Password</button>
         </form>
      </main>
   </div>
  )
}

export default ChangePasswordPage;