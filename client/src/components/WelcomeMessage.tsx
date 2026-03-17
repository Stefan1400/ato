import { useContext } from "react";
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useGetFeedback } from "../features/feedback/useFeedback";

function WelcomeMessage() {

   const { user } = useContext(AuthContext) as AuthContextType;
   const feedbackMutation = useGetFeedback();

   function handleGetFeedback() {
      feedbackMutation.mutate();
   };

   const today = feedbackMutation.data?.todayValue;
   
   const username = user?.email.split('@')[0];
   const displayName = username ? username[0].toUpperCase() + username.slice(1) : 'Guest'

  return (
    <div className="w-screen h-auto p-3 pl-7 flex flex-col items-start text-white gap-1 mb-11 mt-5">
      <button onClick={handleGetFeedback}>get feedback</button>
      
      <h1 className="font-bold text-2xl">Good morning, {displayName}</h1>
      <p className="text-[#c3c3c3]">
         {!today ? (
         'Ready to get started? 😊'
         ) : (
         <>
            You've focused <span className="text-white font-medium">{today} 💪</span> today. Ready to continue?
         </>
         )}
      </p>
    </div>
  )
};

export default WelcomeMessage;