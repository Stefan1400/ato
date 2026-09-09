import { expect, describe, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useAddSession } from "./useSessionTimer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { mockAddSession } = vi.hoisted(() => ({
    mockAddSession: vi.fn(),
}));

vi.mock("./tracker.api", () => ({
    addSession: mockAddSession,
}));

let queryClient: QueryClient;

const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
         {children}
      </QueryClientProvider>
);

const session = {
  session_started: new Date("2026-09-08T08:00:00.000Z"),
  session_ended: new Date("2026-09-08T08:35:00.000Z"),
};

const sessionResponse = {
   addedSession: {
      id: 1,
      user_id: 1,
      session_started: session.session_started,
      session_ended: session.session_ended,
      created_at: new Date("2026-09-08T08:00:00.000Z"),
      updated_at: new Date("2026-09-08T08:35:00.000Z"),
   }
};

describe("useAddSession", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      queryClient = new QueryClient();

      mockAddSession.mockResolvedValue(sessionResponse);
   });
   
   it('calls the addSession API with the provided session', async () => {
      const { result } = renderHook(() => useAddSession(), { 
         wrapper 
      }); 

      await act(async () => {
         result.current.mutate(session);
      });
      
      await waitFor(() => {
         expect(mockAddSession).toHaveBeenCalledWith(
            session,
            expect.anything()
         );
      });
   });

   it('invalidates the feedback query on successful mutation', async () => {
      const invalidateQueriesSpy = vi.spyOn(
         queryClient, 
         'invalidateQueries'
      );
      
      const { result } = renderHook(() => useAddSession(), { 
         wrapper 
      }); 

      await act(async () => {
         result.current.mutate(session);
      });
      
      await waitFor(() => {
         expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ["feedback"],
         });
      });
   });

   it('invalidates the sessions query on successful mutation', async () => {
      const invalidateQueriesSpy = vi.spyOn(
         queryClient, 
         'invalidateQueries'
      );
      
      const { result } = renderHook(() => useAddSession(), { 
         wrapper 
      }); 

      await act(async () => {
         result.current.mutate(session);
      });
      
      await waitFor(() => {
         expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ["sessions"],
         });
      });
   });
});