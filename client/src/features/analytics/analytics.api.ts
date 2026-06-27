import { api } from "../../lib/api";
import type { SessionTypes } from "./analytics.types";

export async function getSessionsByDate(date: string): Promise<SessionTypes[]> {
   try {
      const response = await api<{ fetchedSessions: SessionTypes[] }>(
         `/sessions?date=${date}`,
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