import { useEffect, useState } from 'react';
import { useGetSessionsByDate } from "../useAnalytics";
import formatTime from "../helpers/FormatTime";
import SessionCard from "./SessionCard";
import { useToast } from "../../../components/Toast";
import ViewByDate from "../selectByDate/ViewByDate";

type SessionHistoryProps = {
  selectedDate: Date;
  onOpenDateSelector?: () => void;
};

export default function SessionHistory({ selectedDate, onOpenDateSelector }: SessionHistoryProps) {
  const queryDate = selectedDate.toISOString().slice(0, 10);
  const { data: sessionsData, isLoading, error } = useGetSessionsByDate(queryDate);
  const { showToast } = useToast();
  const [showedEmptyToastDate, setShowedEmptyToastDate] = useState<string | null>(null);
  const [showedErrorToastDate, setShowedErrorToastDate] = useState<string | null>(null);

  useEffect(() => {
    setShowedEmptyToastDate(null);
    setShowedErrorToastDate(null);
  }, [queryDate]);

  useEffect(() => {
    if (!isLoading && !error && sessionsData && sessionsData.length === 0 && showedEmptyToastDate !== queryDate) {
      showToast({ type: 'info', message: 'No sessions found for this date.', duration: 3000 });
      setShowedEmptyToastDate(queryDate);
    }

    if (!isLoading && error && showedErrorToastDate !== queryDate) {
      showToast({ type: 'error', message: 'Error loading sessions', duration: 3000 });
      setShowedErrorToastDate(queryDate);
    }
  }, [isLoading, error, sessionsData, showToast, showedEmptyToastDate, showedErrorToastDate, queryDate]);

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
        <div className="text-white mt-60 lg:mt-0">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full lg:flex lg:h-full lg:flex-col">
        {header}
        <div className="text-white mt-60 lg:mt-0">Error loading sessions</div>
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
        (a, b) =>
          new Date(a.session_started).getTime() - new Date(b.session_started).getTime()
      )
    : [];

  return (
    <div className="w-full lg:flex lg:h-full lg:flex-col">
      {header}

      <div className="w-full lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
        <div className="space-y-3 pb-7 lg:pb-4">
          {sortedSessions.map((session, index) => {
            const started = new Date(session.session_started);
            const ended = new Date(session.session_ended);
            const durationMs = ended.getTime() - started.getTime();
            const timeframe = `${formatTime(started)} - ${formatTime(ended)}`;

            return (
              <SessionCard
                key={session.id}
                session={session}
                index={index}
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