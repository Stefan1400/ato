import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../app/AuthProvider";
import type { AuthContextType } from "../app/AuthProvider";
import { useGetFeedback } from "../features/feedback/useFeedback";

type DayTimes = 'Good morning' | 'Good afternoon' | 'Good evening';

export function getTimeOfDay() {
   const hours = new Date().getHours();

   if (hours >= 0 && hours < 12) return 'Good morning';
   if (hours >= 12 && hours < 18) return 'Good afternoon';
   return 'Good evening';
};

function WelcomeMessage() {

   const { user } = useContext(AuthContext) as AuthContextType;
   const [greeting, setGreeting] = useState<DayTimes>();

   const { data, isLoading, isError } = useGetFeedback();

   const today = data?.todayValue;
   
   const displayName = user?.account_type === 'guest'
      ? 'Guest'
      : (user?.email ? user.email.split('@')[0][0].toUpperCase() + user.email.split('@')[0].slice(1) : 'Guest');

   useEffect(() => {
      setGreeting(getTimeOfDay())
      
      const interval = setInterval(() => setGreeting(getTimeOfDay()), 60 * 1000);
      return () => clearInterval(interval);
   }, []);

   let message;

   if (isLoading || isError || !data || today == null) {
      message = 'Ready to get started? 😊';
   } else {
      message = (
         <>
            You've focused <span className="text-white font-medium">{today} 💪</span> today.
         </>
      )
   };

  return (
      <div className="w-full min-w-0 max-w-md h-auto p-3 pl-0 flex flex-col items-start text-white gap-1 lg:w-96">
         <h1 className="w-full min-w-0 font-bold text-[1.25rem] lg:text-2xl ">{greeting}, <span className="inline-block max-w-[7ch] truncate align-bottom sm:max-w-[10ch]">{displayName}</span></h1>
      <p className="w-full max-w-full wrap-break-word text-[#a8a8a8]">{message}</p>
    </div>
  )
};

export default WelcomeMessage;