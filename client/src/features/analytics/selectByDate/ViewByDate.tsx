import { CalendarDays } from "lucide-react";

type ViewByDateProps = {
  onOpen: () => void;
};

export default function ViewByDate({ onOpen }: ViewByDateProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mt-3 inline-flex items-center self-end gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 cursor-pointer"
    >
      <CalendarDays size={16} />
      <span>View by Date</span>
    </button>
  );
}
