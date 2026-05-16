type CalendarProps = {
  calendarDays: (Date | null)[];
  weekdayNames: string[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
  isSameDay: (date1: Date, date2: Date) => boolean;
};

export default function Calendar({ calendarDays, weekdayNames, selectedDate, onSelect, isSameDay }: CalendarProps) {
  return (
      <>
         <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs uppercase text-white/40">
        {weekdayNames.map((weekday) => (
          <div key={weekday}>{weekday}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          const emptyCell = date === null;

          let buttonStyles =
            "h-11 rounded-2xl border";

          if (emptyCell) {
            buttonStyles += " cursor-default bg-transparent";
          } else if (isSameDay(date, selectedDate)) {
            buttonStyles +=
              " border-transparent bg-white text-black";
          } else {
            buttonStyles +=
              " border-white/10 bg-white/5 text-white/80 hover:bg-white/10";
          }

          return (
            <button
              key={index}
              disabled={emptyCell}
              onClick={() => {
                if (date) {
                  onSelect(date);
                }
              }}
              className={buttonStyles}
            >
              {date ? date.getDate() : ""}
            </button>
          );
        })}
      </div>
      </>
  )
}