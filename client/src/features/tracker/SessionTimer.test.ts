import { loadTimer, saveTimer, clearTimer, DEFAULT_TIMER } from './SessionTimer';
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

   it('returns saved timer from localStorage', () => {
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

describe('saveTimer()', () => {
   it('does not save timer when userId is undefined', () => {
      saveTimer(undefined, DEFAULT_TIMER);
      
      expect(localStorage.length).toBe(0);
   })

   it('saves timer to localStorage', () => {
      
      saveTimer(74, { 
         time: 120, 
         timerStatus: 'ongoing', 
         startedAt: '2026-07-16T12:00:00Z'
      })
      
      expect(localStorage.getItem('sessionTimer:74')).toBe(JSON.stringify({
         time: 120, 
         timerStatus: 'ongoing', 
         startedAt: '2026-07-16T12:00:00Z'  
      }));
   })
})

describe('clearTimer()', () => {
   it('does not clear timer when userId is undefined', () => {
      localStorage.setItem('sessionTimer:74', JSON.stringify(DEFAULT_TIMER));

      clearTimer(undefined);

      expect(localStorage.getItem('sessionTimer:74')).toBe(JSON.stringify(DEFAULT_TIMER));
   });

   it('clears timer from localStorage', () => {
      localStorage.setItem('sessionTimer:74', JSON.stringify(DEFAULT_TIMER));

      clearTimer(74);

      expect(localStorage.getItem('sessionTimer:74')).toBeNull();
   });
});