import { getSessionsByDate } from "./analytics.api";
import { useQuery } from "@tanstack/react-query";

export function useGetSessionsByDate(date: string) {
   return useQuery({
      queryKey: ["sessions", date],
      queryFn: () => getSessionsByDate(date),
   })
};