import { useState, useRef } from "react";
import type { timerStatus } from "./tracker.types";

function SessionTimer() {
   
   const [timerStatus, setTimerStatus] = useState<timerStatus>('default');

   const [time, setTime] = useState(0);
   const intervalRef = useRef<number | null>(null);

   function startTimer() {
      if (intervalRef.current) return;

      intervalRef.current = setInterval(() => {
         setTime(t => t + 1);
      }, 1000);
   };

   function stopTimer() {
      if (intervalRef.current !== null) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      };
   };

   function formatTime(totalSeconds: number) {
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600);
      const pad = (num: number) => String(num).padStart(2, '0');

      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
   };

   function handleClick() {
      setTimerStatus(prev => {
         if (prev === 'default') {
            startTimer();
            return 'ongoing';
         } else {
            stopTimer();
            return 'finished';
         }
      });
   };

   return (
    <div className={`${timerStatus === 'finished' ? 'bg-[#04724D] text-white' : timerStatus === 'ongoing' ? 'bg-[#FF9F1C] text-black' : 'bg-[#1F1F1F] text-white'} w-full h-auto border-2 border-[#2A2A2A] flex flex-row justify-between items-center rounded-md min-h-[96px] pl-3`}>
      <div className='flex flex-col items-start'>
         <h2 className="font-semibold text-md">{timerStatus === 'ongoing' ? 'Focus Session' : timerStatus === 'finished' ? 'Session Complete' : 'Ready'}</h2>
         <span onClick={startTimer} className="text-[2rem] font-bold">{formatTime(time)}</span>
      </div>

      {timerStatus !== 'finished' && (
         <button onClick={handleClick} className="p-3.5">
            <div className='p-5 bg-[#0C0C0C] rounded-full border-3 border-[#2A2A2A]'>
               {timerStatus === 'default' && (
                  <svg width="20" height="21" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M2.41923 0.197138C1.9125 -0.076068 1.29952 -0.0640149 0.800961 0.225262C0.302404 0.514539 0 1.04086 0 1.60736V16.3926C0 16.9591 0.30649 17.4855 0.800961 17.7747C1.29543 18.064 1.9125 18.0761 2.41923 17.8029L16.15 10.4102C16.6731 10.129 17 9.58659 17 9C17 8.41341 16.6731 7.87102 16.15 7.58977L2.41923 0.197138Z" fill="white"/>
                  </svg>
               )}

               {timerStatus === 'ongoing' && (
                  <svg width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M2.34586 0H14.0752C15.3691 0 16.4211 1.05197 16.4211 2.34586V14.0752C16.4211 15.3691 15.3691 16.4211 14.0752 16.4211H2.34586C1.05197 16.4211 0 15.3691 0 14.0752V2.34586C0 1.05197 1.05197 0 2.34586 0Z" fill="white"/>
                  </svg>
               )}
            </div>
         </button>
      )}
    </div>
  )
}

export default SessionTimer;