import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CalendarHeader from "./CalendarHeader";

describe("CalendarHeader", () => {
   it("displays month label", () => {

      render(
         <CalendarHeader
            goToPreviousMonth={vi.fn()}
            goToNextMonth={vi.fn()}
            monthLabel="September 2026"
         />
      );

      expect(screen.getByText("September 2026")).toBeInTheDocument();
   });

   it("calls goToPreviousMonth when previous month button is clicked", async () => {

      const goToPreviousMonth = vi.fn();

      render(
         <CalendarHeader
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={vi.fn()}
            monthLabel="September 2026"
         />
      );

      const user = userEvent.setup();

      await user.click(
         screen.getByRole("button", { name: /Go To Previous Month/i })
      );

      expect(goToPreviousMonth).toHaveBeenCalled();
   });

   it("calls goToNextMonth when next month button is clicked", async () => {

      const goToNextMonth = vi.fn();

      render(
         <CalendarHeader
            goToPreviousMonth={vi.fn()}
            goToNextMonth={goToNextMonth}
            monthLabel="September 2026"
         />
      );

      const user = userEvent.setup();

      await user.click(
         screen.getByRole("button", { name: /Go To Next Month/i })
      );

      expect(goToNextMonth).toHaveBeenCalled();
   });
});