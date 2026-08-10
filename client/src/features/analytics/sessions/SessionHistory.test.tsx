import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SessionHistory from "./SessionHistory";
import userEvent from "@testing-library/user-event";

vi.mock("../useAnalytics", () => ({
  useGetSessionsByDate: vi.fn(),
}));

vi.mock('./SessionCard', () => ({
   default: ({ durationMs, timeframe }: any) => (
      <div data-testid="session-card">
         <div>{durationMs}</div>
         <div>{timeframe}</div>
      </div>
   )
}));

vi.mock('../selectByDate/ViewByDate', () => ({
   default: ({ onOpen }: any) => (
      <button 
        onClick={onOpen}
        >View By Date</button>
   )
}));

import { useGetSessionsByDate } from "../useAnalytics";

const selectedDate = new Date("2026-08-09T12:00:00");

describe("SessionHistory", () => {

  beforeEach(() => {
    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
  });


  it("renders the session history header", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory selectedDate={selectedDate} />
      </QueryClientProvider>
    );

    expect(
      screen.getByText(`Session History - ${selectedDate.toDateString()}`)
    ).toBeInTheDocument();
  });

  it("renders loading while sessions are loading", () => {
    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory selectedDate={selectedDate} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Loading sessions...")).toBeInTheDocument();
  });

  it("renders error message after unsuccessful session load", () => {
    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Failed to load sessions"),
    } as any);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory selectedDate={selectedDate} />
      </QueryClientProvider>
    );

    expect(screen.getByText("Error loading sessions")).toBeInTheDocument();
  });

  it("renders no sessions message when no sessions are found", () => {
    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory selectedDate={selectedDate} />
      </QueryClientProvider>
    );

    expect(screen.getByText("No sessions found for this date.")).toBeInTheDocument();
  });

  it("renders session when sessions are found", () => {
    const sessions = [
      {
        id: 1,
        session_started: "2026-08-09T10:00:00.000Z",
        session_ended: "2026-08-09T10:30:00.000Z",
      },
    ];

    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: sessions,
      isLoading: false,
      error: null,
    } as any);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory selectedDate={selectedDate} />            
      </QueryClientProvider>
    );

    expect(screen.getByText("1800000")).toBeInTheDocument();
  });

  it("renders multiple sessions", () => {
    const sessions = [
      {
        id: 1,
        session_started: "2026-08-09T10:00:00.000Z",
        session_ended: "2026-08-09T10:30:00.000Z",
      },
      {
        id: 2,
        session_started: "2026-08-09T12:00:00.000Z",
        session_ended: "2026-08-09T13:00:00.000Z",
      },
    ];
    
    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: sessions,
      isLoading: false,
      error: null,
    } as any);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory selectedDate={selectedDate} />            
      </QueryClientProvider>
    );

    expect(screen.getByText("1800000")).toBeInTheDocument();
    expect(screen.getByText("3600000")).toBeInTheDocument();
  });

  it("renders sessions in the correct order", () => {
    const sessions = [
      {
        id: 1,
        session_started: "2026-08-09T10:00:00.000Z",
        session_ended: "2026-08-09T10:15:00.000Z",
      },
      {
        id: 2,
        session_started: "2026-08-09T11:00:00.000Z",
        session_ended: "2026-08-09T11:30:00.000Z",
      },
      {
        id: 3,
        session_started: "2026-08-09T13:00:00.000Z",
        session_ended: "2026-08-09T14:00:00.000Z",
      },
    ];
    
    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: sessions,
      isLoading: false,
      error: null,
    } as any);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory selectedDate={selectedDate} />            
      </QueryClientProvider>
    );

    const cards = screen.getAllByTestId("session-card");
    
    expect(cards[0]).toHaveTextContent("3600000");
    expect(cards[1]).toHaveTextContent("1800000");
    expect(cards[2]).toHaveTextContent("900000");
  });

  it("renders sessions newest to oldest with correct timeframes", () => {
    const sessions = [
      {
        id: 1,
        session_started: "2026-08-09T10:00:00.000Z",
        session_ended: "2026-08-09T10:15:00.000Z",
      },
      {
        id: 2,
        session_started: "2026-08-09T11:00:00.000Z",
        session_ended: "2026-08-09T11:30:00.000Z",
      },
      {
        id: 3,
        session_started: "2026-08-09T13:00:00.000Z",
        session_ended: "2026-08-09T14:00:00.000Z",
      },
    ];
    
    vi.mocked(useGetSessionsByDate).mockReturnValue({
      data: sessions,
      isLoading: false,
      error: null,
    } as any);

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory selectedDate={selectedDate} />            
      </QueryClientProvider>
    );

    const cards = screen.getAllByTestId("session-card");

    expect(cards[0]).toHaveTextContent("06:00 - 07:00");
    expect(cards[1]).toHaveTextContent("04:00 - 04:30");
    expect(cards[2]).toHaveTextContent("03:00 - 03:15");
  });

  it("calls onOpenDateSelector when View By Date is clicked", async () => {
    const user = userEvent.setup();

    const onOpenDateSelector = vi.fn();

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SessionHistory 
          selectedDate={selectedDate} 
          onOpenDateSelector={onOpenDateSelector}
        />            
      </QueryClientProvider>
    );

    await user.click(
      screen.getByRole('button', { name: /view by date/i })
    );

    expect(onOpenDateSelector).toHaveBeenCalled();
  });
});