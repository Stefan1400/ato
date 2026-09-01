import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import FeedbackMessage from "./feedbackMessage";
import { MemoryRouter } from "react-router-dom";

const { mockUseGetFeedback, mockUseGetSessionsByDate } = vi.hoisted(() => ({
   mockUseGetFeedback: vi.fn(),
   mockUseGetSessionsByDate: vi.fn(),
}));

vi.mock("./useFeedback", () => ({
   useGetFeedback: mockUseGetFeedback
}));

vi.mock("../analytics/useAnalytics", () => ({
   useGetSessionsByDate: mockUseGetSessionsByDate
}));

describe("FeedbackMessage", () => {

   beforeEach(() => {
      vi.clearAllMocks();

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: "30min",
            yesterdayValue: "20min",
            feedbackType: "TODAY_TOTAL_ONLY"
         },
         isLoading: false
      });

      mockUseGetSessionsByDate.mockReturnValue({
         data: [],
         isLoading: false
      });

   });

   it("renders selected date", () => {
      
      const selectedDate = new Date(2026, 7, 31);

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={selectedDate} />
         </MemoryRouter>
      );

      expect(
         screen.getByText(selectedDate.toDateString())
      ).toBeInTheDocument();

   });

   it("uses selected date when fetching sessions", () => {

      const selectedDate = new Date(2026, 7, 31);

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={selectedDate} />
         </MemoryRouter>
      );

      expect(mockUseGetSessionsByDate).toHaveBeenCalledWith(
         selectedDate.toISOString().slice(0, 10)
      );
   });

   it("displays today's total when selected date is today", () => {

      const today = new Date();

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: "45min",
            yesterdayValue: null,
            feedbackType: "TODAY_TOTAL_ONLY"
         },
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={today} />
         </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: /45min/i })).toBeInTheDocument();
   });

   it("displays total session duration when selected date is not today", () => {

      const selectedDate = new Date(2026, 7, 31);

      mockUseGetSessionsByDate.mockReturnValue({
         data: [
            {
               session_started: "2026-08-31T10:00:00.000Z",
               session_ended: "2026-08-31T10:30:00.000Z"
            },
            {
               session_started: "2026-08-31T11:00:00.000Z",
               session_ended: "2026-08-31T11:45:00.000Z"
            }
         ],
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={selectedDate} />
         </MemoryRouter>
      );

      expect(screen.getByText("1hrs 15min")).toBeInTheDocument();
   });

   it("displays 0min while today's feedback is loading", () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: "45min",
            yesterdayValue: null,
            feedbackType: "TODAY_TOTAL_ONLY"
         },
         isLoading: true
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(screen.getByText("0min")).toBeInTheDocument();

   });

   it("displays 0min while selected date sessions are loading", () => {

      const selectedDate = new Date(2026, 7, 31);

      mockUseGetSessionsByDate.mockReturnValue({
         data: [],
         isLoading: true
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={selectedDate} />
         </MemoryRouter>
      );

      expect(screen.getByText("0min")).toBeInTheDocument();
   });

   it("displays TODAY_TOTAL_ONLY feedback", () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: "30min",
            yesterdayValue: null,
            feedbackType: "TODAY_TOTAL_ONLY"
         },
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(
         screen.getByRole("heading", { name: /30min/i })
      ).toBeInTheDocument();
      
      expect(screen.getByText(/Nice work -/i)).toBeInTheDocument();
   });

   it("displays TODAY_TOTAL_GREATER feedback", () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: "45min",
            yesterdayValue: "30min",
            feedbackType: "TODAY_TOTAL_GREATER"
         },
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(
         screen.getByText("Great job — more focus today than yesterday")
      ).toBeInTheDocument();

   });

   it("displays NO_SESSIONS_YET feedback", () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: null,
            yesterdayValue: "30min",
            feedbackType: "NO_SESSIONS_YET"
         },
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(
         screen.getByText("No sessions yet — start today to track your focus")
      ).toBeInTheDocument();
   });

   it("displays YESTERDAY_TOTAL_ONLY feedback", () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: null,
            yesterdayValue: "35min",
            feedbackType: "YESTERDAY_TOTAL_ONLY"
         },
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(screen.getByText(/No sessions yet/)).toBeInTheDocument();

      expect(screen.getByText("35min")).toBeInTheDocument();
   });

   it("displays TODAY_TOTAL_MATCH feedback", () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: "30min",
            yesterdayValue: "30min",
            feedbackType: "TODAY_TOTAL_MATCH"
         },
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(
         screen.getByRole("heading", { name: /30min/ })
      ).toBeInTheDocument();

      expect(
         screen.getByText(/Nice — you matched yesterday's focus time/)
      ).toBeInTheDocument();

      expect(
         screen.getByText("Can you beat it today?")
      ).toBeInTheDocument();
   });

   it("displays TODAY_LONGEST_GREATER feedback", () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: "50min",
            yesterdayValue: "30min",
            feedbackType: "TODAY_LONGEST_GREATER"
         },
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(
         screen.getByRole("heading", { name: /50min/ })
      ).toBeInTheDocument();

      expect(
         screen.getByText(/Great job — longest session today/)
      ).toBeInTheDocument();
   });

   it("displays TODAY_AVERAGE_GREATER feedback", () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: "40min",
            yesterdayValue: "30min",
            feedbackType: "TODAY_AVERAGE_GREATER"
         },
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(
         screen.getByRole("heading", { name: /40min/ })
      ).toBeInTheDocument();

      expect(
         screen.getByText(/You improved your average session today/)
      ).toBeInTheDocument();
   });

   it("displays default feedback when feedback type is unavailable", () => {

      mockUseGetFeedback.mockReturnValue({
         data: undefined,
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={new Date()} />
         </MemoryRouter>
      );

      expect(
         screen.getByText("No sessions yet — start today to track your focus")
      ).toBeInTheDocument();
   });

   it("ignores invalid session durations", () => {

      const selectedDate = new Date(2026, 7, 31);

      mockUseGetSessionsByDate.mockReturnValue({
         data: [
            {
               session_started: "2026-08-31T11:00:00.000Z",
               session_ended: "2026-08-31T10:00:00.000Z"
            },
            {
               session_started: "2026-08-31T12:00:00.000Z",
               session_ended: "2026-08-31T12:30:00.000Z"
            }
         ],
         isLoading: false
      });

      render(
         <MemoryRouter>
            <FeedbackMessage selectedDate={selectedDate} />
         </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: "30min" })).toBeInTheDocument();
   });
});