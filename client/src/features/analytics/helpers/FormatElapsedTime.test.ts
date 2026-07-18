import { describe, it, expect } from 'vitest';
import formatElapsedTime from './FormatElapsedTime';

describe('formatElapsedTime', () => {
   it('formats 0', () => {
      expect(formatElapsedTime(0)).toBe('00:00:00');
   });
   it('formats seconds', () => {
      expect(formatElapsedTime(50)).toBe('00:00:50');
   });
   it('formats minutes', () => {
      expect(formatElapsedTime(120)).toBe('00:02:00');
   });
   it('formats hours', () => {
      expect(formatElapsedTime(3600)).toBe('01:00:00');
   });
   it('formats seconds, minutes, and hours', () => {
      expect(formatElapsedTime(3661)).toBe("01:01:01");
   });
});