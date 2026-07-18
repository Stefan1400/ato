import { describe, it, expect } from 'vitest';
import formatDuration from './FormatDuration';

describe('formatDuration()', () => {
   it('returns 0 minutes', () => {
      expect(formatDuration(0)).toBe('0min');
   })

   it('returns minutes', () => {
      expect(formatDuration(120000)).toBe('2min');
   })

   it('returns hours', () => {
      expect(formatDuration(3600000)).toBe('1hrs');
   })

   it('returns hours and minutes', () => {
      expect(formatDuration(3660000)).toBe('1hrs 1min');
   })

   it('rounds up to the nearest minute', () => {
      expect(formatDuration(90000)).toBe('2min');
   })

   it('rounds down to the nearest minute', () => {
      expect(formatDuration(89000)).toBe('1min');
   })
})