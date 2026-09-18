import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { getJwtSecret, createToken } from "./jwt";

describe("getJwtSecret", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("returns the JWT secret when it is configured", () => {
      process.env.JWT_SECRET = "test-secret";

      expect(getJwtSecret()).toBe("test-secret");
   });

   it("throws an error when the JWT secret is not configured", () => {
      delete process.env.JWT_SECRET;

      expect(() => getJwtSecret()).toThrow(
         "JWT secret is not defined"
      );
   });
});

describe("createToken", () => {
   beforeEach(() => {
      vi.clearAllMocks();
      process.env.JWT_SECRET = "test-secret";
   });

   it("creates a token containing the user's id and email", () => {
      const user = {
         id: 1,
         email: "user@example.com",
      };

      const token = createToken(user);

      const payload = jwt.verify(token, "test-secret");

      expect(payload).toMatchObject({
         id: 1,
         email: "user@example.com",
      });
   });

   it("creates a token that expires in 7 days", () => {
      const user = {
         id: 1,
         email: "user@example.com",
      };

      const token = createToken(user);

      const payload = jwt.decode(token);

      expect(payload.exp - payload.iat).toBe(7 * 24 * 60 * 60);
   });
});