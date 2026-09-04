import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AnalyticsPage from "./AnalyticsPage";

vi.mock('../feedback/feedbackMessage', () => ({
   default: ({ selectedDate }: { selectedDate: Date }) => (
      <div>
         {selectedDate.toDateString()}
      </div>
   )
}));

vi.mock('./selectByDate/ViewByDate', () => ({
   default: ({ onOpen }: { onOpen: () => void }) => (
      <button 
         onClick={onOpen}
      >
         View by Date
      </button>
   )
}));

vi.mock('./sessions/SessionHistory', () => ({
   default: ({ selectedDate, onOpenDateSelector }: { selectedDate: Date, onOpenDateSelector?: () => void }) => (
      <div>
         <div>Session History - {selectedDate.toDateString()}</div>

         {onOpenDateSelector && (
            <div>
               <button onClick={onOpenDateSelector}>Open Date Selector</button>
            </div>
         )}
      </div>
   )
}));

vi.mock('./selectByDate/DateSelector', () => ({
   default: ({ selectedDate, onSelect, onClose }: { selectedDate: Date, onSelect: (date: Date) => void, onClose: () => void }) => (
      <div>
         <p>Selected Date - {selectedDate.toDateString()}</p>

         <button onClick={onClose}>Close Date Selector</button>

         <button onClick={() => onSelect(new Date(2026, 9, 3))}>Select Date</button>
      </div>
   )
}));

describe('AnalyticsPage', () => {
   beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 8, 2));
   });

   afterEach(() => {
      vi.useRealTimers();
   });
   
   it('renders analytics page', () => {
      render(
         <AnalyticsPage />
      );

      expect(
         screen.getByText('Wed Sep 02 2026')
      ).toBeInTheDocument();

      expect(
         screen.getByText('View by Date')
      ).toBeInTheDocument();

      expect(
         screen.getByText('Session History - Wed Sep 02 2026')
      ).toBeInTheDocument();

      expect(
         screen.getByText('Open Date Selector')
      ).toBeInTheDocument();
   });

   it('renders date selector when view by date button is clicked', () => {
      render(
         <AnalyticsPage />
      );
      
      fireEvent.click(screen.getByRole('button', { name: /view by date/i }));

      expect(screen.getByText('Selected Date - Wed Sep 02 2026')).toBeInTheDocument();
   });

   it('renders date selector when session history button is clicked', () => {
      render(
         <AnalyticsPage />
      );

      fireEvent.click(screen.getByRole('button', { name: /Open Date Selector/i }));

      expect(screen.getByText('Selected Date - Wed Sep 02 2026')).toBeInTheDocument();
   });

   it('closes date selector when close date selector button is clicked', () => {
      render(
         <AnalyticsPage />
      );

      fireEvent.click(screen.getByRole('button', { name: /Open Date Selector/i }));

      fireEvent.click(screen.getByRole('button', { name: /Close Date Selector/i }));

      expect(screen.queryByText('Selected Date - Wed Sep 02 2026')).not.toBeInTheDocument();
   });

   it('updates selected date and closes date selector after date is selected', () => {
      render(
         <AnalyticsPage />
      );

      fireEvent.click(screen.getByRole('button', { name: /Open Date Selector/i }));

      fireEvent.click(screen.getByRole('button', { name: /Select Date/i }));

       expect(
         screen.getByText('Sat Oct 03 2026')
      ).toBeInTheDocument();

      expect(
         screen.queryByText('Selected Date - Wed Sep 02 2026')
      ).not.toBeInTheDocument();
   });
});