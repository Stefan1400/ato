import { EllipsisIcon } from "lucide-react";
import { useGetSessionsByDate } from "./useAnalytics";

function formatDuration(ms: number) {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}hrs`;
  return `${hours}hrs ${minutes}min`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SessionHistory() {
  const { data: sessionsData, isLoading, error } = useGetSessionsByDate("2026-05-14");

  if (!sessionsData || sessionsData.length === 0) {
    return <div className="text-white">No sessions found for this date.</div>;
  }

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-white">Error loading sessions</div>;

  const sortedSessions = sessionsData
    ? [...sessionsData].sort(
        (a, b) =>
          new Date(a.session_started).getTime() -
          new Date(b.session_started).getTime()
      )
    : [];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4 text-[#474747] font-medium mt-10">Session History - 2026-05-14</div>

      <div className="space-y-3">
        {sortedSessions.map((session, index) => {
          const started = new Date(session.session_started);
          const ended = new Date(session.session_ended);
          const durationMs = ended.getTime() - started.getTime();
          const timeframe = `${formatTime(started)} - ${formatTime(ended)}`;

          return (
            <div
              key={session.id}
              className="flex flex-col gap-3 rounded-md bg-[#1F1F1F] px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-white/80">Session {index + 1}</div>

                <button type="button">
                  <EllipsisIcon color="white" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-lg font-semibold text-white">{formatDuration(durationMs)}</div>
                <div className="text-sm text-white/70">{timeframe}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}