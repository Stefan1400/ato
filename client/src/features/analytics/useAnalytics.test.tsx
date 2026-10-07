import { expect, describe, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetSessionsByDate } from "./useAnalytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { mockGetSessionsByDate } = vi.hoisted(() => ({
  mockGetSessionsByDate: vi.fn(),
}));

vi.mock("./analytics.api", () => ({
   getSessionsByDate: mockGetSessionsByDate,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
   <QueryClientProvider client={queryClient}>
      {children}
   </QueryClientProvider>
);

let queryClient: QueryClient;

const range = {
   start: '2026-09-07T07:00:00.000Z',
   end: '2026-09-08T07:00:00.000Z',
};

describe("useGetSessionsByDate", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      queryClient = new QueryClient();

      mockGetSessionsByDate.mockResolvedValue([]);
   });
   
   it('fetches sessions for the provided date', async () => {
      renderHook(() => 
         useGetSessionsByDate(range), { 
            wrapper 
         }
      ); 
      
      await waitFor(() => {
         expect(mockGetSessionsByDate).toHaveBeenCalledWith(range);
      });
   });

   it('returns the sessions from the API', async () => {

      const sessions = [
         {
            id: 1,
            date: range.start.slice(0, 10),
         },
      ];

      mockGetSessionsByDate.mockResolvedValue(sessions);

      const { result } = renderHook(() => 
         useGetSessionsByDate(range), { 
            wrapper 
         }
      ); 
      
      await waitFor(() => {
         expect(result.current.data).toEqual(sessions);
      });
   });

   it('uses both ISO boundaries in the query cache key', () => {
      const nextRange = {
         start: '2026-09-08T07:00:00.000Z',
         end: '2026-09-09T07:00:00.000Z',
      };

      renderHook(() => useGetSessionsByDate(range), { wrapper });
      renderHook(() => useGetSessionsByDate(nextRange), { wrapper });

      const queryKeys = queryClient.getQueryCache().getAll().map(query => query.queryKey);
      expect(queryKeys).toContainEqual(['sessions', range.start, range.end]);
      expect(queryKeys).toContainEqual(['sessions', nextRange.start, nextRange.end]);
   });
});
