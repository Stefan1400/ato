import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Calendar from "./Calendar";
import { isSameDay } from "../selectByDate/DateSelector";

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const selectedDate = new Date(2026, 9, 3);

const calendarDays = [ 
   null, 
   null, 
   new Date(2026, 9, 1), 
   new Date(2026, 9, 2), 
   new Date(2026, 9, 3), 
   new Date(2026, 9, 4), 
];

describe('Calendar', () => {
   it('renders all weekday names', () => {
      render(
         <Calendar 
            calendarDays={calendarDays}
            weekdayNames={weekdayNames}
            selectedDate={selectedDate}
            onSelect={vi.fn()}
            isSameDay={isSameDay}
         />
      );

      weekdayNames.forEach((weekday) => {
         expect(screen.getByText(weekday)).toBeInTheDocument();
      });
   });

   it('renders all calendar days', () => {
      render(
         <Calendar 
            calendarDays={calendarDays}
            weekdayNames={weekdayNames}
            selectedDate={selectedDate}
            onSelect={vi.fn()}
            isSameDay={isSameDay}
         />
      );

      calendarDays.forEach((date) => {
         if (date) {
            expect(screen.getByText(date.getDate())).toBeInTheDocument();
         };
      });
   });

   it('renders empty cells as disabled', () => {
      render(
         <Calendar 
            calendarDays={calendarDays}
            weekdayNames={weekdayNames}
            selectedDate={selectedDate}
            onSelect={vi.fn()}
            isSameDay={isSameDay}
         />
      );

      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).toBeDisabled();
      expect(buttons[1]).toBeDisabled();
   });

   it('applies selected styling to the selected date', () => {
      render(
         <Calendar 
            calendarDays={calendarDays}
            weekdayNames={weekdayNames}
            selectedDate={selectedDate}
            onSelect={vi.fn()}
            isSameDay={isSameDay}
         />
      );

      const selectedButton = screen.getByRole("button", { name: "3" }); 
      
      expect(selectedButton).toHaveClass("bg-white"); 
      expect(selectedButton).toHaveClass("text-black");
   });

   it('calls onSelect with the clicked date', async () => {
      const onSelect = vi.fn();
      
      render(
         <Calendar 
            calendarDays={calendarDays}
            weekdayNames={weekdayNames}
            selectedDate={selectedDate}
            onSelect={onSelect}
            isSameDay={isSameDay}
         />
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: '2' }));

      expect(onSelect).toHaveBeenCalledWith(
         new Date(2026, 9, 2)
      );
   });
});