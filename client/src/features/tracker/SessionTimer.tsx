import { useState, useRef, useEffect, useContext } from "react";
import type { addSessionTypes, UIStates } from "./tracker.types";
import { useAddSession } from "./useSessionTimer";
import { sessionTimerStyles } from "./SessionTimer.styles";
import { Play, Square } from "lucide-react";
import { useToast } from "../../components/Toast";
import { AuthContext, type AuthContextType } from "../../app/AuthProvider";
import formatElapsedTime from "../analytics/helpers/FormatElapsedTime";

type StoredTimerState = {
   time: number;
   timerStatus: UIStates;
   startedAt: string | null;
};

export const DEFAULT_TIMER: StoredTimerState = {
   time: 0,
   timerStatus: 'default',
   startedAt: null,
};

export function loadTimer(userId?: number): StoredTimerState {
   if (!userId) return DEFAULT_TIMER;

   const saved = localStorage.getItem(`sessionTimer:${userId}`);
   if (!saved) return DEFAULT_TIMER;

   try {
      const parsedState = JSON.parse(saved) as StoredTimerState;
      return {
         time: parsedState.time ?? DEFAULT_TIMER.time,
         timerStatus: parsedState.timerStatus ?? DEFAULT_TIMER.timerStatus,
         startedAt: parsedState.startedAt ?? DEFAULT_TIMER.startedAt
      };
   } catch {
      return DEFAULT_TIMER;
   }
}

export function saveTimer(userId: number | undefined, data: StoredTimerState) {
   if (!userId) return;
   localStorage.setItem(`sessionTimer:${userId}`, JSON.stringify(data));
}

export function clearTimer(userId: number | undefined) {
   if (!userId) return;
   localStorage.removeItem(`sessionTimer:${userId}`);
}

function SessionTimer() {
   const { user } = useContext(AuthContext) as AuthContextType;
   const userId = user?.id;
   const initialTimerState = loadTimer(userId);

   const addSessionMutation = useAddSession();
   const { showToast } = useToast() as any;
   const [timerStatus, setTimerStatus] = useState<UIStates>(initialTimerState.timerStatus);
   const [time, setTime] = useState<number>(() => {
      const parsedState = initialTimerState;
      return parsedState.timerStatus === 'ongoing' && parsedState.startedAt
         ? Math.max(0, Math.floor((Date.now() - new Date(parsedState.startedAt).getTime()) / 1000))
         : parsedState.time;
   });
   const intervalRef = useRef<number | null>(null);

   const sessionRef = useRef<addSessionTypes>({
      session_started: null,
      session_ended: null
   });

   useEffect(() => {
      const restoredState = loadTimer(userId);
      const restoredTime = restoredState.timerStatus === 'ongoing' && restoredState.startedAt
         ? Math.max(0, Math.floor((Date.now() - new Date(restoredState.startedAt).getTime()) / 1000))
         : restoredState.time;

      setTimerStatus(restoredState.timerStatus);
      setTime(restoredTime);

      if (restoredState.startedAt) {
         sessionRef.current.session_started = new Date(restoredState.startedAt);
      } else {
         sessionRef.current.session_started = null;
      }
   }, [userId]);
   
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

      intervalRef.current = window.setInterval(() => {
         if (!sessionRef.current.session_started) return;

         const elapsed = Math.floor(
            (Date.now() - sessionRef.current.session_started.getTime()) / 1000
         );

         setTime(elapsed);
      }, 1000);
   };

   useEffect(() => {
      saveTimer(userId, {
         time,
         timerStatus,
         startedAt: sessionRef.current.session_started ? sessionRef.current.session_started.toISOString() : null
      });
   }, [time, timerStatus, userId]);

   useEffect(() => {
      if (timerStatus === 'ongoing' && intervalRef.current === null) {
         intervalRef.current = window.setInterval(() => {
         if (!sessionRef.current.session_started) return;

         const elapsed = Math.floor(
            (Date.now() - sessionRef.current.session_started.getTime()) / 1000
         );

         setTime(elapsed);
      }, 1000);
}

      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
         }
      }
   }, [timerStatus]);

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

   function handleClick() {
            
      setTimerStatus(prev => {
         if (prev === 'default') {
            startTimer();
            return 'ongoing';
         } else {
            stopTimer();
            return 'default';
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
            clearTimer(userId);
            sessionRef.current = {
               session_started: null,
               session_ended: null
            }
            showToast({ type: 'success', message: 'Session Added Successfully', duration: 3000 });
         },
         onError: () => {
            sessionRef.current = {
               session_started: null,
               session_ended: null
            }
            showToast({ type: 'error', message: 'Session Could not be added', duration: 3000 });
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

   const HeaderIcon = style.header?.icon;
   const SubHeaderIcon = style.subHeader?.icon;

   return (
    <div className={`${style.container} w-full min-w-[400px] max-w-md h-auto border-2 border-[#2A2A2A] flex flex-row justify-between items-center rounded-md min-h-24 pl-3`}>      
      <div className='flex flex-col items-start'>
         <h2 className="font-semibold text-md flex flex-row items-center gap-2">
            {HeaderIcon && <HeaderIcon className="w-4.5 h-4.5" />}
            {style.header.text}
         </h2>
         <span className="text-[2rem] font-bold">{formatElapsedTime(time)}</span>
         <h3 className={`${style.subHeader?.styles} flex flex-row items-center gap-2`}>
            {SubHeaderIcon && <SubHeaderIcon className="w-4.5 h-4.5" />}
            {style.subHeader?.text}
         </h3>
      </div>

      {style.btnVisible && (
         <button onClick={handleClick} className="p-3.5 cursor-pointer" aria-label='start/stop timer'>
            <div className='p-5 bg-[#0C0C0C] rounded-full border-3 border-[#2A2A2A]'>
               {timerStatus === 'default' && (
                  <Play fill="white" className="w-6 h-6" />
               )}

               {timerStatus === 'ongoing' && (
                  <Square fill="white" className="w-6 h-6" />
               )}
            </div>
         </button>
      )}
    </div>
  )
}

export default SessionTimer;