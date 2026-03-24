export type SessionTypes = {
   id: number;
   session_started: Date;
   session_ended: Date;
};

export type SessionWithPosition = SessionTypes & {
   topPercent: number;
   heightPercent: number;
};