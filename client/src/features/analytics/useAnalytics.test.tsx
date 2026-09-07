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

const date = '2026-09-07';

describe("useGetSessionsByDate", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      queryClient = new QueryClient();

      mockGetSessionsByDate.mockResolvedValue([]);
   });
   
   it('fetches sessions for the provided date', async () => {
      renderHook(() => 
         useGetSessionsByDate(date), { 
            wrapper 
         }
      ); 
      
      await waitFor(() => {
         expect(mockGetSessionsByDate).toHaveBeenCalledWith(date);
      });
   });

   it('returns the sessions from the API', async () => {

      const sessions = [
         {
            id: 1,
            date,
         },
      ];

      mockGetSessionsByDate.mockResolvedValue(sessions);

      const { result } = renderHook(() => 
         useGetSessionsByDate(date), { 
            wrapper 
         }
      ); 
      
      await waitFor(() => {
         expect(result.current.data).toEqual(sessions);
      });
   });
});
