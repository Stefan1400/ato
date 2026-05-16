import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Create all calendar cells for a month
function getCalendarDays(year: number, month: number) {
  const days: Array<Date | null> = [];

  // What weekday does the month start on?
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay();

//   console.log('startWeekday', startWeekday);
  

  // Add empty cells before the 1st
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
   //  console.log('days:', days);
  }

  // How many days are in this month?
  const lastDayOfMonth = new Date(year, month + 1, 0);
//   console.log('lastDayOfMonth', lastDayOfMonth);
  
  const totalDays = lastDayOfMonth.getDate();
//   console.log('totalDays', totalDays);
  

  // Add actual dates
  for (let day = 1; day <= totalDays; day++) {
    days.push(new Date(year, month, day));
    
  }

  return days;
}

// Compare two dates
function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}









type DateSelectorProps = {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

export default function DateSelector({
  selectedDate,
  onSelect,
  onClose,
}: DateSelectorProps) {
  // Which month is currently visible in the calendar
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate)
  );

  // If selected date changes externally, sync calendar view
  useEffect(() => {
    setCurrentMonth(new Date(selectedDate));
  }, [selectedDate]);

  // Generate all visible calendar cells
  const calendarDays = getCalendarDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

//   console.log('calendarDays:', calendarDays);
  

  const monthLabel = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  function goToPreviousMonth() {
    setCurrentMonth((prev) => {
      return new Date(
        prev.getFullYear(),
        prev.getMonth() - 1,
        1
      );
    });
  }

  function goToNextMonth() {
    setCurrentMonth((prev) => {
      return new Date(
        prev.getFullYear(),
        prev.getMonth() + 1,
        1
      );
    });
  }

  return (
    <div className="fixed top-10 mt-5 h-screen w-full max-w-3xl bg-[#181818] p-5 shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <p className="text-sm text-white/40">
          View Sessions by Date
        </p>

        <button
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>

      {/* Month navigation */}
      <div className="mt-5 flex items-center justify-between rounded-full bg-white/5 px-3 py-2">
        <button
          onClick={goToPreviousMonth}
          className="rounded-full p-2 hover:bg-white/10"
        >
          <ChevronLeft size={16} color="white" />
        </button>

        <span className="font-medium text-white">
          {monthLabel}
        </span>

        <button
          onClick={goToNextMonth}
          className="rounded-full p-2 hover:bg-white/10"
        >
          <ChevronRight size={16} color="white" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs uppercase text-white/40">
        {weekdayNames.map((weekday) => (
          <div key={weekday}>{weekday}</div>
        ))}
      </div>

      {/* Calendar grid */}
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
    </div>
  );
}