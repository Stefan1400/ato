import { api } from "../../lib/api";
import type { SessionTypes } from "./analytics.types";

export async function getSessionsByDate(date: string): Promise<SessionTypes[]> {
   const response = await api<{ fetchedSessions: SessionTypes[] }>(
      `/sessions?date=${date}`, 
      'GET'
   );

   return response.fetchedSessions;
};