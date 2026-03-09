import { useState } from "react";
import type { timerStatus } from "./tracker.types";

function SessionTimer() {
   
   const [timerStatus, setTimerStatus] = useState<timerStatus>('default');
   


   return (
    <div className={`${timerStatus === 'finished' ? 'bg-[#0AD000] text-black' : timerStatus === 'ongoing' ? 'bg-[#D00000] text-white' : 'bg-[#1F1F1F] text-white'} w-full h-auto border-2 border-[#2A2A2A] flex flex-row justify-between items-center p-3 rounded-md`}>
      <div className='flex flex-col items-start justify-between gap-2'>
         <h2 className="font-normal">Start your session</h2>
         <span className="text-3xl font-semibold">00:00</span>
         <h3 className={`font-normal ${timerStatus === 'finished' ? 'text-black' : 'text-[#7E7E7E]'}`}>{timerStatus === 'finished' ? 'session ended' : 'current session'}</h3>
      </div>

      {timerStatus !== 'finished' && (
         <button onClick={timerStatus === 'default' ? () => setTimerStatus('ongoing') : timerStatus === 'ongoing' ? () => setTimerStatus('finished') : undefined} className="p-3.5">
            <div className='p-6 bg-[#161616] rounded-full border-3 border-[#2A2A2A]'>
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