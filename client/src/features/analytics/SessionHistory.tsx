import { EllipsisIcon } from "lucide-react";

const sessions = [
  { id: 1, label: 'Session 1', duration: '51min', time: '5:30AM-6:21AM' },
  { id: 2, label: 'Session 2', duration: '1hr05min', time: '8:00AM-9:05AM' },
  { id: 3, label: 'Session 3', duration: '30min', time: '6:15PM-6:45PM' },
];

export default function SessionHistory() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4 text-[#474747] font-medium mt-10">Session History</div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between gap-4 rounded-3xl bg-[#1F1F1F] px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
          >
            <div className="text-sm text-white/80">{session.label}</div>

            <div className="flex-1 text-center text-lg font-semibold text-white">
              {session.duration}
            </div>

            <div className="flex items-center gap-3 text-sm text-white/70">
              <span>{session.time}</span>
              <EllipsisIcon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}