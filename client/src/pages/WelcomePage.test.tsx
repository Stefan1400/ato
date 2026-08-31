import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import WelcomePage from "./WelcomePage";
import { AuthContext } from "../app/AuthProvider";
import { MemoryRouter, useLocation } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";

const { mockShowToast, mockUseCreateGuest, mockCreateGuestMutation } = vi.hoisted(() => ({
   mockShowToast: vi.fn(),
   mockUseCreateGuest: vi.fn(),
   mockCreateGuestMutation: vi.fn()
}));

vi.mock('../components/Toast', () => ({
   useToast: () => ({
      showToast: mockShowToast
   })
}));

vi.mock('../features/auth/useAuth', () => ({
   useCreateGuest: mockUseCreateGuest
}));

function LocationDisplay() {
   const location = useLocation();

   return <div data-testid='location'>{location.pathname}</div>
};

describe('WelcomePage', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockUseCreateGuest.mockReturnValue({
         mutate: mockCreateGuestMutation,
         isPending: false
      });
   });
   
   it('renders the welcome page', () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: vi.fn() 
             }}>
               <WelcomePage />
            </AuthContext.Provider>
         </MemoryRouter>
      )

      expect(screen.getByText('Welcome to ato')).toBeInTheDocument();
      expect(screen.getByText('Log into an existing account or continue as guest')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Continue as Guest')).toBeInTheDocument();
   });

   it('navigates user to /login', async () => {
      render(
         <MemoryRouter initialEntries={['/']}>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: vi.fn() 
             }}>
               <WelcomePage />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      )

      const user = userEvent.setup();
      await user.click(screen.getByRole('link', { name: /Login/i }));

      expect(screen.getByTestId('location')).toHaveTextContent('/login');
   });

   it('calls the create guest mutation', async () => {
      render(
         <MemoryRouter initialEntries={['/']}>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: vi.fn() 
             }}>
               <WelcomePage />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      )

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /Create Guest/i }));

      expect(mockCreateGuestMutation).toHaveBeenCalled();
   });

   it('shows loading state while guest creation is pending', async () => {
      mockUseCreateGuest.mockReturnValue({
         mutate: mockCreateGuestMutation,
         isPending: true
      });
      
      render(
         <MemoryRouter initialEntries={['/']}>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: vi.fn() 
             }}>
               <WelcomePage />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      )

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /Create Guest/i }));

      expect(screen.getByText('Creating guest account...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Guest/i })).toBeDisabled();
   });

   it('handles successful guest creation', async () => {
      mockCreateGuestMutation.mockImplementation((_variables, options) => {
         options.onSuccess({
            user: {
               id: 1,
               email: 'guest123@gmail.com',
               account_type: 'guest',
            }
         })
      });
      
      const setUser = vi.fn();
      
      render(
         <MemoryRouter initialEntries={['/']}>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: setUser 
             }}>
               <WelcomePage />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      )

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /Create Guest/i }));

      expect(setUser).toHaveBeenCalledWith({
         id: 1,
         email: 'guest123@gmail.com',
         account_type: 'guest',
      });

      expect(mockShowToast).toHaveBeenCalledWith({
         type: "success", 
         message: "Signed in as guest", 
         duration: 3000
      });

      expect(screen.getByTestId('location')).toHaveTextContent('/dashboard');
   });

   it('handles failed guest creation', async () => {
      mockCreateGuestMutation.mockImplementation((_variables, options) => {
         options.onError()
      });
      
      const setUser = vi.fn();
      
      render(
         <MemoryRouter initialEntries={['/']}>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: setUser 
             }}>
               <WelcomePage />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      )

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /Create Guest/i }));

      expect(mockShowToast).toHaveBeenCalledWith({
         type: "error", 
         message: "Could not create a guest account. Please try again.", 
         duration: 3000
      });

      expect(screen.getByTestId('location')).toHaveTextContent('/');
   });
});