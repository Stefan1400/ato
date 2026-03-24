import { calculateSessionPosition } from "./helpers/calculateSessionPosition";

const session_list = [
   { id: 1, session_started: new Date('2026-03-23T04:00'), session_ended: new Date('2026-03-23T10:00') },
   { id: 2, session_started: new Date('2026-03-23T13:40'), session_ended: new Date('2026-03-23T14:30') },
   { id: 3, session_started: new Date('2026-03-23T17:00'), session_ended: new Date('2026-03-23T19:30') }
];

function Timeline() {

   const times = [];

   for (let i = 0; i < 24; i++) {
      let convertedTime = `${i.toString().padStart(2,'0')}:00`;
      times.push(convertedTime);
   };

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

      {session_list.map(session => {
         const s = calculateSessionPosition(session);
         
         return (
            <div key={s.id} style={{ top: `${s.topPercent}%`, height: `${s.heightPercent}%` }} className="w-3 bg-[#CC0000] absolute left-20 rounded-full z-40"></div>
         )
      })}
    </div>
  )
};

export default Timeline;