import { useState, useRef } from "react";
import type { addSessionTypes, UIStates } from "./tracker.types";
import { useAddSession } from "./useSessionTimer";
import { sessionTimerStyles } from "./SessionTimer.styles";
import { PlayIcon, StopIcon } from "../../assets/svgs";

function SessionTimer() {

   const addSessionMutation = useAddSession();
   const [timerStatus, setTimerStatus] = useState<UIStates>('default');

   const [time, setTime] = useState(0);
   const intervalRef = useRef<number | null>(null);

   const sessionRef = useRef<addSessionTypes>({
      session_started: null,
      session_ended: null
   });

   function resetTimer() {
      setTimeout(() => {
         setTimerStatus('default');
         setTime(0);
         addSessionMutation.reset();
      }, 3000);
   };

   function startTimer() {
      const started_at = new Date()
      sessionRef.current.session_started = started_at;
      
      if (intervalRef.current) return;

      intervalRef.current = setInterval(() => {
         setTime(t => t + 1);
      }, 1000);
   };

   function stopTimer() {
      if (intervalRef.current !== null) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
         resetTimer();

         const ended_at = new Date();

         sessionRef.current.session_ended = ended_at;

         handleAddSession();
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
            return 'pending';
         }
      });
   };

   function handleAddSession() {

      addSessionMutation.mutate({
         session_started: sessionRef.current.session_started,
         session_ended: sessionRef.current.session_ended
      },
      {
         onSuccess: () => {
            sessionRef.current = {
               session_started: null,
               session_ended: null
            }
         }
      }
   )
   };

   let uiState: UIStates = 'default';

   if (addSessionMutation.isSuccess) uiState = 'success';
   else if (addSessionMutation.isPending) uiState = 'pending';
   else if (addSessionMutation.isError) uiState = 'error';
   else if (timerStatus === 'ongoing') uiState = 'ongoing';
   else uiState = 'default';

   const style = sessionTimerStyles[uiState];

   return (
    <div className={`${style.container} w-full h-auto border-2 border-[#2A2A2A] flex flex-row justify-between items-center rounded-md min-h-24 pl-3`}>      
      <div className='flex flex-col items-start'>
         <h2 className="font-semibold text-md flex flex-row items-center gap-2">
            {style.header?.icon && <style.header.icon />}
            {style.header.text}
         </h2>
         <span className="text-[2rem] font-bold">{formatTime(time)}</span>
         <h3 className={`${style.subHeader?.styles} flex flex-row items-center gap-2`}>
            {style.subHeader?.icon && <style.subHeader.icon />}
            {style.subHeader?.text}
         </h3>
      </div>

      {style.btnVisible && (
         <button onClick={handleClick} className="p-3.5">
            <div className='p-5 bg-[#0C0C0C] rounded-full border-3 border-[#2A2A2A]'>
               {timerStatus === 'default' && (
                  <PlayIcon />
               )}

               {timerStatus === 'ongoing' && (
                  <StopIcon />
               )}
            </div>
         </button>
      )}
    </div>
  )
}

export default SessionTimer;