import type{ SessionWithDates } from "../analytics.types";

export function calculateSessionPosition(session: SessionWithDates) {

   const sessionStart = session.session_started;
   const sessionEnd = session.session_ended;

   const durationMinutes = (sessionEnd.getTime() - sessionStart.getTime()) / (60 * 1000);   

   const timelinePercentage = (durationMinutes / 1440) * 100;
   const heightPercent = Math.round(timelinePercentage * 100) / 100;

   const midnight = new Date(
      sessionStart.getFullYear(), 
      sessionStart.getMonth(), 
      sessionStart.getDate()
   );

   const topPlacement = (sessionStart.getTime() - midnight.getTime()) / (1000 * 60);
   const topPlacementPercent = (topPlacement / 1440) * 100;
   const topPercent = Math.round(topPlacementPercent * 100) / 100;

   return { ...session, topPercent, heightPercent }
};