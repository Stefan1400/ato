import { expect, describe, it, vi, beforeEach } from "vitest";
import { getSessionsByDate } from "./analytics.api";

const { mockApi } = vi.hoisted(() => ({
    mockApi: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
    api: mockApi,
}));

const fetchedSessions = [
   {
      id: 1,
      user_id: 5,
      session_started: new Date("2026-09-08T08:00:00.000Z"),
      session_ended: new Date("2026-09-08T08:35:00.000Z"),
      created_at: new Date("2026-09-08T08:00:00.000Z"),
      updated_at: new Date("2026-09-08T08:35:00.000Z"),
   }
];

const selectedDate = new Date(2026, 9, 10).toDateString();

describe('getSessionsByDate', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockApi.mockResolvedValue({
         fetchedSessions
      });
   });
   
   it("calls the analytics API and returns the fetched sessions for the selected date", async () => {
      const result = await getSessionsByDate(selectedDate);

      expect(mockApi).toHaveBeenCalledWith(`/sessions?date=${selectedDate}`, "GET");
      expect(result).toEqual(fetchedSessions);
   });

   it("returns an empty array if no sessions exist for the selected date", async () => {
      mockApi.mockRejectedValue(new Error('404'));
      
      const result = await getSessionsByDate(selectedDate);

      expect(result).toEqual([]);
   });

   it("rethrows non-404 errors", async () => {
      const error = new Error("500 Internal Server Error");

      mockApi.mockRejectedValue(error);

      await expect(getSessionsByDate(selectedDate)).rejects.toThrow(
         error
      )
   });
});