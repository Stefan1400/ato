import { useState } from "react";
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

   const [zoom, setZoom] = useState(1);
   const baseHeight = 600;

   const timelineHeight = baseHeight * zoom;

   return (
    <div style={{ height: `${timelineHeight}px`}} className={`w-screen h-${baseHeight}px text-white flex flex-col items-center mt-30 relative bg-[#151515]`}>
      
      <div className="fixed right-5 bottom-5 flex flex-col gap-2">
         <button onClick={() => {setZoom(z => Math.min(z * 1.5, 3.5)); console.log('zoom in: ',zoom);}}>Zoom In</button>
         <button onClick={() => {setZoom(z => Math.max(z / 1.5, 0.5)); console.log('zoom out: ',zoom);}}>Zoom Out</button>
      </div>
      
      <ul className="flex flex-col items-start w-full" style={{ height: `${timelineHeight}px`}}>
         {times.map((t, i) => {
            const topPercent = (i / 24) * 100;
            return (
               <li key={t} style={{ top: `${topPercent}%` }} className="relative">
                  <div className="w-screen h-0.5 bg-[#2E2E2E] absolute left-0 top-3 opacity-40 z-10"></div>
                  <p className="relative z-40 ml-3">{t}</p>
               </li>
            )
         })}
      </ul>

      {processedSessions?.map(session => {
         
         return (
            <div 
               key={session.id} 
               style={{ top: `${session.topPercent}%`, height: `${session.heightPercent}%` }} 
               className="w-[75vw] bg-[#CC0000] absolute left-20 rounded-full z-40">
            </div>
         )
      })}
    </div>
  )
};

export default Timeline;