import { useState } from "react"
import { CalendarIcon } from "../../assets/svgs"

type SelectedDayTypes = 'yesterday' | 'today';

function ViewByDate() {
   
   const [selectedDay, setSelectedDay] = useState<SelectedDayTypes>('yesterday');
  
   return (
    <div className="text-white absolute right-5 top-[35vh] flex flex-col gap-1.5">
      <span className="font-light text-sm">view by date</span>
      <div className="flex flex-row gap-3 items-center relative max-w-[50vw]">
         
         <div className="p-1.5 px-1 bg-[#1F1F1F] rounded-full grid grid-cols-2 grid-rows-1 relative">
            <div 
               className="top-[50%] bottom-[50%] translate-y-[-50%] transition-transform duration-100 ease-in-out bg-[#141414] rounded-full w-1/2 h-[80%] absolute"
               style={{ transform: selectedDay === 'yesterday' ? 'translateX(5%)' : 'translateX(95%)'}}
               ></div>

            <button 
               onClick={() => setSelectedDay('yesterday')} 
               className={`flex items-center justify-center rounded-full w-full relative`}>
               Yesterday
            </button>
            
            <button 
               onClick={() => setSelectedDay('today')} 
               className={`flex items-center justify-center w-full rounded-full relative`}>
               Today
            </button>
         </div>
         <button>
            <CalendarIcon />
         </button>
      </div>
    </div>
  )
}

export default ViewByDate