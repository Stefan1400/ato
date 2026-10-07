import { expect, describe, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetFeedback } from "./useFeedback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import getLocalDayRange from "../analytics/helpers/LocalDayRange";

const { mockGetFeedback } = vi.hoisted(() => ({
    mockGetFeedback: vi.fn(),
}));

vi.mock("./feedback.api", () => ({
    getFeedback: mockGetFeedback,
}));

let queryClient: QueryClient;

const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
         {children}
      </QueryClientProvider>
);

describe("useGetFeedback", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      queryClient = new QueryClient();

      mockGetFeedback.mockResolvedValue([]);
   });
   
   it('calls the feedback API', async () => {
      renderHook(() => 
         useGetFeedback(), { 
            wrapper 
         }
      ); 
      
      await waitFor(() => {
         expect(mockGetFeedback).toHaveBeenCalledWith(expect.objectContaining({
            today: expect.objectContaining({ start: expect.any(String), end: expect.any(String) }),
            yesterday: expect.objectContaining({ start: expect.any(String), end: expect.any(String) }),
         }));
      });
   });

   it('keys feedback cache by local today and yesterday boundaries', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const todayRange = getLocalDayRange(today);
      const yesterdayRange = getLocalDayRange(yesterday);

      renderHook(() => useGetFeedback(), { wrapper });

      expect(queryClient.getQueryCache().getAll()[0]?.queryKey).toEqual([
         "feedback",
         todayRange.start,
         todayRange.end,
         yesterdayRange.start,
         yesterdayRange.end,
      ]);
   });

   it('returns the feedback from the API', async () => {
      const feedback = { 
         feedbackType: "TODAY_TOTAL_ONLY",
         todayValue: "35min",
         yesterdayValue: null,
       };
      
      mockGetFeedback.mockResolvedValue(feedback);

       const { result } = renderHook(() => 
         useGetFeedback(), {
            wrapper 
         }
      ); 
      
      await waitFor(() => {
         expect(result.current.data).toEqual(feedback);
      });
   });
});