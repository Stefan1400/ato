import { api } from '../../lib/api';
import type { addSessionRequest, sessionResponse } from './tracker.types';

export function addSession(data: addSessionRequest): Promise<sessionResponse> {   
   const response = api<sessionResponse>("/sessions/", 'POST', data);
   
   return response;
};