import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { AuthContext } from "./app/AuthProvider";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { userEvent } from "@testing-library/user-event";

const queryClient = new QueryClient();

describe('App', () => {
   it('renders menu when user is authorized', async () => {
      render(
         <MemoryRouter>
            <QueryClientProvider client={queryClient}>
               <AuthContext.Provider
                  value={{
                     user: { id: 2, account_type: 'user', email: 'user@gmail.com' },
                     isLoading: false,
                     setUser: vi.fn()
                  }}
               >
                  <App />
               </AuthContext.Provider>
            </QueryClientProvider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Menu/i }));

      expect(
         screen.getByRole("link", { name: /Analytics/i })
      ).toBeInTheDocument();
   });
   
   it('doesnt render menu when user is unauthorized', () => {
      render(
         <MemoryRouter>
            <QueryClientProvider client={queryClient}>
               <AuthContext.Provider value={{ user: undefined, isLoading: false, setUser: vi.fn() }}>
                  <App />
               </AuthContext.Provider>
            </QueryClientProvider>
         </MemoryRouter>
      );

      expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
   });

   it('renders delete account popup', async () => {

      render(
         <MemoryRouter>
            <QueryClientProvider client={queryClient}>
               <AuthContext.Provider 
                  value={{ 
                     user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
                     isLoading: false, 
                     setUser: vi.fn() 
                  }}>
                  <App />
               </AuthContext.Provider>
            </QueryClientProvider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /delete account/i }));

      expect(screen.queryByText('Delete Account?')).toBeInTheDocument();
   });
});