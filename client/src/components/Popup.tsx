import { useState } from "react";
import { WarningIcon } from "../assets/svgs";
import { useDeleteUser } from "../features/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "./Toast";

type PopupTypes = {
   toggleDeleteAccountPopup: () => void;
   toggleMenu: () => void;
};

function Popup({ toggleDeleteAccountPopup, toggleMenu }: PopupTypes) {

   const [typedString, settypedString] = useState('');
   const confirmationString = 'delete my account';
   const deleteUserMutation = useDeleteUser();
   const [error, setError] = useState(false);

   const navigate = useNavigate();
   const { showToast } = useToast();

   const validateString = () => {
      if (!typedString) return false;

      if (typedString.toLowerCase() !== confirmationString) return false;

      return true;
   };

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validated = validateString();

      if (!validated) {
         setError(true);
         showToast({ type: 'error', message: 'Invalid confirmation string', duration: 3000 });
         return;
      };

      deleteUserMutation.mutate(undefined, {
      onSuccess: () => {
         toggleDeleteAccountPopup();
         settypedString('');
         setError(false);
         navigate('/signup');
         toggleMenu();
         showToast({ type: 'success', message: 'Account Deleted Successfully', duration: 3000 });
      },
      onError: () => {
            showToast({ type: 'error', message: 'Account could not be deleted', duration: 3000 });
         }
    });
   };

   return (
    <>
      <div onClick={toggleDeleteAccountPopup} className="fixed inset-0 z-1000 bg-black/70 backdrop-blur-sm" />

      <div className="fixed inset-x-4 top-12 z-1000 mx-auto flex min-h-[calc(100vh-96px)] items-center justify-center overflow-y-auto pb-8 sm:inset-x-6 sm:top-16">
         <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-[#0f0f0f]/95 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-col items-center gap-4 text-center">
               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2f1212]/80 text-[#ff8b8b] shadow-[0_0_0_1px_rgba(255,138,138,0.1)]">
                  <WarningIcon />
               </div>

               <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">Delete Account?</h2>
                  <p className="mt-3 text-sm leading-6 text-[#c7c7c7]">
                     Permanently delete your account and all session data. This cannot be undone.
                  </p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-15">
               <label className="text-sm text-[#e5e5e5]" htmlFor="delete-account-input">
                  <span className="mb-2 block text-[#b5b5b5]">
                     Type <span className="font-semibold text-white">delete my account</span> to confirm.
                  </span>
                  <input
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => settypedString(e.target.value)}
                     value={typedString}
                     className={`${error ? 'border-red-500 text-white' : 'border-white/10 text-white'} w-full rounded-3xl border bg-[#111111] px-4 py-3 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10`}
                     type="text"
                     placeholder="delete my account"
                  />
                  {error && <span className="mt-2 block text-xs text-red-500">Please enter "delete my account"</span>}
               </label>

               <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                  <button
                     type="submit"
                     className="inline-flex h-12 w-full items-center justify-center rounded-3xl bg-[#D60000] text-sm font-semibold text-white transition hover:bg-[#ff1f1f]"
                  >
                     Delete account
                  </button>
                  <button
                     onClick={toggleDeleteAccountPopup}
                     type="button"
                     className="inline-flex h-12 w-full items-center justify-center rounded-3xl border border-white/10 bg-[#111111] text-sm font-semibold text-white transition hover:border-white/20 hover:bg-[#181818]"
                  >
                     Cancel
                  </button>
               </div>
            </form>
         </div>
      </div>
    </>
  )
}

export default Popup;