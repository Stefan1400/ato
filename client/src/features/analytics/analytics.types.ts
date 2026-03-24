export type SessionTypes = {
   id: number;
   user_id: number;
   session_started: Date | null;
   session_ended: Date | null;
   created_at: string | null;
   updated_at: string | null;
};

export type SessionWithDates = {
   id: number;
   user_id: number;
   session_started: Date;
   session_ended: Date;
   created_at: string | null;
   updated_at: string | null;
};

export type SessionWithPosition = SessionTypes & {
   topPercent: number;
   heightPercent: number;
};

export type GetSessionsResponse = SessionTypes[];