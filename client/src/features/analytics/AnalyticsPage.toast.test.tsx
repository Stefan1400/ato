import { StrictMode } from "react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "../../components/Toast";
import AnalyticsPage from "./AnalyticsPage";
import { useGetSessionsByDate } from "./useAnalytics";

vi.mock("../feedback/feedbackMessage", () => ({
  default: () => <div>Feedback</div>,
}));

vi.mock("./useAnalytics", () => ({
  useGetSessionsByDate: vi.fn(),
}));

vi.mock("./selectByDate/DateSelector", () => ({
  default: ({ onSelect }: { onSelect: (date: Date) => void }) => (
    <div>
      <button onClick={() => onSelect(new Date(2026, 8, 1))}>Previous date</button>
      <button onClick={() => onSelect(new Date(2026, 8, 3))}>Future date</button>
    </div>
  ),
}));

describe("AnalyticsPage empty-session toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 2, 12));
    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows one empty-session toast on initial analytics navigation and one per selected date", () => {
    render(
      <StrictMode>
        <MemoryRouter initialEntries={["/"]}>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Link to="/analytics">Open Analytics</Link>} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </ToastProvider>
        </MemoryRouter>
      </StrictMode>
    );

    fireEvent.click(screen.getByRole("link", { name: "Open Analytics" }));

    expect(screen.getAllByRole("button", { name: "close toast" })).toHaveLength(1);
    expect(screen.getAllByText("No sessions found for this date.")).toHaveLength(2);

    fireEvent.click(screen.getAllByRole("button", { name: /view by date/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Previous date" }));

    expect(screen.getAllByRole("button", { name: "close toast" })).toHaveLength(2);

    fireEvent.click(screen.getAllByRole("button", { name: /view by date/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Future date" }));

    expect(screen.getAllByRole("button", { name: "close toast" })).toHaveLength(3);
  });
});