import { expect, describe, it, vi, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import ChangePasswordPage from "./ChangePasswordPage";
import { AuthContext } from "../../../app/AuthProvider";
import { MemoryRouter, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";

const { 
   mockShowToast, 
   mockUseChangePassword, 
   mockUseLogout, 
   mockChangePasswordMutation, 
   mockLogoutMutation 
} = vi.hoisted(() => ({
	mockShowToast: vi.fn(),
	mockUseChangePassword: vi.fn(),
	mockUseLogout: vi.fn(),
	mockChangePasswordMutation: vi.fn(),
	mockLogoutMutation: vi.fn(),
}));

vi.mock('../../../components/Toast', () => ({
	useToast: () => ({
		showToast: mockShowToast
	})
}));

vi.mock('../useAuth', () => ({
	useChangePassword: mockUseChangePassword,
	useLogout: mockUseLogout,
}));

function LocationDisplay() {
	const location = useLocation();

	return <div data-testid='location'>{location.pathname}</div>;
};

function renderChangePasswordPage(user?: { id: number; email: string | null; account_type?: string }) {
	const setUser = vi.fn();

	render(
		<MemoryRouter initialEntries={['/change-password']}>
			<AuthContext.Provider value={{
				user,
				isLoading: false,
				setUser
			}}>
				<ChangePasswordPage />
				<LocationDisplay />
			</AuthContext.Provider>
		</MemoryRouter>
	);

	return { setUser };
};

function getChangePasswordFields() {
	return {
		current_password: screen.getByPlaceholderText('Current password'),
		new_password: screen.getByPlaceholderText('New password'),
		confirm_new_password: screen.getByPlaceholderText('Confirm new password'),
	};
};

async function submitValidPasswordChange() {
   const user = userEvent.setup();
   const { 
      current_password, 
      new_password, 
      confirm_new_password 
   } = getChangePasswordFields();

   await user.type(current_password, 'currentpassword123');
   await user.type(new_password, 'newpassword123');
   await user.type(confirm_new_password, 'newpassword123');

   await user.click(screen.getByRole('button', { name: 'Change Password' }));
};

describe('ChangePasswordPage', () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mockUseChangePassword.mockReturnValue({
         mutate: mockChangePasswordMutation
      });
      mockUseLogout.mockReturnValue({
         mutate: mockLogoutMutation
      });
   });

   it('renders change password fields and account links', () => {
      renderChangePasswordPage();

      expect(screen.getByRole('heading', { name: 'Change Password' })).toBeInTheDocument();
      expect(screen.getByText('Use a strong password between 8 and 64 characters.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Current password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Change Password' })).toBeInTheDocument();
   });

   it('validates required fields without submitting', async () => {
         renderChangePasswordPage();
   
         const user = userEvent.setup();
         await user.click(screen.getByRole('button', { name: 'Change Password' }));
   
         expect(screen.queryAllByText('Field is required')).toHaveLength(3);
   
         expect(mockShowToast).toHaveBeenCalledWith({
            type: 'error',
            message: 'Please fix the errors',
            duration: 3000,
         });
         
         expect(mockChangePasswordMutation).not.toHaveBeenCalled();
   });

   it('validates password format and length', async () => {
         renderChangePasswordPage();
   
         const { current_password, new_password, confirm_new_password } = getChangePasswordFields();
         const user = userEvent.setup();
   
         await user.type(current_password, 'invalid-current-password');
         await user.type(new_password, 'short');
         await user.type(confirm_new_password, 'mismatch');

         await user.click(screen.getByRole('button', { name: 'Change Password' }));
   
         expect(screen.getByText('Password must be 8-64 characters')).toBeInTheDocument();
         expect(screen.getByText('Passwords must match')).toBeInTheDocument();
         
         expect(mockChangePasswordMutation).not.toHaveBeenCalled();
   });

   it('toggles password visibility for all password fields', async () => {
      renderChangePasswordPage();

      const user = userEvent.setup();

      const currentPassword = screen.getByPlaceholderText('Current password');
      const newPassword = screen.getByPlaceholderText('New password');
      const confirmNewPassword = screen.getByPlaceholderText('Confirm new password');

      const currentPasswordContainer = currentPassword.parentElement!;
      const newPasswordContainer = newPassword.parentElement!;
      const confirmPasswordContainer = confirmNewPassword.parentElement!;

      await user.click(within(currentPasswordContainer).getByRole('button', { name: 'Show' }));
      expect(currentPassword).toHaveAttribute('type', 'text');
      expect(within(currentPasswordContainer).getByRole('button', { name: 'Hide' })).toBeInTheDocument();

      await user.click(within(currentPasswordContainer).getByRole('button', { name: 'Hide' }));
      expect(currentPassword).toHaveAttribute('type', 'password');
      expect(within(currentPasswordContainer).getByRole('button', { name: 'Show' })).toBeInTheDocument();



      await user.click(within(newPasswordContainer).getByRole('button', { name: 'Show' }));
      expect(newPassword).toHaveAttribute('type', 'text');
      expect(within(newPasswordContainer).getByRole('button', { name: 'Hide' })).toBeInTheDocument();

      await user.click(within(newPasswordContainer).getByRole('button', { name: 'Hide' }));
      expect(newPassword).toHaveAttribute('type', 'password');
      expect(within(newPasswordContainer).getByRole('button', { name: 'Show' })).toBeInTheDocument();



      await user.click(within(confirmPasswordContainer).getByRole('button', { name: 'Show' }));
      expect(confirmNewPassword).toHaveAttribute('type', 'text');
      expect(within(confirmPasswordContainer).getByRole('button', { name: 'Hide' })).toBeInTheDocument();

      await user.click(within(confirmPasswordContainer).getByRole('button', { name: 'Hide' }));
      expect(confirmNewPassword).toHaveAttribute('type', 'password');
      expect(within(confirmPasswordContainer).getByRole('button', { name: 'Show' })).toBeInTheDocument();
   });

   it('changes password and navigates after success', async () => {
      renderChangePasswordPage();

      await submitValidPasswordChange();

      expect(mockChangePasswordMutation).toHaveBeenCalledWith(
         { 
            current_password: 'currentpassword123', 
            new_password: 'newpassword123',
         },
         expect.objectContaining({
            onSuccess: expect.any(Function),
            onError: expect.any(Function),
         })
      );

      const [, callbacks] = mockChangePasswordMutation.mock.calls[0];
      const userData = { id: 1, email: 'user@example.com' };

      act(() => {
         callbacks.onSuccess({ user: userData });
      });

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'success',
         message: 'Password changed successfully',
         duration: 3000,
      });

      expect(screen.getByPlaceholderText('Current password')).toHaveValue('');
      expect(screen.getByPlaceholderText('New password')).toHaveValue('');
      expect(screen.getByPlaceholderText('Confirm new password')).toHaveValue('');

      expect(mockLogoutMutation).toHaveBeenCalled();

      expect(screen.getByTestId('location')).toHaveTextContent('/login');
   });

   it('shows an error toast when password change fails', async () => {
      renderChangePasswordPage();

      await submitValidPasswordChange();

      const [, callbacks] = mockChangePasswordMutation.mock.calls[0];

      act(() => {
         callbacks.onError(new Error('Password change failed'));
      });

      expect(mockShowToast).toHaveBeenCalledWith({
         type: 'error',
         message: 'Failed to change password',
         duration: 3000,
      });

      expect(screen.getByTestId('location')).toHaveTextContent('/change-password');
   });
});