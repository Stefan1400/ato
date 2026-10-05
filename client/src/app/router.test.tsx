import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { AuthContext } from './AuthProvider';
import type { AuthContextType } from './AuthProvider';

vi.mock('../pages/WelcomePage', () => ({
   default: () => <div>Welcome Page</div>,
}));

vi.mock('../pages/HomePage', () => ({
   default: () => <div>Home Page</div>,
}));

vi.mock('../pages/NotFoundPage', () => ({
   default: () => <div>Not Found Page</div>,
}));

vi.mock('../features/auth/RegisterPage', () => ({
   default: () => <div>Register Page</div>,
}));

vi.mock('../features/auth/LoginPage', () => ({
   default: () => <div>Login Page</div>,
}));

vi.mock('../features/analytics/AnalyticsPage', () => ({
   default: () => <div>Analytics Page</div>,
}));

vi.mock('../features/auth/changePassword/ChangePasswordPage', () => ({
   default: () => <div>Change Password Page</div>,
}));

vi.mock('../components/LoadingScreen', () => ({
   default: ({ text }: { text: string }) => <div>{text}</div>,
}));

function renderRouter(
   path: string,
   authValue: AuthContextType
) {
   return render(
      <AuthContext.Provider value={authValue}>
         <MemoryRouter initialEntries={[path]}>
            <AppRouter />
         </MemoryRouter>
      </AuthContext.Provider>
   );
};

describe('AppRouter', () => {
   describe('WelcomeRoute', () => {
      it('renders the welcome page for unauthenticated users', () => {
         renderRouter('/', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Welcome Page')).toBeInTheDocument();
      });

      it('shows the loading screen while authentication is loading', () => {
         renderRouter('/', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: true,
         });

         expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      it('redirects authenticated users to the dashboard', () => {
         renderRouter('/', {
            user: { id: 74, email: 'user@gmail.com', account_type: 'user' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Home Page')).toBeInTheDocument();
         expect(screen.queryByText('Welcome Page')).not.toBeInTheDocument();
      });
   });

   describe('ProtectedRoute', () => {
      it('renders the protected page for authenticated users', () => {
         renderRouter('/dashboard', {
            user: { id: 74, email: 'user@gmail.com', account_type: 'user' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Home Page')).toBeInTheDocument();
      });

      it('shows the loading screen while authentication is loading', () => {
         renderRouter('/dashboard', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: true,
         });

         expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      it('redirects unauthenticated users to the welcome page', () => {
         renderRouter('/dashboard', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Welcome Page')).toBeInTheDocument();
      });
   });

   describe('GuestOnlyRoute', () => {
      it('renders the signup page for unauthenticated users', () => {
         renderRouter('/signup', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Register Page')).toBeInTheDocument();
      });

      it('renders the login page for unauthenticated users', () => {
         renderRouter('/login', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Login Page')).toBeInTheDocument();
      });

      it('allows guest users to access the signup page', () => {
         renderRouter('/signup', {
            user: { id: 74, email: 'guest@gmail.com', account_type: 'guest' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Register Page')).toBeInTheDocument();
      });

      it('allows guest users to access the login page', () => {
         renderRouter('/login', {
            user: { id: 74, email: 'guest@gmail.com', account_type: 'guest' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Login Page')).toBeInTheDocument();
      });

      it('redirects authenticated non-guest users from signup to the dashboard', () => {
         renderRouter('/signup', {
            user: { id: 74, email: 'user@gmail.com', account_type: 'user' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Home Page')).toBeInTheDocument();
         expect(screen.queryByText('Register Page')).not.toBeInTheDocument();
      });

      it('redirects authenticated non-guest users from login to the dashboard', () => {
         renderRouter('/login', {
            user: { id: 74, email: 'user@gmail.com', account_type: 'user' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Home Page')).toBeInTheDocument();
         expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
      });

      it('shows the loading screen while authentication is loading', () => {
         renderRouter('/login', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: true,
         });

         expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
   });

   describe('route mapping', () => {
      it('renders the analytics page', () => {
         renderRouter('/analytics', {
            user: { id: 74, email: 'user@gmail.com', account_type: 'user' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Analytics Page')).toBeInTheDocument();
      });

      it('allows authenticated guests to access the analytics page', () => {
         renderRouter('/analytics', {
            user: { id: 74, email: null, account_type: 'guest' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Analytics Page')).toBeInTheDocument();
      });

      it('renders the change password page', () => {
         renderRouter('/change-password', {
            user: { id: 74, email: 'user@gmail.com', account_type: 'user' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Change Password Page')).toBeInTheDocument();
      });

      it('redirects authenticated guests from change password to the dashboard', () => {
         renderRouter('/change-password', {
            user: { id: 74, email: null, account_type: 'guest' },
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Home Page')).toBeInTheDocument();
         expect(screen.queryByText('Change Password Page')).not.toBeInTheDocument();
      });

      it('redirects unauthenticated users from change password to the welcome page', () => {
         renderRouter('/change-password', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Welcome Page')).toBeInTheDocument();
         expect(screen.queryByText('Change Password Page')).not.toBeInTheDocument();
      });

      it('renders the not found page for an unknown route', () => {
         renderRouter('/this-route-does-not-exist', {
            user: undefined,
            setUser: vi.fn(),
            isLoading: false,
         });

         expect(screen.getByText('Not Found Page')).toBeInTheDocument();
      });
   });
});