import { describe, it, expect, vi } from "vitest";
import notFound from "./notFound";

describe("notFound", () => {
   it("returns a 404 error with the requested URL", () => {
      const req = {
         originalUrl: "/api/users/123",
      };

      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };

      notFound(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
         error: "Route /api/users/123 not found.",
      });
   });
});