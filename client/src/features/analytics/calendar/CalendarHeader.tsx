import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarHeader({ goToPreviousMonth, goToNextMonth, monthLabel }: any) {
  return (
    <div className="mt-5 flex items-center justify-between rounded-full bg-white/5 px-3 py-2">
      <button
         onClick={goToPreviousMonth}
         className="rounded-full p-2 hover:bg-white/10"
      >
         <ChevronLeft size={16} color="white" />
      </button>

      <span className="font-medium text-white">
         {monthLabel}
      </span>

      <button
         onClick={goToNextMonth}
         className="rounded-full p-2 hover:bg-white/10"
      >
         <ChevronRight size={16} color="white" />
      </button>
   </div>
  )
}