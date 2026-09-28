import SessionTimer, { loadTimer, saveTimer, clearTimer, DEFAULT_TIMER } from './SessionTimer';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

beforeEach(() => {
   localStorage.clear();

   mockMutation.isSuccess = false;
   mockMutation.isPending = false;
   mockMutation.isError = false;
   mockMutate.mockClear();
   mockShowToast.mockClear();
});

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    useContext: vi.fn(() => ({
      user: { id: 74 },
    })),
  };
});

const mockMutate = vi.fn();
const mockShowToast = vi.fn();

const mockMutation =  {
   isSuccess: false,
   isPending: false,
   isError: false,
   mutate: mockMutate,
   reset: vi.fn(),
};

vi.mock('./useSessionTimer', () => ({
  useAddSession: () => mockMutation,
}));

vi.mock('../../components/Toast', () => ({
  useToast: () => ({
      showToast: mockShowToast,
  }),
}));

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

   it("restores an ongoing timer from localStorage", () => {
      vi.useFakeTimers();

      const startedAt = new Date(Date.now() - 5000).toISOString();

      localStorage.setItem(
         "sessionTimer:74",
         JSON.stringify({
            time: 0,
            timerStatus: "ongoing",
            startedAt,
         })
      );

      render(<SessionTimer />);

      expect(screen.getByText("Focus Session")).toBeInTheDocument();
      expect(screen.getByText("Stay Focused")).toBeInTheDocument();
      expect(screen.getByText("00:00:05")).toBeInTheDocument();
   });
});

describe('saveTimer()', () => {
   it('does not save timer when userId is undefined', () => {
      saveTimer(undefined, DEFAULT_TIMER);
      
      expect(localStorage.length).toBe(0);
   });

   it('saves timer to localStorage', () => {
      saveTimer(74, { 
         time: 120, 
         timerStatus: 'ongoing', 
         startedAt: '2026-07-16T12:00:00Z'
      });
      
      expect(localStorage.getItem('sessionTimer:74')).toBe(JSON.stringify({
         time: 120, 
         timerStatus: 'ongoing', 
         startedAt: '2026-07-16T12:00:00Z'  
      }));
   });
});

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

describe('SessionTimer', () => {
   it('renders default timer state', () => {
      render(<SessionTimer />);

      expect(screen.getByText('00:00:00')).toBeInTheDocument();
      expect(screen.getByText('Study Timer')).toBeInTheDocument();
      expect(screen.getByText('Start your session')).toBeInTheDocument();
   });

   it('renders ongoing timer state', async () => {
      render(<SessionTimer />);

      const user = userEvent.setup();

      await user.click(
         screen.getByRole('button', { name: /start\/stop timer/i })
      );

      expect(screen.getByText('Focus Session')).toBeInTheDocument();
      expect(screen.getByText('Stay Focused')).toBeInTheDocument();
   });

   it('increments the timer while ongoing', () => {
      vi.useFakeTimers();

      render(<SessionTimer />);

      fireEvent.click(
         screen.getByRole('button', { name: /start\/stop timer/i })
      );

      act(() => {
         vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText('00:00:05')).toBeInTheDocument();
   });

   it('stops the timer and renders default state', () => {
      vi.useFakeTimers();

      render(<SessionTimer />);

      fireEvent.click(
         screen.getByRole('button', { name: /start\/stop timer/i })
      );

      expect(screen.getByText('Focus Session')).toBeInTheDocument();
      expect(screen.getByText('Stay Focused')).toBeInTheDocument();

      act(() => {
         vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText('00:00:05')).toBeInTheDocument();

      fireEvent.click(
         screen.getByRole('button', { name: /start\/stop timer/i })
      );

      act(() => {
         vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('00:00:00')).toBeInTheDocument();
      expect(screen.getByText('Study Timer')).toBeInTheDocument();
      expect(screen.getByText('Start your session')).toBeInTheDocument();
   });

   it('submits the session when the timer is stopped', () => {
      vi.useFakeTimers();

      render(<SessionTimer />);

      fireEvent.click(
         screen.getByRole('button', { name: /start\/stop timer/i })
      );

      expect(screen.getByText('Focus Session')).toBeInTheDocument();
      expect(screen.getByText('Stay Focused')).toBeInTheDocument();

      act(() => {
         vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText('00:00:05')).toBeInTheDocument();

      fireEvent.click(
         screen.getByRole('button', { name: /start\/stop timer/i })
      );

      expect(mockMutate).toHaveBeenCalledOnce();

      const [session] = mockMutate.mock.calls[0];
      
      expect(session.session_started).toBeInstanceOf(Date);
      
      expect(session.session_ended).toBeInstanceOf(Date);
      
      expect(session.session_ended.getTime()).toBeGreaterThanOrEqual(
         session.session_started.getTime()
      );
   });

   it('clears the saved timer and shows a success toast when the session is added', () => {
      render(<SessionTimer />);

      fireEvent.click(screen.getByRole('button', { name: /start\/stop timer/i }));
      fireEvent.click(screen.getByRole('button', { name: /start\/stop timer/i }));

      const [, callbacks] = mockMutate.mock.calls[0];
      callbacks.onSuccess();

      expect(localStorage.getItem('sessionTimer:74')).toBeNull();
      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'success',
         message: 'Session Added Successfully',
         duration: 3000,
      });
   });

   it('shows an error toast when the session cannot be added', () => {
      render(<SessionTimer />);

      fireEvent.click(screen.getByRole('button', { name: /start\/stop timer/i }));
      fireEvent.click(screen.getByRole('button', { name: /start\/stop timer/i }));

      const [, callbacks] = mockMutate.mock.calls[0];
      callbacks.onError();

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'error',
         message: 'Session Could not be added',
         duration: 3000,
      });
   });

   it('renders pending timer state', () => {
      mockMutation.isPending = true;
      
      render(<SessionTimer />);

      expect(screen.getByText('Saving Session...')).toBeInTheDocument();
      expect(screen.getByText('Adding to Analytics')).toBeInTheDocument();

   });

   it('renders success timer state', () => {
      mockMutation.isSuccess = true;
      
      render(<SessionTimer />);

      expect(screen.getByText('Session Added')).toBeInTheDocument(); 
      expect(screen.getByText('Session Saved to Analytics')).toBeInTheDocument(); 

   });

   it('renders error timer state', () => {
      mockMutation.isError = true;
      
      render(<SessionTimer />);

      expect(screen.getByText('Error')).toBeInTheDocument(); 
      expect(screen.getByText('Failed to save session. Please try again.')).toBeInTheDocument(); 

   });
});