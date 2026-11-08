import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Vercel rewrites", () => {
   it("forwards API requests to Render before applying the SPA fallback", () => {
      const config = JSON.parse(readFileSync(`${process.cwd()}/vercel.json`, "utf8"));

      expect(config.rewrites[0]).toEqual({
         source: "/api/:path*",
         destination: "https://ato-eoe3.onrender.com/api/:path*",
      });
      expect(config.rewrites[1]).toEqual({
         source: "/(.*)",
         destination: "/index.html",
      });
   });
});
