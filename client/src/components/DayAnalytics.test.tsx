import DayAnalytics from "./DayAnalytics";
import { screen, render } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";

const { mockUseGetFeedback } = vi.hoisted(() => ({
   mockUseGetFeedback: vi.fn(),
}));

vi.mock('../features/feedback/useFeedback.ts', () => ({
   useGetFeedback: mockUseGetFeedback
}));

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="location">{location.pathname}</div>;
};

describe('DayAnalytics', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockUseGetFeedback.mockReturnValue({
         data: {
            feedbackType: 'NO_SESSIONS_YET',
            todayValue: '0min',
            yesterdayValue: '0min',
         },
         isLoading: false,
      })
   });

   it.each([
      [
         'TODAY_TOTAL_GREATER',
         'Great job — more focus today than yesterday',
         '1hr5min',
         '30min'
      ],
      [
         'TODAY_TOTAL_MATCH',
         "Nice — you matched yesterday's focus time",
         '30min',
         '30min'
      ],
      [
         'NO_SESSIONS_YET',
         'No sessions yet — start today to track your focus',
         '0min',
         '0min'
      ],
      [
         'TODAY_AVERAGE_GREATER',
         'Keep it up — stay focused',
         '1hr5min',
         '30min'
      ],
   ])(
      'displays the correct message for %s',
      (feedbackType, expectedMessage, todayTime, yesterdayTime) => {
         mockUseGetFeedback.mockReturnValue({
            data: {
               feedbackType,
               todayValue: todayTime,
               yesterdayValue: yesterdayTime,
            }
         })
         
         render(
            <MemoryRouter>
               <DayAnalytics />
            </MemoryRouter>
         );

         expect(screen.getByText(todayTime)).toBeInTheDocument();
         expect(screen.getByText(expectedMessage)).toBeInTheDocument();
      }
   );

   it('renders 0min in loading state', () => {
      mockUseGetFeedback.mockReturnValue({
         data: {
            feedbackType: 'TODAY_AVERAGE_GREATER',
            todayValue: '1hr5min',
            yesterdayValue: '35min',
         },
         isLoading: true,
      })
      
      render(
         <MemoryRouter>
            <DayAnalytics />
         </MemoryRouter>
      );

      expect(screen.getByText('0min')).toBeInTheDocument();
      expect(screen.queryByText('1hr5min')).not.toBeInTheDocument();
   });

   it('navigates to analytics page', async () => {
      render(
         <MemoryRouter initialEntries={['/dashboard']}>
            <DayAnalytics />
            <LocationDisplay />
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(
         screen.getByRole('button', { name: /view session history/i })
      );

      expect(screen.getByTestId('location')).toHaveTextContent('/analytics');
   });
});