import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Popup from "./Popup";
import { AuthContext } from "../app/AuthProvider";
import { MemoryRouter, useLocation } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";

const { mockShowToast, mockUseDeleteUser, mockDeleteUserMutation } = vi.hoisted(() => ({
   mockShowToast: vi.fn(),
   mockUseDeleteUser: vi.fn(),
   mockDeleteUserMutation: vi.fn(),
}));

vi.mock('../components/Toast', () => ({
   useToast: () => ({
      showToast: mockShowToast
   })
}));

vi.mock('../features/auth/useAuth', () => ({
   useDeleteUser: mockUseDeleteUser
}));

function LocationDisplay() {
   const location = useLocation();

   return <div data-testid='location'>{location.pathname}</div>
};

describe('Popup', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockUseDeleteUser.mockReturnValue({
         mutate: mockDeleteUserMutation
      });
   });
   
   it('renders account deletion popup', () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={vi.fn()} 
                  toggleMenu={vi.fn()} 
               />
               <div data-testid='outside'></div>
            </AuthContext.Provider>
         </MemoryRouter>
      )

      expect(screen.getByText('Delete Account?')).toBeInTheDocument();
      expect(screen.getByText('Permanently delete your account and all session data. This cannot be undone.')).toBeInTheDocument();
      // expect(screen.getByText('Type to confirm.')).toBeInTheDocument();
      // expect(screen.getByText('delete my account')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Delete account')).toBeInTheDocument();
   });

   it('clicking outside calls toggle delete account popup', async () => {
      const toggleDeleteAccountPopup = vi.fn();
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={toggleDeleteAccountPopup} 
                  toggleMenu={vi.fn()} 
               />
               <div data-testid='outside'></div>
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId('outside'));

      expect(toggleDeleteAccountPopup).toHaveBeenCalled();
   });

   it('clicking cancel button calls toggle delete account popup', async () => {
      const toggleDeleteAccountPopup = vi.fn();
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={toggleDeleteAccountPopup} 
                  toggleMenu={vi.fn()} 
               />
               <div data-testid='outside'></div>
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: /Cancel/i }));

      expect(toggleDeleteAccountPopup).toHaveBeenCalled();
   });

   it('rejects invalid form submission', async () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={vi.fn()} 
                  toggleMenu={vi.fn()} 
               />
               <div data-testid='outside'></div>
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      await user.type(
         screen.getByPlaceholderText('delete my account'),
         'wrong text'
      );

      await user.click(screen.getByRole('button', { name: /Delete account/i }));

      expect(screen.getByText('Please enter "delete my account"')).toBeInTheDocument();

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'error', 
         message: 'Invalid confirmation string', 
         duration: 3000
      });

      expect(mockDeleteUserMutation).not.toHaveBeenCalled();
   });

   it('rejects empty form submission', async () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={vi.fn()} 
                  toggleMenu={vi.fn()} 
               />
               <div data-testid='outside'></div>
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Delete account/i }));

      expect(screen.getByText('Please enter "delete my account"')).toBeInTheDocument();

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'error', 
         message: 'Invalid confirmation string', 
         duration: 3000
      });

      expect(mockDeleteUserMutation).not.toHaveBeenCalled();
   });

   it('disables delete button while deletion is pending', async () => {
      mockUseDeleteUser.mockReturnValue({
         mutate: mockDeleteUserMutation,
         isPending: true
      });
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={vi.fn()} 
                  toggleMenu={vi.fn()} 
               />
               <div data-testid='outside'></div>
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByText('Deleting account...')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /Delete Account Submit/i })).toBeDisabled();
   });

   it('successfully deletes account', async () => {
      mockDeleteUserMutation.mockImplementation((_variables, options) => {
         options.onSuccess()
      });

      const toggleDeleteAccountPopup = vi.fn();
      const toggleMenu = vi.fn();
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={toggleDeleteAccountPopup} 
                  toggleMenu={toggleMenu} 
               />
               <div data-testid='outside'></div>
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      const formInput = screen.getByPlaceholderText('delete my account');

      await user.type(
         formInput,
         'delete my account'
      );

      await user.click(screen.getByRole('button', { name: /Delete account/i }));

      expect(toggleDeleteAccountPopup).toHaveBeenCalled();

      expect(mockDeleteUserMutation).toHaveBeenCalled();

      expect(formInput).toHaveValue('');

      expect(screen.queryByText('Please enter "delete my account"')).not.toBeInTheDocument();

      expect(screen.getByTestId('location')).toHaveTextContent('/signup');

      expect(toggleMenu).toHaveBeenCalled();

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'success', 
         message: 'Account successfully deleted', 
         duration: 3000
      });
   });

   it('accepts confirmation string regardless of capitalization', async () => {
      mockDeleteUserMutation.mockImplementation((_variables, options) => {
         options.onSuccess()
      });

      const toggleDeleteAccountPopup = vi.fn();
      const toggleMenu = vi.fn();
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={toggleDeleteAccountPopup} 
                  toggleMenu={toggleMenu} 
               />
               <div data-testid='outside'></div>
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.type(
         screen.getByPlaceholderText('delete my account'),
         'DELETE My account'
      );

      await user.click(screen.getByRole('button', { name: /Delete account/i }));

      expect(mockDeleteUserMutation).toHaveBeenCalled();

      expect(screen.queryByText('Please enter "delete my account"')).not.toBeInTheDocument();
   });

   it('handles failed account deletion', async () => {
      mockDeleteUserMutation.mockImplementation((_variables, options) => {
         options.onError()
      });
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 2, account_type: 'user', email: 'user@gmail.com' }, 
               isLoading: false, 
               setUser: vi.fn()
             }}>
               <Popup 
                  toggleDeleteAccountPopup={vi.fn()} 
                  toggleMenu={vi.fn()} 
               />
               <div data-testid='outside'></div>
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      const formInput = screen.getByPlaceholderText('delete my account');

      await user.type(
         formInput,
         'delete my account'
      );

      await user.click(screen.getByRole('button', { name: /Delete account/i }));

      expect(mockDeleteUserMutation).toHaveBeenCalled();

      expect(screen.getByTestId('location')).not.toHaveTextContent('/signup');

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'error', 
         message: 'Account could not be deleted', 
         duration: 3000
      });
   });
});