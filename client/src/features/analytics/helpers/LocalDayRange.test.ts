import { afterEach, describe, expect, it, vi } from "vitest";
import getLocalDayRange, { getLocalTodayAndYesterdayRanges } from "./LocalDayRange";

describe("getLocalDayRange", () => {
   afterEach(() => {
      vi.unstubAllEnvs();
   });

   it("creates the selected local date's UTC boundaries and includes local morning, afternoon, and evening instants", () => {
      vi.stubEnv("TZ", "America/Los_Angeles");

      const selectedDate = new Date(2026, 9, 6, 17, 30);
      const range = getLocalDayRange(selectedDate);
      const start = new Date(range.start).getTime();
      const end = new Date(range.end).getTime();
      const localInstants = [
         new Date(2026, 9, 6, 8, 0),
         new Date(2026, 9, 6, 13, 0),
         new Date(2026, 9, 6, 17, 30),
      ];

      expect(range).toEqual({
         start: "2026-10-06T07:00:00.000Z",
         end: "2026-10-07T07:00:00.000Z",
      });
      localInstants.forEach(instant => {
         expect(instant.getTime()).toBeGreaterThanOrEqual(start);
         expect(instant.getTime()).toBeLessThan(end);
      });
      expect(localInstants[2]?.toISOString()).toBe("2026-10-07T00:30:00.000Z");
   });

   it("excludes a previous local evening, includes sessions crossing midnight, and excludes a session starting at the next day's boundary", () => {
      vi.stubEnv("TZ", "America/Los_Angeles");

      const range = getLocalDayRange(new Date(2026, 9, 6, 12));
      const start = new Date(range.start).getTime();
      const end = new Date(range.end).getTime();
      const overlaps = (sessionStart: Date, sessionEnd: Date) =>
         sessionStart.getTime() < end && sessionEnd.getTime() > start;

      expect(overlaps(new Date(2026, 9, 5, 21), new Date(2026, 9, 5, 21, 30))).toBe(false);
      expect(overlaps(new Date(2026, 9, 6, 23, 30), new Date(2026, 9, 7, 0, 30))).toBe(true);
      expect(overlaps(new Date(2026, 9, 7, 0), new Date(2026, 9, 7, 0, 30))).toBe(false);
   });

   it("uses calendar arithmetic across DST transitions instead of a fixed 24-hour duration", () => {
      vi.stubEnv("TZ", "America/Los_Angeles");

      const springForward = getLocalDayRange(new Date(2026, 2, 8, 12));
      const fallBack = getLocalDayRange(new Date(2026, 10, 1, 12));

      expect(new Date(springForward.end).getTime() - new Date(springForward.start).getTime())
         .toBe(23 * 60 * 60 * 1000);
      expect(new Date(fallBack.end).getTime() - new Date(fallBack.start).getTime())
         .toBe(25 * 60 * 60 * 1000);
   });

   it("creates adjacent local yesterday and today ranges from the same reference date", () => {
      vi.stubEnv("TZ", "America/Los_Angeles");

      const ranges = getLocalTodayAndYesterdayRanges(new Date(2026, 9, 6, 17, 30));

      expect(ranges.yesterday).toEqual({
         start: "2026-10-05T07:00:00.000Z",
         end: "2026-10-06T07:00:00.000Z",
      });
      expect(ranges.today).toEqual({
         start: "2026-10-06T07:00:00.000Z",
         end: "2026-10-07T07:00:00.000Z",
      });
   });
});