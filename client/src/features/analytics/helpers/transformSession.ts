import type { SessionTypes } from "../analytics.types";

export function transformSession(session: SessionTypes) {
   if (session.session_started === null || session.session_ended === null) return session;

   return { 
      ...session, 
      session_started: new Date(session.session_started), 
      session_ended: new Date(session.session_ended) 
   };
};