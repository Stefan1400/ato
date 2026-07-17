import { loadTimer, DEFAULT_TIMER } from './SessionTimer';
import { describe, it, expect, beforeEach } from 'vitest';

beforeEach(() => {
   localStorage.clear();
});

describe('loadTimer()', () => {
   it('returns the default state when no userId is provided', () => {
      expect(loadTimer()).toEqual(DEFAULT_TIMER);
   });

   it('returns the default state when userId is provided, but no timer exists in localStorage', () => {
      expect(loadTimer(74)).toEqual(DEFAULT_TIMER);
   });

   it('returns saved timer from local storage', () => {
      localStorage.setItem('sessionTimer:74', JSON.stringify({ 
         time: 120, 
         timerStatus: 'ongoing', 
         startedAt: '2026-07-16T12:00:00Z' 
      }));
      
      expect(loadTimer(74)).toEqual({ 
         time: 120, 
         timerStatus: 'ongoing', 
         startedAt: '2026-07-16T12:00:00Z' 
      });
   });
   
   it('uses default values for missing properties', () => {
      localStorage.setItem('sessionTimer:6', JSON.stringify({ 
         time: 120, 
         timerStatus: 'ongoing', 
      }));
      
      expect(loadTimer(6)).toEqual({ 
         time: 120, 
         timerStatus: 'ongoing', 
         startedAt: null
      });
   });

   it('returns defaults when parsed JSON is not an object', () => {
      localStorage.setItem('sessionTimer:6', JSON.stringify('random string'));
      
      expect(loadTimer(6)).toEqual(DEFAULT_TIMER);
   });

   it('returns defaults when JSON is invalid', () => {
      localStorage.setItem('sessionTimer:6', '{"time":120');
      
      expect(loadTimer(6)).toEqual(DEFAULT_TIMER);
   });
})