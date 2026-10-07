import { api } from "../../lib/api";
import type { Feedback } from "./feedback.types";
import type { LocalDayRanges } from "../analytics/helpers/LocalDayRange";

export async function getFeedback(ranges: LocalDayRanges): Promise<Feedback> {
   const params = new URLSearchParams({
      todayStart: ranges.today.start,
      todayEnd: ranges.today.end,
      yesterdayStart: ranges.yesterday.start,
      yesterdayEnd: ranges.yesterday.end,
   });
   const response = await api<{ message: Feedback }>(`/feedback?${params}`, "GET");
   
   return response.message;
};