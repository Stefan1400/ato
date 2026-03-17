import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useGetFeedback } from "../features/feedback/useFeedback";

type DayTimes = 'Good morning' | 'Good afternoon' | 'Good evening';

function WelcomeMessage() {

   const { user } = useContext(AuthContext) as AuthContextType;
   const feedbackMutation = useGetFeedback();
   const [greeting, setGreeting] = useState<DayTimes>();

   const today = feedbackMutation.data?.todayValue;
   
   const username = user?.email.split('@')[0];
   const displayName = username ? username[0].toUpperCase() + username.slice(1) : 'Guest'

   function getTimeOfDay() {
      const hours = new Date().getHours();

      if (hours >= 0 && hours < 12) return 'Good morning';
      if (hours >= 12 && hours < 18) return 'Good afternoon';
      return 'Good evening';
   };

   function handleGetFeedback() {
      feedbackMutation.mutate();
   };

   useEffect(() => {
      setGreeting(getTimeOfDay())
      
      const interval = setInterval(() => setGreeting(getTimeOfDay()), 60 * 1000);
      return () => clearInterval(interval);
   }, []);

  return (
    <div className="w-screen h-auto p-3 pl-7 flex flex-col items-start text-white gap-1 mb-11 mt-5">
      <button onClick={handleGetFeedback}>get feedback</button>
      
      <h1 className="font-bold text-2xl">{greeting}, {displayName}</h1>
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