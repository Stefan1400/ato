import { describe, it, expect } from 'vitest';
import formatTimeOfDay from './FormatTimeOfDay';

describe('formatTimeOfDay()', () => {
   it('formats afternoon times', () => {
      expect(formatTimeOfDay(new Date('2026-07-18T14:30:00'))).toBe('14:30');
   });

   it('formats midnight', () => {
      expect(formatTimeOfDay(new Date('2026-07-19T00:00:00'))).toBe('00:00');
   });
});