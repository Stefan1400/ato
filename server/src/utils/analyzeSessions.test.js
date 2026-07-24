import { describe, it, expect } from 'vitest';
import analyzeSessions from './analyzeSessions.js';

describe('analyzeSessions()', () => {
   it('returns 0 for empty sessions', () => {
      const sessions = [];
      
      expect(analyzeSessions(sessions)).toEqual({
         total: 0,
         longest: 0,
         average: 0,
         count: 0
      })
   });

   it('calculates total, longest, average, and count for one session', () => {
      const sessions = [
         {
            session_started: new Date('2026-01-01T00:00:00Z'),
            session_ended: new Date('2026-01-01T00:01:00Z')
         }
      ];

      expect(analyzeSessions(sessions)).toEqual({
         total: 60000,
         longest: 60000,
         average: 60000,
         count: 1
      });
   });

   it('calculates total, longest, average, and count for multiple sessions', () => {
      const sessions = [
         {
            session_started: new Date('2026-07-23T21:36:36.089Z'),
            session_ended: new Date('2026-07-23T21:36:55.289Z'),
         },
         {
            session_started: new Date('2026-07-23T21:37:04.338Z'),
            session_ended: new Date('2026-07-23T21:38:34.481Z'),
         }
      ];

      expect(analyzeSessions(sessions)).toEqual({
         total: 109343,
         longest: 90143,
         average: 54672,
         count: 2
      })
   });

   it('rounds the average duration', () => {
      const sessions = [
         {
            session_started: new Date(0),
            session_ended: new Date(1)
         },
         {
            session_started: new Date(0),
            session_ended: new Date(2)
         }
      ];

      expect(analyzeSessions(sessions).average).toBe(2);
   });
});