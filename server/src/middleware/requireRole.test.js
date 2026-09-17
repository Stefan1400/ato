import { describe, it, expect, vi } from "vitest";
import requireRole from "./requireRole";

describe("requireRole", () => {
   it("returns 401 if the user is not authenticated", () => {
      const req = {};
      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };
      const next = vi.fn();

      requireRole("admin")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
         success: false,
         error: "Not authenticated",
      });
      expect(next).not.toHaveBeenCalled();
   });

   it("returns 403 if the user does not have an allowed role", () => {
      const req = {
         user: {
            role: "user",
         },
      };
      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };
      const next = vi.fn();

      requireRole("admin")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
         success: false,
         error: "Forbidden: insufficient role",
      });
      expect(next).not.toHaveBeenCalled();
   });

   it("calls next if the user has an allowed role", () => {
      const req = {
         user: {
            role: "admin",
         },
      };
      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };
      const next = vi.fn();

      requireRole("admin")(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
   });
});