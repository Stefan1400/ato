import { api } from "../../lib/api";
import type { SessionTypes } from "./analytics.types";
import type { LocalDayRange } from "./helpers/LocalDayRange";

export async function getSessionsByDate(range: LocalDayRange): Promise<SessionTypes[]> {
   try {
      const params = new URLSearchParams({ start: range.start, end: range.end });
      const response = await api<{ fetchedSessions: SessionTypes[] }>(
         `/sessions?${params}`,
         'GET'
      );

      return response.fetchedSessions;
   } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
         return [];
      }
      throw error;
   }
};