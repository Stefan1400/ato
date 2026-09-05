import { expect, describe, it, vi, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import RegisterPage from "./RegisterPage";
import { AuthContext } from "../../app/AuthProvider";
import { MemoryRouter, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const { mockShowToast, mockUseRegister, mockUseConvertGuest, mockRegisterMutation, mockConvertGuestMutation } = vi.hoisted(() => ({
	mockShowToast: vi.fn(),
	mockUseRegister: vi.fn(),
	mockUseConvertGuest: vi.fn(),
	mockRegisterMutation: vi.fn(),
	mockConvertGuestMutation: vi.fn(),
}));

vi.mock('../../components/Toast', () => ({
	useToast: () => ({
		showToast: mockShowToast
	})
}));

vi.mock('./useAuth', () => ({
	useRegister: mockUseRegister,
	useConvertGuest: mockUseConvertGuest,
}));

function LocationDisplay() {
	const location = useLocation();

	return <div data-testid='location'>{location.pathname}</div>;
};

function renderRegisterPage(user?: { id: number; email: string | null; account_type?: string }) {
	const setUser = vi.fn();

	render(
		<MemoryRouter initialEntries={['/signup']}>
			<AuthContext.Provider value={{
				user,
				isLoading: false,
				setUser
			}}>
				<RegisterPage />
				<LocationDisplay />
			</AuthContext.Provider>
		</MemoryRouter>
	);

	return { setUser };
};

function getRegisterFields() {
	return {
		email: screen.getByPlaceholderText('name@example.com'),
		password: screen.getByPlaceholderText('Create a password'),
	};
};

async function submitValidRegistration() {
	const user = userEvent.setup();
	const { email, password } = getRegisterFields();

	await user.type(email, 'user@example.com');
	await user.type(password, 'password123');
	await user.click(screen.getByRole('checkbox'));
	await user.click(screen.getByRole('button', { name: 'Sign up' }));
};

describe('RegisterPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockUseRegister.mockReturnValue({
			mutate: mockRegisterMutation
		});
		mockUseConvertGuest.mockReturnValue({
			mutate: mockConvertGuestMutation
		});
	});

	it('renders registration fields and account links', () => {
		renderRegisterPage();

		expect(screen.getByRole('heading', { name: 'Sign up' })).toBeInTheDocument();
		expect(screen.getByText('Create your free account.')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Create a password')).toHaveAttribute('type', 'password');
		expect(screen.getByRole('checkbox')).not.toBeChecked();
		expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
	});

	it('validates required fields and terms acceptance without submitting', async () => {
		renderRegisterPage();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Sign up' }));

		expect(screen.getByText('Email is required')).toBeInTheDocument();
		expect(screen.getByText('Password is required')).toBeInTheDocument();
		expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();

		expect(mockShowToast).toHaveBeenCalledWith({
			type: 'error',
			message: 'Please fix the errors',
			duration: 3000,
		});
      
		expect(mockRegisterMutation).not.toHaveBeenCalled();
		expect(mockConvertGuestMutation).not.toHaveBeenCalled();
	});

	it('validates email format and password length', async () => {
		renderRegisterPage();

		const { email, password } = getRegisterFields();
		const user = userEvent.setup();

		await user.type(email, 'invalid-email');
		await user.type(password, 'short');
		await user.click(screen.getByRole('checkbox'));
		await user.click(screen.getByRole('button', { name: 'Sign up' }));

		expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
		expect(screen.getByText('Password must be 8-64 characters')).toBeInTheDocument();
		
      expect(mockRegisterMutation).not.toHaveBeenCalled();
      expect(mockConvertGuestMutation).not.toHaveBeenCalled();
	});

	it('toggles password visibility', async () => {
		renderRegisterPage();

		const password = screen.getByPlaceholderText('Create a password');
		const user = userEvent.setup();

		await user.click(screen.getByRole('button', { name: 'Show' }));

		expect(password).toHaveAttribute('type', 'text');
		expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Hide' }));

		expect(password).toHaveAttribute('type', 'password');
      expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument();
	});

	it('registers a new account and navigates after success', async () => {
		const { setUser } = renderRegisterPage();

		await submitValidRegistration();

		expect(mockRegisterMutation).toHaveBeenCalledWith(
			{ 
            email: 'user@example.com', 
            password: 'password123' 
         },
			expect.objectContaining({
				onSuccess: expect.any(Function),
				onError: expect.any(Function),
			})
		);

		const [, callbacks] = mockRegisterMutation.mock.calls[0];
		const userData = { id: 1, email: 'user@example.com' };

		act(() => {
			callbacks.onSuccess({ user: userData });
		});

		expect(setUser).toHaveBeenCalledWith(userData);

		expect(mockShowToast).toHaveBeenCalledWith({
			type: 'success',
			message: 'Account created successfully',
			duration: 3000,
		});

		expect(screen.getByTestId('location')).toHaveTextContent('/dashboard');
		expect(screen.getByPlaceholderText('name@example.com')).toHaveValue('');
		expect(screen.getByPlaceholderText('Create a password')).toHaveValue('');
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('converts a guest account instead of registering a new account', async () => {
		renderRegisterPage({ id: 1, email: null, account_type: 'guest' });

		await submitValidRegistration();

		expect(mockConvertGuestMutation).toHaveBeenCalledWith(
			{ 
            email: 'user@example.com', 
            password: 'password123' 
         },
			expect.objectContaining({ 
            onSuccess: expect.any(Function), 
            onError: expect.any(Function) 
         })
		);

		expect(mockRegisterMutation).not.toHaveBeenCalled();
	});

	it('shows an error toast when registration fails', async () => {
		renderRegisterPage();

		await submitValidRegistration();

		const [, callbacks] = mockRegisterMutation.mock.calls[0];

		act(() => {
			callbacks.onError(new Error('Registration failed'));
		});

		expect(mockShowToast).toHaveBeenCalledWith({
			type: 'error',
			message: 'Registration failed. Please try again.',
			duration: 3000,
		});

		expect(screen.getByTestId('location')).toHaveTextContent('/signup');
	});
});