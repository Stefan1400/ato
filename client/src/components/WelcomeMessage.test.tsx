import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import WelcomeMessage from "./WelcomeMessage";
import { getTimeOfDay } from "./WelcomeMessage";

vi.mock('../app/AuthProvider', () => ({
  AuthContext: {},
}));

const { mockUseGetFeedback } = vi.hoisted(() => ({
  mockUseGetFeedback: vi.fn(),
}));

const { mockUseContext } = vi.hoisted(() => ({
  mockUseContext: vi.fn(),
}));

vi.mock('../features/feedback/useFeedback', () => ({
  useGetFeedback: mockUseGetFeedback,
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    useContext: mockUseContext,
  };
});

beforeEach(() => {
   mockUseGetFeedback.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
   });

   mockUseContext.mockReturnValue({
      user: { 
         account_type: 'guest',
         email: ''
      },
   });
});

afterEach(() => {
   vi.useRealTimers();
});

describe('WelcomeMessage', () => {
   it('renders morning greeting', () => {
      vi.useFakeTimers();
      
      const mockDate = new Date(2024, 5, 1, 9, 0);
      vi.setSystemTime(mockDate);
      
      render(<WelcomeMessage />);
      
      expect(screen.getByText('Good morning, Guest')).toBeInTheDocument();
   });

   it('renders afternoon greeting', () => {
      vi.useFakeTimers();
      
      const mockDate = new Date(2024, 5, 1, 13, 0);
      vi.setSystemTime(mockDate);
      
      render(<WelcomeMessage />);
      
      expect(screen.getByText('Good afternoon, Guest')).toBeInTheDocument();
   });

   it('renders evening greeting', () => {
      vi.useFakeTimers();
      
      const mockDate = new Date(2024, 5, 1, 19, 0);
      vi.setSystemTime(mockDate);
      
      render(<WelcomeMessage />);
      
      expect(screen.getByText('Good evening, Guest')).toBeInTheDocument();
   });

   it('renders focus time when today exists', () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: '120min',
         },
         isLoading: false,
         isError: false,
      });
      
      render(<WelcomeMessage />);
      
      expect(screen.getByText('120min 💪')).toBeInTheDocument();
   });

   it('renders focus time when today is undefined', () => {

      mockUseGetFeedback.mockReturnValue({
         data: {
            todayValue: undefined,
         },
         isLoading: false,
         isError: false,
      });
      
      render(<WelcomeMessage />);
      
      expect(screen.getByText('Ready to get started? 😊')).toBeInTheDocument();
   });

   it('renders username when guest', () => {

      mockUseContext.mockReturnValue({
         user: { 
            account_type: 'guest',
            email: ''
         },
      });

      vi.useFakeTimers();
      
      const mockDate = new Date(2024, 5, 1, 9, 0);
      vi.setSystemTime(mockDate);
      
      render(<WelcomeMessage />);
      
      expect(screen.getByText('Good morning, Guest')).toBeInTheDocument();
   });

   it('renders username when user', () => {

      mockUseContext.mockReturnValue({
         user: { 
            account_type: 'user',
            email: 'stefan@gmail.com'
         },
      });

      vi.useFakeTimers();
      
      const mockDate = new Date(2024, 5, 1, 9, 0);
      vi.setSystemTime(mockDate);
      
      render(<WelcomeMessage />);
      
      expect(screen.getByText('Good morning, Stefan')).toBeInTheDocument();
   });

   it('returns correct time of day', () => {

      vi.useFakeTimers();
      
      const mockDate = new Date(2024, 5, 1, 9, 0);
      vi.setSystemTime(mockDate);
      
      render(<WelcomeMessage />);

      expect(getTimeOfDay()).toBe('Good morning');
   });

   it('returns message when feedback is loading', () => {
      mockUseGetFeedback.mockReturnValue({
         data: undefined,
         isLoading: true,
         isError: false,
      });
      
      render(<WelcomeMessage />);

      expect(screen.getByText('Ready to get started? 😊')).toBeInTheDocument();
   });

   it('returns message when feedback has error', () => {
      mockUseGetFeedback.mockReturnValue({
         data: undefined,
         isLoading: false,
         isError: true,
      });
      
      render(<WelcomeMessage />);

      expect(screen.getByText('Ready to get started? 😊')).toBeInTheDocument();
   });

   it('updates greeting after one minute', () => {
      vi.useFakeTimers();

      vi.setSystemTime(new Date(2024, 5, 1, 11, 59));

      render(<WelcomeMessage />);

      expect(screen.getByText('Good morning, Guest')).toBeInTheDocument();
      
      act(() => {
         vi.advanceTimersByTime(60000);
      });

      expect(screen.getByText('Good afternoon, Guest')).toBeInTheDocument();
   });
});