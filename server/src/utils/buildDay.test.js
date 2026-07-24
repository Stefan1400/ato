import { describe, it, expect } from 'vitest';
import buildDay from './buildDay.js';

describe('buildDay()', () => {
   it('returns zero values for no sessions', () => {
      const analytics = {
         total: 0,
         longest: 0,
         average: 0,
         count: 0
      };

      expect(buildDay(analytics)).toEqual({
         totalMs: 0,
         longestMs: 0,
         averageMs: 0,
         total: '0min',
         longest: '0min',
         average: '0min',
         count: 0
      });
   });
   
   it('returns formatted analytics data', () => {
      const analytics = {
         total: 109343,
         longest: 90143,
         average: 54672,
         count: 2
      };

      expect(buildDay(analytics)).toEqual({
         totalMs: 109343,
         longestMs: 90143,
         averageMs: 54672,
         total: '2min',
         longest: '2min',
         average: '1min',
         count: 2
      });
   });

   it('formats hours correctly', () => {
      const analytics = {
         total: 3600000,
         longest: 5400000,
         average: 7200000,
         count: 3
      };

      expect(buildDay(analytics)).toEqual({
         totalMs: 3600000,
         longestMs: 5400000,
         averageMs: 7200000,
         total: '1hrs',
         longest: '1hrs 30min',
         average: '2hrs',
         count: 3
      });
   });
});