import { describe, it, expect, vi } from "vitest";
import handleError from "./errorHandler";

describe("handleError", () => {
   it("returns a 400 error for invalid session time", () => {
      const err = {
         code: "23514",
         constraint: "check_session_time",
         message: "Check constraint failed",
      };

      const req = {};
      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };
      const next = vi.fn();

      handleError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
         message: "Session end time must be after start time",
      });
   });

   it("returns a 500 error for other errors", () => {
      const err = {
         code: "500",
         message: "Something went wrong",
      };

      const req = {};
      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };
      const next = vi.fn();

      handleError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
         message: "Internal Server Error",
      });
   });
});