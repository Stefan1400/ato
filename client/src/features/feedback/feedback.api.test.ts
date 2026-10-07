import { expect, describe, it, vi, beforeEach } from "vitest";
import { getFeedback } from "./feedback.api";

const { mockApi } = vi.hoisted(() => ({
    mockApi: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
    api: mockApi,
}));

const feedback = {
   feedbackType: "TODAY_TOTAL_ONLY",
   todayValue: "30min",
   yesterdayValue: null,
};

const ranges = {
   today: {
      start: "2026-10-06T07:00:00.000Z",
      end: "2026-10-07T07:00:00.000Z",
   },
   yesterday: {
      start: "2026-10-05T07:00:00.000Z",
      end: "2026-10-06T07:00:00.000Z",
   },
};

describe('getFeedback', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockApi.mockResolvedValue({
         message: feedback,
      });
   });
   
   it("calls the feedback API and returns the feedback", async () => {
      const result = await getFeedback(ranges);

      const params = new URLSearchParams({
         todayStart: ranges.today.start,
         todayEnd: ranges.today.end,
         yesterdayStart: ranges.yesterday.start,
         yesterdayEnd: ranges.yesterday.end,
      });
      expect(mockApi).toHaveBeenCalledWith(`/feedback?${params}`, "GET");
      expect(result).toEqual(feedback);
   });
});