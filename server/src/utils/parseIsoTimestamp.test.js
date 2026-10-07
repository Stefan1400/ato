import { describe, it, expect } from 'vitest';
import parseIsoTimestamp from './parseIsoTimestamp.js';

describe('parseIsoTimestamp', () => {
   it('parses canonical ISO UTC timestamps as the same instant', () => {
      const value = '2026-10-07T00:30:00.000Z';

      expect(parseIsoTimestamp(value).toISOString()).toBe(value);
   });

   it.each([undefined, null, '2026-10-07', 'not-a-timestamp', '2026-10-07T00:30:00Z'])(
      'rejects invalid or non-canonical timestamps: %s',
      (value) => {
         expect(parseIsoTimestamp(value)).toBeNull();
      }
   );
});