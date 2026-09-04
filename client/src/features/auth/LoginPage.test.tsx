import { expect, describe, it, vi, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { AuthContext } from "../../app/AuthProvider";
import { MemoryRouter, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const { mockShowToast, mockUseLogin, mockLoginMutation } = vi.hoisted(() => ({
   mockShowToast: vi.fn(),
   mockUseLogin: vi.fn(),
   mockLoginMutation: vi.fn(),
}));

vi.mock('../../components/Toast', () => ({
   useToast: () => ({
      showToast: mockShowToast
   })
}));

vi.mock('./useAuth', () => ({
   useLogin: mockUseLogin
}));

function LocationDisplay() {
   const location = useLocation();

   return <div data-testid='location'>{location.pathname}</div>
};

function renderLoginPage() {
   const setUser = vi.fn();

   render(
      <MemoryRouter initialEntries={['/login']}>
         <AuthContext.Provider value={{
            user: undefined,
            isLoading: false,
            setUser
         }}>
            <LoginPage />
            <LocationDisplay />
         </AuthContext.Provider>
      </MemoryRouter>
   );

   return { setUser };
};

function getLoginFields() {
   return {
      email: screen.getByPlaceholderText('name@example.com'),
      password: screen.getByPlaceholderText('Enter password'),
   };
};

describe('LoginPage', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockUseLogin.mockReturnValue({
         mutate: mockLoginMutation
      });
   });
   
   it('renders login page', () => {
      renderLoginPage();

      expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'password');
      expect(screen.getByText(/Don't have an account?/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/signup');
   });

   it('validates required fields and does not submit invalid input', async () => {
      renderLoginPage();

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Sign in' }));

      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'error',
         message: 'Please fix the errors',
         duration: 3000,
      });

      expect(mockLoginMutation).not.toHaveBeenCalled();
   });

   it('validates email format and password length', async () => {
      renderLoginPage();

      const { email, password } = getLoginFields();

      const user = userEvent.setup();

      await user.type(email, 'invalid-email');
      await user.type(password, 'short');

      await user.click(screen.getByRole('button', { name: 'Sign in' }));

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be 8-64 characters')).toBeInTheDocument();

      expect(mockLoginMutation).not.toHaveBeenCalled();
   });

   it('toggles password visibility', async () => {
      renderLoginPage();

      const password = screen.getByPlaceholderText('Enter password');

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /Show/i }));
      
      expect(password).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /Hide/i })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /Hide/i }));

      expect(password).toHaveAttribute('type', 'password');
      expect(screen.getByRole('button', { name: /Show/i })).toBeInTheDocument();
   });

   it('submits valid credentials and navigates after a successful login', async () => {
      const { setUser } = renderLoginPage();
      const { email, password } = getLoginFields(); 

      const user = userEvent.setup();

      await user.type(email, 'user@example.com');
      await user.type(password, 'password123');

      await user.click(screen.getByRole('button', { name: 'Sign in' }));

      expect(mockLoginMutation).toHaveBeenCalledWith(
         { 
            email: 'user@example.com', 
            password: 'password123' 
         },
         expect.objectContaining({ 
            onSuccess: expect.any(Function), 
            onError: expect.any(Function) 
         })
      );

      const [, callbacks] = mockLoginMutation.mock.calls[0];
      
      const userData = { id: '1', email: 'user@example.com' };
      
      act(() => {
         callbacks.onSuccess({ user: userData });
      });

      expect(setUser).toHaveBeenCalledWith(userData);
      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'success',
         message: 'Logged in successfully',
         duration: 3000,
      });
      
      expect(screen.getByTestId('location')).toHaveTextContent('/dashboard');
      expect(email).toHaveValue('');
      expect(password).toHaveValue('');
   });

   it.each([
      [{ response: { status: 401 } }, 'Invalid email or password'],
      [{ response: { status: 500 } }, 'Login failed. Please try again.'],
   ])('shows the appropriate error when login fails', async (error, message) => {
      renderLoginPage();
      
      const { email, password } = getLoginFields();

      const user = userEvent.setup();
      
      await user.type(email, 'user@example.com');
      await user.type(password, 'password123');

      await user.click(screen.getByRole('button', { name: 'Sign in' }));

      const [, callbacks] = mockLoginMutation.mock.calls[0];

      act(() => {
         callbacks.onError(error);
      });

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'error',
         message,
         duration: 3000,
      });

      expect(screen.getByTestId('location')).toHaveTextContent('/login');
      expect(email).not.toHaveValue('');
      expect(password).not.toHaveValue('');
   });
});