import { EllipsisIcon } from "lucide-react";
import formatDuration from "./helpers/FormatDuration";

export default function SessionCard({ session, index, durationMs, timeframe }: any) {
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
  )
}