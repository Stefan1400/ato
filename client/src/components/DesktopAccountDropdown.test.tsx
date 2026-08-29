import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DesktopAccountDropdown from "./DesktopAccountDropdown";
import { AuthContext } from "../app/AuthProvider";
import { MemoryRouter, useLocation } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";

const { mockShowToast, mockUseLogout, mockMutate } = vi.hoisted(() => ({
   mockShowToast: vi.fn(),
   mockUseLogout: vi.fn(),
   mockMutate: vi.fn(),
}));

vi.mock('./Toast', () => ({
   useToast: () => ({
      showToast: mockShowToast,
   })
}));

vi.mock('../features/auth/useAuth', () => ({
   useLogout: mockUseLogout,
}));

function LocationDisplay() {
   const location = useLocation();

   return <div data-testid="location">{location.pathname}</div>
};

describe('DesktopAccountDropdown', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockUseLogout.mockReturnValue({
         mutate: mockMutate,
         isPending: false,
      });
   });
   
   it('renders username for authorized users', () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByText('Stefan123')).toBeInTheDocument();
   });

   it('renders username for authorized guests', () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'guest123532342@gmail.com', account_type: 'guest' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(screen.getByText('Guest')).toBeInTheDocument();
   });

   it('renders dropdown for authorized users', async () => {
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
      expect(screen.getByText('Delete Account')).toBeInTheDocument();

      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
   });

   it('renders dropdown for authorized guests', async () => {      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'guest123532342@gmail.com', account_type: 'guest' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();

      expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
      expect(screen.queryByText('Delete Account')).not.toBeInTheDocument();
   });

   it('does not render dropdown for unauthorized users', () => {      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: undefined, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      expect(
         screen.queryByRole('button', { name: /Toggle Desktop Account Dropdown/i })
      ).not.toBeInTheDocument();
   });

   it('renders loading screen when sign out is pending', async () => {
      mockUseLogout.mockReturnValue({
         mutate: mockMutate,
         isPending: true,
      });
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));

      expect(screen.getByText('Signing out...')).toBeInTheDocument();
   });

   it('confirms mutation is called when sign out button is clicked', async () => {
      mockUseLogout.mockReturnValue({
         mutate: mockMutate,
         isPending: false,
      });
      
      render(
         <MemoryRouter>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));

      await user.click(screen.getByRole('button', { name: /Sign Out/i }));

      expect(mockMutate).toHaveBeenCalled();
   });

   it('handles sign out on success', async () => {
      mockMutate.mockImplementation((_variables, options) => {
         options.onSuccess();
      });
      
      render(
         <MemoryRouter initialEntries={['/dashboard']}>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));

      await user.click(screen.getByRole('button', { name: /Sign Out/i }));

      expect(mockMutate).toHaveBeenCalled();
      
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      
      expect(mockShowToast).toHaveBeenCalledWith({
         type: "success", 
         message: "Logged out successfully", 
         duration: 3000
      });

      expect(screen.getByTestId('location')).toHaveTextContent('/');
   });

   it('handles sign out on error', async () => {
      mockMutate.mockImplementation((_variables, options) => {
         options.onError();
      });
      
      render(
         <MemoryRouter initialEntries={['/dashboard']}>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));

      await user.click(screen.getByRole('button', { name: /Sign Out/i }));

      expect(mockMutate).toHaveBeenCalled();

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      
      expect(mockShowToast).toHaveBeenCalledWith({
         type: "error", 
         message: "Logout failed. Please try again.", 
         duration: 3000
      });

      expect(screen.getByTestId('location')).toHaveTextContent('/dashboard');
   });

   it('closes dropdown when link is clicked', async () => {
      render(
         <MemoryRouter initialEntries={['/dashboard']}>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));
      await user.click(screen.getByRole('link', { name: /Home/i }));

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
   });

   it('toggles dropdown when toggle button is clicked', async () => {
      render(
         <MemoryRouter initialEntries={['/dashboard']}>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();
      const toggleButton = screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i });

      await user.click(toggleButton);

      expect(screen.getByText('Home')).toBeInTheDocument();

      await user.click(toggleButton);

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
   });

   it('opens delete account popup and closes dropdown', async () => {
      const toggleDeleteAccountPopup = vi.fn();
      
      render(
         <MemoryRouter initialEntries={['/dashboard']}>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={toggleDeleteAccountPopup} />
               <LocationDisplay />
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));
      await user.click(screen.getByRole('button', { name: /Delete Account/i }));

      expect(toggleDeleteAccountPopup).toHaveBeenCalled();

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
   });

   it('closes dropdown when user clicks outside', async () => {      
      render(
         <MemoryRouter initialEntries={['/dashboard']}>
            <AuthContext.Provider value={{ 
               user: { id: 1, email: 'stefan123@gmail.com', account_type: 'user' }, 
               isLoading: false, 
               setUser: vi.fn() 
            }}>
               <DesktopAccountDropdown toggleDeleteAccountPopup={vi.fn()} />
               <LocationDisplay />
               <div data-testid='outside'></div>
            </AuthContext.Provider>
         </MemoryRouter>
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /Toggle Desktop Account Dropdown/i }));

      await user.click(screen.getByTestId('outside'));

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
   });
});