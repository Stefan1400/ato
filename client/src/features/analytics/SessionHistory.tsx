import { useGetSessionsByDate } from "./useAnalytics";
import formatTime from "./helpers/FormatTime";
import SessionCard from "./SessionCard";

type SessionHistoryProps = {
  selectedDate: Date;
};

export default function SessionHistory({ selectedDate }: SessionHistoryProps) {
  const queryDate = selectedDate.toISOString().slice(0, 10);
  const { data: sessionsData, isLoading, error } = useGetSessionsByDate(queryDate);

  // loading / error / empty states
  if (isLoading) return <div className="text-white mt-60">Loading...</div>;
  
  if (!sessionsData || sessionsData.length === 0) {
    return <div className="text-white mt-60">No sessions found for this date.</div>;
  }
  
  if (error) return <div className="text-white mt-60">Error loading sessions</div>;

  // Sort sessions by start time (oldest first)
  const sortedSessions = sessionsData
    ? [...sessionsData].sort(
        (a, b) =>
          new Date(a.session_started).getTime() - new Date(b.session_started).getTime()
      )
    : [];

  return (
    <div className="w-full max-w-3xl mx-auto pb-7">
      <div className="mb-4 text-[#474747] font-medium mt-10">Session History - {selectedDate.toDateString()}</div>

      {/* map sessions to SessionCard components */}
      <div className="space-y-3">
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
  );
}