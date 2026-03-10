import type { ComponentType } from "react";

export type addSessionRequest = {
   session_started: Date | null;
   session_ended: Date | null;
};

export type addSessionTypes = {
   session_started: Date | null;
   session_ended: Date | null;
};

export type addedSession = {
   id: number;
   user_id: number;
   session_started: Date | null;
   session_ended: Date | null;
   created_at: Date | null;
   updated_at: Date | null;
};

export type sessionResponse = {
   addedSession: addedSession;
};

export type UIStates = 'default' | 'ongoing' | 'success' | 'pending' | 'error';

export type StateStyles = {
   container: string;
   header: { styles: string; text: string; icon?: ComponentType };
   subHeader?: { styles: string; text: string; icon?: ComponentType };
   btnVisible: boolean;
};