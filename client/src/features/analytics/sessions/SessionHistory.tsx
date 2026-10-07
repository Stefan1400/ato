import { useEffect, useRef } from 'react';
import { useGetSessionsByDate } from "../useAnalytics";
import formatTimeOfDay from "../helpers/FormatTimeOfDay";
import SessionCard from "./SessionCard";
import { useToast } from "../../../components/Toast";
import ViewByDate from "../selectByDate/ViewByDate";
import getLocalDayRange, { getLocalDateKey } from "../helpers/LocalDayRange";

type SessionHistoryProps = {
  selectedDate: Date;
  onOpenDateSelector?: () => void;
};

export default function SessionHistory({ selectedDate, onOpenDateSelector }: SessionHistoryProps) {
  const queryDate = getLocalDateKey(selectedDate);
  const dayRange = getLocalDayRange(selectedDate);
  const { data: sessionsData, isLoading, error, refetch } = useGetSessionsByDate(dayRange);
  const { showToast } = useToast();
  const showedEmptyToastDate = useRef<string | null>(null);
  const showedErrorToastDate = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoading && !error && sessionsData && sessionsData.length === 0 && showedEmptyToastDate.current !== queryDate) {
      showedEmptyToastDate.current = queryDate;
      showToast({ type: 'info', message: 'No sessions found for this date.', duration: 3000 });
    }

    if (!isLoading && error && showedErrorToastDate.current !== queryDate) {
      showedErrorToastDate.current = queryDate;
      showToast({ type: 'error', message: 'Error loading sessions', duration: 3000 });
    }
  }, [isLoading, error, sessionsData, showToast, queryDate]);

  const header = (
    <div className="mb-4 mt-10 flex items-center justify-between gap-4 text-[#474747] font-medium lg:mt-0">
      <div className='flex items-center justify-center'>Session History - {selectedDate.toDateString()}</div>
      {onOpenDateSelector && (
        <div className="hidden lg:block flex items-center justify-center">
          <ViewByDate onOpen={onOpenDateSelector} />
        </div>
      )}
    </div>
  );

  // loading / error / empty states
  if (isLoading) {
    return (
      <div className="w-full lg:flex lg:h-full lg:flex-col">
        {header}
        <div className="text-white mt-60 lg:mt-0">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full lg:flex lg:h-full lg:flex-col">
        {header}
        <div className="text-white mt-60 lg:mt-0">Error loading sessions</div>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 w-fit rounded-md bg-[#2A2A2A] px-4 py-2 text-white transition-colors hover:bg-[#333333] cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!sessionsData || sessionsData.length === 0) {
    return (
      <div className="w-full lg:flex lg:h-full lg:flex-col">
        {header}
        <div className="text-white mt-60 lg:mt-0">No sessions found for this date.</div>
      </div>
    );
  }

  // Sort sessions by start time (oldest first)
  const sortedSessions = sessionsData
    ? [...sessionsData].sort(
        (b, a) =>
          new Date(a.session_started).getTime() - 
          new Date(b.session_started).getTime()
      )
    : [];

  return (
    <div className="w-full lg:flex lg:h-full lg:flex-col">
      {header}

      <div className="w-full lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2 custom-scrollbar">
        <div className="space-y-3 pb-7 lg:pb-4">
          {sortedSessions.map((session) => {
            const started = new Date(session.session_started);
            const ended = new Date(session.session_ended);
            const durationMs = ended.getTime() - started.getTime();
            const timeframe = `${formatTimeOfDay(started)} - ${formatTimeOfDay(ended)}`;

            return (
              <SessionCard
                key={session.id}
                session={session}
                durationMs={durationMs}
                timeframe={timeframe}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}