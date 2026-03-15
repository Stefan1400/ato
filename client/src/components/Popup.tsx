import { useState } from "react";
import { WarningIcon } from "../assets/svgs";
import { useDeleteUser } from "../features/auth/useAuth";
import { useNavigate } from "react-router-dom";

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
         return;
      };

      deleteUserMutation.mutate(undefined, {
      onSuccess: () => {
         toggleDeleteAccountPopup();
         settypedString('');
         setError(false);
         navigate('/signup');
         toggleMenu();
      }
    });
   };

   return (
    <div className="w-screen h-screen fixed left-0 top-0 z-1000 bg-black opacity-100 flex">
      <div className="w-full h-auto border-2 border-[#3C3C3C] rounded-[5px] fixed left-[50%] bottom-0 translate-x-[-50%] z-1000 text-white bg-[#171717] p-5">
         <main className="flex items-center justify-center flex-col text-center gap-6 p-5">
            <div className="flex justify-center items-center p-2 bg-[#232323] rounded-full">
               <WarningIcon />
            </div>

            <h2 className="text-2xl font-semibold">Delete Account?</h2>
            <p className="text-medium">All data will be permanently lost. This action cannot be undone.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-start">
               <label className="flex flex-col gap-2" htmlFor="delete-account-input">
                  <p>Please type <span className="font-bold">delete my account</span> to confirm</p>
                  <input 
                     onChange={
                        (e: React.ChangeEvent<HTMLInputElement>) => settypedString(e.target.value)
                     } 
                     value={typedString} 
                     className={`${error ? 'border-red-500 outline-0' : ''} w-full border-2 border-[#3C3C3C] p-3 rounded-sm`} 
                     type="text" 
                     placeholder="Enter the string above" />
               
                  {error && (
                     <span className="text-red-500 font-extralight">Please enter "delete my account"</span>
                  )}
               </label>

               <div className="flex flex-row items-center justify-between">
                  <button onClick={toggleDeleteAccountPopup} className="p-3 bg-[#171717] text-white rounded-sm border-[#3C3C3C] border-2">Cancel</button>
                  <button type="submit" className="p-3 bg-[#D60000] text-white rounded-sm">Delete</button>
               </div>
            </form>
         </main>
      </div>
    </div>
  )
}

export default Popup;