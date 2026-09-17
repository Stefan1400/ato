import { describe, it, expect, vi } from "vitest";
import corsOptions from "./corsOptions";

describe("corsOptions", () => {
   it("allows requests with no origin", () => {
      const callback = vi.fn();

      corsOptions.origin(undefined, callback);

      expect(callback).toHaveBeenCalledWith(null, true);
   });

   it("allows requests from the localhost:3000 origin", () => {
      const callback = vi.fn();

      corsOptions.origin("http://localhost:3000", callback);

      expect(callback).toHaveBeenCalledWith(null, true);
   });

   it("allows requests from the localhost:5173 origin", () => {
      const callback = vi.fn();

      corsOptions.origin('http://localhost:5173', callback);

      expect(callback).toHaveBeenCalledWith(null, true);
   });

   it("rejects requests from an unknown origin", () => {
      const callback = vi.fn();

      corsOptions.origin("http://example.com", callback);

      expect(callback).toHaveBeenCalledWith(
         new Error("Not allowed by CORS")
      );
   });
});