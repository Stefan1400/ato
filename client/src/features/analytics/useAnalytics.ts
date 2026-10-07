import { getSessionsByDate } from "./analytics.api";
import { useQuery } from "@tanstack/react-query";
import type { LocalDayRange } from "./helpers/LocalDayRange";

export function useGetSessionsByDate(range: LocalDayRange) {
   return useQuery({
      queryKey: ["sessions", range.start, range.end],
      queryFn: () => getSessionsByDate(range),
   })
};