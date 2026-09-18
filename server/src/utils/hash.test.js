import { describe, it, expect } from "vitest";
import { hashValue, compareValue, hashToken } from "./hash";

describe("hashValue", () => {
   it("returns a hashed version of the value", async () => {
      const value = "password123";

      const hashedValue = await hashValue(value);

      expect(hashedValue).not.toBe(value);
      expect(hashedValue).toMatch(/^\$2[aby]\$/);
   });
});

describe("compareValue", () => {
   it("returns true when the value matches the hash", async () => {
      const value = "password123";

      const hashedValue = await hashValue(value);

      const result = await compareValue(value, hashedValue);

      expect(result).toBe(true);
   });

   it("returns false when the value does not match the hash", async () => {
      const value = "password123";
      const wrongValue = "wrong-password";

      const hashedValue = await hashValue(value);

      const result = await compareValue(wrongValue, hashedValue);

      expect(result).toBe(false);
   });
});

describe("hashToken", () => {
   it("returns a consistent SHA-256 hash for the same token", () => {
      const token = "test-token";

      const result = hashToken(token);

      expect(result).toBe(hashToken(token));
      expect(result).toMatch(/^[a-f0-9]{64}$/);
   });
});