import type { SessionWithDates } from "./analytics.types";
import { calculateSessionPosition } from "./helpers/calculateSessionPosition";
import { transformSession } from "./helpers/transformSession";
import { useGetSessionsByDate } from "./useAnalytics";

function Timeline() {

   const times = [];

   for (let i = 0; i < 24; i++) {
      let convertedTime = `${i.toString().padStart(2,'0')}:00`;
      times.push(convertedTime);
   };

   const today = new Date().toDateString();
   const { data, isLoading, isError } = useGetSessionsByDate(today);

   const processedSessions = data
      ?.map(transformSession)
      .filter((s): s is SessionWithDates => s !== null)
      .map(calculateSessionPosition)
   

   return (
    <div className="w-screen h-auto text-white flex flex-col items-center mt-30 relative">
      <ul className="flex flex-col items-start w-full">
         {times.map(t => (
            <li key={t} className="relative">
               <div className="w-screen h-0.5 bg-[#2E2E2E] absolute left-0 top-3 opacity-40 z-10"></div>
               <p className="relative z-40 ml-3">{t}</p>
            </li>
         ))}
      </ul>

      {processedSessions?.map(session => {
         
         return (
            <div 
               key={session.id} 
               style={{ top: `${session.topPercent}%`, height: `${session.heightPercent}%` }} 
               className="w-3 bg-[#CC0000] absolute left-20 rounded-full z-40">
            </div>
         )
      })}
    </div>
  )
};

export default Timeline;