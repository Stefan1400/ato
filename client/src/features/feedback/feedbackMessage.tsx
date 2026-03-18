import { useState } from "react";
import type { Feedback } from "./feedback.types";
import { useGetFeedback } from "./useFeedback";

function FeedbackMessage({ }) {
   const { data, isLoading, isError } = useGetFeedback();

   let feedbackType = data?.feedbackType;
   const today = data?.todayValue || 0;
   const yesterday = data?.yesterdayValue || 0;
  
   return (
    <div className="w-screen h-auto flex flex-col items-start justify-start text-white gap-2 p-4 pl-5">
      <p className="text-[#474747] font-medium">Today</p>
      <h1 className="text-4xl">{!today ? '0min' : today}</h1>
      <p className="text-[#a8a8a8] w-70">message</p>
    </div>
  )
}

export default FeedbackMessage;