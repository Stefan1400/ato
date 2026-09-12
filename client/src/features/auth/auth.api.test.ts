import { expect, describe, it, vi, beforeEach } from "vitest";
import {
	registerUser,
	loginUser,
	createGuestUser,
	convertGuestAccount,
	getUser,
	logoutUser,
	deleteUser,
	changePassword,
} from "./auth.api";

const { mockApi } = vi.hoisted(() => ({
	mockApi: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
	api: mockApi,
}));

const user = {
	id: 1,
	email: "user@example.com",
};

const authResponse = {
	user,
	token: "token",
};

const registerRequest = {
	email: "user@example.com",
	password: "password",
};

const changePasswordRequest = {
	current_password: "current-password",
	new_password: "new-password",
};

describe("registerUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApi.mockResolvedValue(authResponse);
	});

	it("calls the register API and returns the auth response", async () => {
		const result = await registerUser(registerRequest);

		expect(mockApi).toHaveBeenCalledWith("/users/register", "POST", registerRequest);
		expect(result).toEqual(authResponse);
	});
});

describe("loginUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApi.mockResolvedValue(authResponse);
	});

	it("calls the login API and returns the auth response", async () => {
		const result = await loginUser(registerRequest);

		expect(mockApi).toHaveBeenCalledWith("/users/login", "POST", registerRequest);
		expect(result).toEqual(authResponse);
	});
});

describe("createGuestUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApi.mockResolvedValue(authResponse);
	});

	it("calls the guest user API and returns the auth response", async () => {
		const result = await createGuestUser();

		expect(mockApi).toHaveBeenCalledWith("/users/guest", "POST");
		expect(result).toEqual(authResponse);
	});
});

describe("convertGuestAccount", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApi.mockResolvedValue(authResponse);
	});

	it("calls the convert API and returns the auth response", async () => {
		const result = await convertGuestAccount(registerRequest);

		expect(mockApi).toHaveBeenCalledWith("/users/convert", "POST", registerRequest);
		expect(result).toEqual(authResponse);
	});
});

describe("getUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApi.mockResolvedValue({ fetchedUser: user });
	});

	it("calls the user API and returns the fetched user", async () => {
		const result = await getUser();

		expect(mockApi).toHaveBeenCalledWith("/users/", "GET");
		expect(result).toEqual(user);
	});
});

describe("logoutUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApi.mockResolvedValue(undefined);
	});

	it("calls the logout API", async () => {
		const result = await logoutUser();

		expect(mockApi).toHaveBeenCalledWith("/users/logout", "POST");
		expect(result).toBeUndefined();
	});
});

describe("deleteUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApi.mockResolvedValue(undefined);
	});

	it("calls the delete user API", async () => {
		const result = await deleteUser();

		expect(mockApi).toHaveBeenCalledWith("/users", "DELETE");
		expect(result).toBeUndefined();
	});
});

describe("changePassword", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApi.mockResolvedValue(undefined);
	});

	it("calls the change password API", async () => {
		const result = await changePassword(changePasswordRequest);

		expect(mockApi).toHaveBeenCalledWith(
			"/users/change-password",
			"PATCH",
			changePasswordRequest,
		);
		expect(result).toBeUndefined();
	});
});