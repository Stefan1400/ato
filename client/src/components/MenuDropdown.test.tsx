import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MenuDropdown from "./MenuDropdown";
import { AuthContext } from "../app/AuthProvider";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";

const { mockUseLogout, mockMutate, mockShowToast } = vi.hoisted(() => ({
  mockUseLogout: vi.fn(),
  mockMutate: vi.fn(),
  mockShowToast: vi.fn()
}));

vi.mock("../features/auth/useAuth", () => ({
   useLogout: mockUseLogout,
}));

vi.mock('./Toast.tsx', () => ({
   useToast: () => ({
      showToast: mockShowToast
   }), 
}));

describe("MenuDropdown", () => {
   beforeEach(() => {
      vi.clearAllMocks();
      
      mockUseLogout.mockReturnValue({
         mutate: mockMutate,
         isPending: false,
      });
   });

   it('renders the correct menu dropdown for authorized guests', () => {
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ user: { id: 1, account_type: 'guest', email: '' }, isLoading: false, setUser: vi.fn() }}>
               <MenuDropdown 
                  toggleMenu={vi.fn()}
                  menuOpen={true}
                  toggleDeleteAccountPopup={vi.fn()}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();

      expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Account')).not.toBeInTheDocument();
   });

   it('renders the correct menu dropdown for authorized users', () => {
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, isLoading: false, setUser: vi.fn() }}>
               <MenuDropdown 
                  toggleMenu={vi.fn()}
                  menuOpen={true}
                  toggleDeleteAccountPopup={vi.fn()}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
      expect(screen.getByText('Delete Account')).toBeInTheDocument();

      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
   });

   it('renders signing out screen when logout is pending', () => {
      
      mockUseLogout.mockReturnValue({
         mutate: vi.fn(),
         isPending: true,
      });

      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, isLoading: false, setUser: vi.fn() }}>
               <MenuDropdown 
                  toggleMenu={vi.fn()}
                  menuOpen={true}
                  toggleDeleteAccountPopup={vi.fn()}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByText('Signing out...')).toBeInTheDocument();
   });

   it('calls logout mutation when Sign Out is clicked', async () => {

      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, isLoading: false, setUser: vi.fn() }}>
               <MenuDropdown 
                  toggleMenu={vi.fn()}
                  menuOpen={true}
                  toggleDeleteAccountPopup={vi.fn()}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /sign out/i }));

      expect(mockMutate).toHaveBeenCalled();
   });

   it('calls delete account popup toggle when Delete Account is clicked', async () => {

      const toggleDeleteAccountPopup = vi.fn();

      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, isLoading: false, setUser: vi.fn() }}>
               <MenuDropdown 
                  toggleMenu={vi.fn()}
                  menuOpen={true}
                  toggleDeleteAccountPopup={toggleDeleteAccountPopup}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /delete account/i }));

      expect(toggleDeleteAccountPopup).toHaveBeenCalled();
   });
   
   it('closes menu when menu link is clicked', async () => {

      const toggleMenu = vi.fn();

      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, isLoading: false, setUser: vi.fn() }}>
               <MenuDropdown 
                  toggleMenu={toggleMenu}
                  menuOpen={true}
                  toggleDeleteAccountPopup={vi.fn()}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('link', { name: /home/i }));

      expect(toggleMenu).toHaveBeenCalled();
   });

   it('closes menu on successful logout', async () => {

      const toggleMenu = vi.fn();

      mockMutate.mockImplementation((_variables, options) => {
         options.onSuccess();
      });

      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, isLoading: false, setUser: vi.fn() }}>
               <MenuDropdown 
                  toggleMenu={toggleMenu}
                  menuOpen={true}
                  toggleDeleteAccountPopup={vi.fn()}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /sign out/i }));

      expect(mockMutate).toHaveBeenCalled();
      expect(toggleMenu).toHaveBeenCalled();

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'success', message: 'Logged out successfully', duration: 3000
      })
   });

   it('keeps menu open on unsuccessful logout', async () => {

      const toggleMenu = vi.fn();

      mockMutate.mockImplementation((_variables, options) => {
         options.onError();
      });

      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, isLoading: false, setUser: vi.fn() }}>
               <MenuDropdown 
                  toggleMenu={toggleMenu}
                  menuOpen={true}
                  toggleDeleteAccountPopup={vi.fn()}
               />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /sign out/i }));

      expect(mockMutate).toHaveBeenCalled();
      expect(toggleMenu).not.toHaveBeenCalled();

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'error', message: 'Logout failed. Please try again.', duration: 3000
      })
   });
});