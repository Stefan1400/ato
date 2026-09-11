import { expect, describe, it, vi, beforeEach } from "vitest";
import { addSession } from "./tracker.api";

const { mockApi } = vi.hoisted(() => ({
    mockApi: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
    api: mockApi,
}));

const session = {
   session_started: new Date("2026-09-08T08:00:00.000Z"),
   session_ended: new Date("2026-09-08T08:35:00.000Z"),
};

const addedSession = {
   id: 1,
   user_id: 5,
   session_started: session.session_started,
   session_ended: session.session_ended,
   created_at: new Date("2026-09-08T08:00:00.000Z"),
   updated_at: new Date("2026-09-08T08:35:00.000Z"),
};

describe('addSession', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockApi.mockResolvedValue({
         addedSession
      });
   });
   
   it("calls the sessions API and returns the added session", async () => {
      const result = await addSession(session);

      expect(mockApi).toHaveBeenCalledWith("/sessions/", "POST", session);
      expect(result).toEqual({ addedSession });
   });
});