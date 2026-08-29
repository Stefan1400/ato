import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFoundPage from "./NotFoundPage";
import { AuthContext } from "../app/AuthProvider";
import { MemoryRouter, useLocation } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";

function LocationDisplay() {
   const location = useLocation();

   return <div data-testid="location">{location.pathname}</div>
};

describe('NotFoundPage', () => {
   it('renders 404 page for authorized users', () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <NotFoundPage />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText("We couldn't find the page you were looking for.")).toBeInTheDocument();
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
      
      expect(screen.queryByText('Go to Welcome Page')).not.toBeInTheDocument();
   });

   it('renders 404 page for unauthorized users', () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <NotFoundPage />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByText("We couldn't find the page you were looking for.")).toBeInTheDocument();
      expect(screen.getByText('Go to Welcome Page')).toBeInTheDocument();
      
      expect(screen.queryByText('Go to Dashboard')).not.toBeInTheDocument();
   });

   it('navigates authorized users to dashboard', async () => {
      render(
         <MemoryRouter initialEntries={['/random-page']}>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <NotFoundPage />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('link', { name: /Go to Dashboard/i }));

      expect(screen.getByTestId('location')).toHaveTextContent('/dashboard');
   });

   it('navigates unauthorized users to /', async () => {
      render(
         <MemoryRouter initialEntries={['/random-page']}>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <NotFoundPage />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('link', { name: /Go to Welcome Page/i }));

      expect(screen.getByTestId('location')).toHaveTextContent('/');
   });
});