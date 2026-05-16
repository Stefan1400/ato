import { useEffect, useState } from "react";
import { X } from "lucide-react";
import CalendarHeader from "./calendar/CalendarHeader";
import Calendar from "./calendar/Calendar";

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




export type DateSelectorProps = {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

export default function DateSelector({ selectedDate, onSelect, onClose }: DateSelectorProps) {
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
      <CalendarHeader
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        monthLabel={monthLabel}
      />

      {/* Weekday labels */}
      <Calendar
        calendarDays={calendarDays}
        weekdayNames={weekdayNames}
        selectedDate={selectedDate}
        onSelect={onSelect}
        isSameDay={isSameDay}
      />
    </div>
  );
}