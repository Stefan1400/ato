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

describe('getFeedback', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockApi.mockResolvedValue({
         message: feedback,
      });
   });
   
   it("calls the feedback API and returns the feedback", async () => {
      const result = await getFeedback();

      expect(mockApi).toHaveBeenCalledWith("/feedback", "GET");
      expect(result).toEqual(feedback);
   });
});