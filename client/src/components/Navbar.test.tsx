import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { AuthContext } from "../app/AuthProvider";
import { MemoryRouter, useLocation } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";

vi.mock("./DesktopAccountDropdown", () => ({
   default: () => <div data-testid="desktop-account-dropdown" />,
}));

function LocationDisplay() {
   const location = useLocation();

   return <div data-testid='location'>{location.pathname}</div>;
};

describe('Navbar', () => {
   it("keeps the open-menu close button and account dropdown on the right", () => {
      render(
         <MemoryRouter initialEntries={['/dashboard']}>
            <AuthContext.Provider value={{
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' },
               isLoading: false,
               setUser: vi.fn()
            }}>
               <Navbar
                  toggleMenu={vi.fn()}
                  menuOpen={true}
                  toggleDeleteAccountPopup={vi.fn()}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const accountDropdown = screen.getByTestId('desktop-account-dropdown');
      const closeButton = screen.getByRole('button', { name: /toggle menu/i });

      expect(screen.queryByRole('link', { name: /ato/i })).not.toBeInTheDocument();
      expect(accountDropdown.parentElement).toBe(closeButton.parentElement);
      expect(closeButton.parentElement).toHaveClass('ml-auto');
   });

   it("navigates to /dashboard when authorized user clicks ato", async () => {
      render(
         <MemoryRouter initialEntries={['/analytics']}>
            <AuthContext.Provider 
               value={{ 
                  user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={vi.fn()} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('link', { name: /ato/}));

      expect(screen.getByTestId('location')).toHaveTextContent('/dashboard');
   });

   it("navigates to /dashboard when authorized guest clicks ato", async () => {
      render(
         <MemoryRouter initialEntries={['/analytics']}>
            <AuthContext.Provider 
               value={{ 
                  user: { id: 1, email: 'guest123532342@gmail.com', account_type: 'guest' }, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={vi.fn()} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('link', { name: /ato/}));

      expect(screen.getByTestId('location')).toHaveTextContent('/dashboard');
   });

   it("navigates to / when unauthorized user clicks ato", async () => {
      render(
         <MemoryRouter initialEntries={['/signup']}>
            <AuthContext.Provider 
               value={{ 
                  user: undefined, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={vi.fn()} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('link', { name: /ato/}));

      expect(screen.getByTestId('location')).toHaveTextContent('/');
   });

   it("renders menu toggle button for authorized users", () => {      
      render(
         <MemoryRouter>
            <AuthContext.Provider 
               value={{ 
                  user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={vi.fn()} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByRole('button', { name: /toggle menu/i})).toBeInTheDocument();
   });

   it("renders menu toggle button for authorized guests", () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider 
               value={{ 
                  user: { id: 1, email: 'guest123532342@gmail.com', account_type: 'guest' }, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={vi.fn()} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByRole('button', { name: /toggle menu/i})).toBeInTheDocument();
   });

   it("does not render menu toggle button for unauthorized users", () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider 
               value={{ 
                  user: undefined, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={vi.fn()} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.queryByRole('button', { name: /toggle menu/i})).not.toBeInTheDocument();
   });

   it("confirms toggle menu is called for authorized users", async () => {
      const toggleMenu = vi.fn();
      
      render(
         <MemoryRouter>
            <AuthContext.Provider 
               value={{ 
                  user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={toggleMenu} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /toggle menu/i}));

      expect(toggleMenu).toHaveBeenCalled();
   });

   it("confirms toggle menu is called for authorized guests", async () => {
      const toggleMenu = vi.fn();
      
      render(
         <MemoryRouter>
            <AuthContext.Provider 
               value={{ 
                  user: { id: 1, email: 'guest123532342@gmail.com', account_type: 'guest' }, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={toggleMenu} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /toggle menu/i}));

      expect(toggleMenu).toHaveBeenCalled();
   });

   it("renders desktop account dropdown for authorized users", async () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider 
               value={{ 
                  user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={vi.fn()} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );
      
      expect(screen.getByTestId('desktop-account-dropdown')).toBeInTheDocument();
   });

   it("does not render desktop account dropdown for unauthorized users", async () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider 
               value={{ 
                  user: undefined, 
                  isLoading: false, 
                  setUser: vi.fn()
               }}
            >
               <Navbar 
                  toggleMenu={vi.fn()} 
                  menuOpen={false} 
                  toggleDeleteAccountPopup={vi.fn()} 
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.queryByTestId('desktop-account-dropdown')).not.toBeInTheDocument();
   });
});