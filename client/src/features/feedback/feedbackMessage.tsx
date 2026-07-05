import type { Feedback } from "./feedback.types";
import { useGetFeedback } from "./useFeedback";
import { useGetSessionsByDate } from "../analytics/useAnalytics";
import formatDuration from "../analytics/helpers/FormatDuration";

type FeedbackMessageProps = {
   selectedDate: Date;
};

function getIsoDate(date: Date) {
   return date.toISOString().slice(0, 10);
}

function getTotalDurationMs(sessions: Array<{ session_started: string | Date; session_ended: string | Date }>) {
   return sessions.reduce((total, session) => {
      const started = new Date(session.session_started).getTime();
      const ended = new Date(session.session_ended).getTime();
      return total + Math.max(0, ended - started);
   }, 0);
}

function FeedbackMessage({ selectedDate }: FeedbackMessageProps) {
   const queryDate = getIsoDate(selectedDate);
   const { data: sessions = [], isLoading: sessionsLoading } = useGetSessionsByDate(queryDate);
   const { data, isLoading: feedbackLoading } = useGetFeedback();

   const isSelectedDateToday = queryDate === getIsoDate(new Date());
   const totalMs = getTotalDurationMs(sessions);
   const selectedDateTotal = formatDuration(totalMs);
   const today = data?.todayValue || "0min";
   const yesterday = data?.yesterdayValue || "0min";
   const feedbackType = data?.feedbackType;
   const isLoading = isSelectedDateToday ? feedbackLoading : sessionsLoading;
   const totalLabel = isSelectedDateToday ? today : selectedDateTotal;

   let message;

   if (!isSelectedDateToday) {
      message = "Total focus time";
   } else {
      switch (feedbackType) {
         case 'TODAY_TOTAL_ONLY':
            message = (
               <>
                  Nice work - <span className="text-white font-medium">{today}</span> today
               </>
            );
            break;
         case 'TODAY_TOTAL_GREATER':
            message = (
               <>
                  Great job — more focus today than yesterday
               </>
            );
            break;
         case 'NO_SESSIONS_YET':
            message = (
               <>
                  No sessions yet — start today to track your focus
               </>
            );
            break;
         case 'YESTERDAY_TOTAL_ONLY':
            message = (
               <>
                  No sessions yet — yesterday you had <span className="text-white font-medium">{!yesterday ? '0min' : yesterday}</span>
               </>
            );
            break;
         case 'TODAY_TOTAL_MATCH':
            message = (
               <>
                  Nice — you matched yesterday's focus time. <span className="text-white font-medium">Can you beat it today?</span>
               </>
            );
            break;
         case 'TODAY_LONGEST_GREATER':
            message = (
               <>
                  Great job — longest session today: <span className="text-white font-medium">{today}</span>.
               </>
            );
            break;
         case 'TODAY_AVERAGE_GREATER':
            message = (
               <>
                  You improved your average session today: <span className="text-white font-medium">{today}</span>.
               </>
            );
            break;
         default:
            message = 'No sessions yet — start today to track your focus';
            break;
      }
   }
  
   return (
      <div className="w-full min-w-[400px] h-auto flex flex-col items-start justify-start text-white gap-2 p-4 pl-5">
         <p className="text-[#474747] font-medium">{selectedDate.toDateString()}</p>
         <h1 className="text-4xl">{isLoading ? '0min' : totalLabel}</h1>
         <p className="text-[#a8a8a8] w-70">{message}</p>
      </div>
  )
}

export default FeedbackMessage;