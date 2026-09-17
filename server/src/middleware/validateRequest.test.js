import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import validateRequest from "./validateRequest";

describe("validateRequest", () => {
   it("parses the request body and calls next for valid data", () => {
      const schema = z.object({
         email: z.string().email(),
      });

      const req = {
         body: {
            email: "user@example.com",
         },
      };

      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };

      const next = vi.fn();

      validateRequest(schema)(req, res, next);

      expect(req.body).toEqual({
         email: "user@example.com",
      });
      expect(next).toHaveBeenCalled();
   });

   it("returns a 400 error for invalid data", () => {
      const schema = z.object({
         email: z.string().email(),
      });

      const req = {
         body: {
            email: "not-an-email",
         },
      };

      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };

      const next = vi.fn();

      validateRequest(schema)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
         expect.objectContaining({
            success: false,
            error: "Validation failed",
         })
      );
      expect(next).not.toHaveBeenCalled();
   });

   it("passes non-Zod errors to next", () => {
      const schema = {
         parse: vi.fn(() => {
            throw new Error("Unexpected error");
         }),
      };

      const req = {
         body: {},
      };

      const res = {
         status: vi.fn().mockReturnThis(),
         json: vi.fn(),
      };

      const next = vi.fn();

      validateRequest(schema)(req, res, next);

      expect(next).toHaveBeenCalledWith(
         expect.objectContaining({
            message: "Unexpected error",
         })
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
   });
});