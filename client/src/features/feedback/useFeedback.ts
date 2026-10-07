import { getFeedback } from "./feedback.api";
import { useQuery } from "@tanstack/react-query";
import { getLocalTodayAndYesterdayRanges } from "../analytics/helpers/LocalDayRange";
import type { LocalDayRanges } from "../analytics/helpers/LocalDayRange";

export const useGetFeedback = (ranges: LocalDayRanges = getLocalTodayAndYesterdayRanges(new Date())) => {
    return useQuery({
        queryKey: ["feedback", ranges.today.start, ranges.today.end, ranges.yesterday.start, ranges.yesterday.end],
        queryFn: () => getFeedback(ranges),
        staleTime: 60 * 1000,
    });
};