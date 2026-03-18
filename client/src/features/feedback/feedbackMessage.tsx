import { useState } from "react";
import type { Feedback } from "./feedback.types";
import { useGetFeedback } from "./useFeedback";

function FeedbackMessage({ }) {
   const { data, isLoading, isError } = useGetFeedback();

   let feedbackType = data?.feedbackType;
   const today = data?.todayValue || 0;
   const yesterday = data?.yesterdayValue || 0;

   let message;

   switch (feedbackType) {
      case 'TODAY_TOTAL_ONLY':
         message = (
               <>
                  Nice work - <span className="text-white font-medium">{today}</span> today
               </>
            );
         break;
      case 'TODAY_TOTAL_GREATER':
         message = (
               <>
                  Great job — more focus today than yesterday
               </>
            );
         break;
      case 'NO_SESSIONS_YET':
         message = (
               <>
                  No sessions yet — start today to track your focus
               </>
            );
         break;
      case 'YESTERDAY_TOTAL_ONLY':
         message = (
               <>
                  No sessions yet — yesterday you had <span className="text-white font-medium">{!yesterday ? '0min' : yesterday}</span>
               </>
            );
         break;
      case 'TODAY_TOTAL_MATCH':
         message = (
               <>
                  Nice — you matched yesterday's focus time. <span className="text-white font-medium">Can you beat it today?</span>
               </>
            );
         break;
      case 'TODAY_LONGEST_GREATER':
         message = (
               <>
                  Great job — longest session today: <span className="text-white font-medium">{today}</span>. 
               </>
            );
         break;
      case 'TODAY_AVERAGE_GREATER':
         message = (
               <>
                  You improved your average session today: <span className="text-white font-medium">{today}</span>. 
               </>
            );
         break;
      default:
         message = 'No sessions yet — start today to track your focus';
         break;
   };
  
   return (
    <div className="w-screen h-auto flex flex-col items-start justify-start text-white gap-2 p-4 pl-5">
      <p className="text-[#474747] font-medium">Today</p>
      <h1 className="text-4xl">{!today ? '0min' : today}</h1>
      <p className="text-[#a8a8a8] w-70">{message}</p>
    </div>
  )
}

export default FeedbackMessage;