import { useState } from "react";
import type { Feedback } from "./feedback.types";
import { useGetFeedback } from "./useFeedback";

function FeedbackMessage({ }) {
   const getFeedbackMutation = useGetFeedback();

   const handleGetFeedback = () => {      
      getFeedbackMutation.mutate();
   };

   const feedbackType = getFeedbackMutation.data?.feedbackType;
   const today = getFeedbackMutation.data?.todayValue || 0;
   const yesterday = getFeedbackMutation.data?.yesterdayValue || 0;
  
   return (
    <div className="w-screen h-auto flex flex-col items-start justify-start absolute bottom-0 bg-[#2A2A2A] text-white gap-2">
      <button onClick={handleGetFeedback} className="bg-black">Get Feedback</button>
      
      <h2>Today's Focus Insight</h2>
      <div>
         <div className="flex flex-row gap-3">
            <span className="font-semibold">today:</span>
            <span className="text-green-500">{today === 0 ? today+"min" : today}</span>
         </div>
         <div className="flex flex-row gap-3">
            <span className="font-semibold">Yesterday:</span>
            <span className="text-green-500">{yesterday === 0 ? yesterday+"min" : yesterday}</span>
         </div>
      </div>

      <p>message</p>
    </div>
  )
}

export default FeedbackMessage;