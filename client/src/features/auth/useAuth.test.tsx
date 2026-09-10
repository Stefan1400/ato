import { expect, describe, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "../../app/AuthProvider";
import {
  useRegister,
  useGetUser,
  useLogin,
  useCreateGuest,
  useConvertGuest,
  useLogout,
  useDeleteUser,
  useChangePassword,
} from "./useAuth";

const {
  mockRegisterUser,
  mockGetUser,
  mockLoginUser,
  mockCreateGuestUser,
  mockConvertGuestAccount,
  mockLogoutUser,
  mockDeleteUser,
  mockChangePassword,
  mockSetUser,
} = vi.hoisted(() => ({
  mockRegisterUser: vi.fn(),
  mockGetUser: vi.fn(),
  mockLoginUser: vi.fn(),
  mockCreateGuestUser: vi.fn(),
  mockConvertGuestAccount: vi.fn(),
  mockLogoutUser: vi.fn(),
  mockDeleteUser: vi.fn(),
  mockChangePassword: vi.fn(),
  mockSetUser: vi.fn(),
}));

vi.mock("./auth.api", () => ({
  registerUser: mockRegisterUser,
  getUser: mockGetUser,
  loginUser: mockLoginUser,
  createGuestUser: mockCreateGuestUser,
  convertGuestAccount: mockConvertGuestAccount,
  logoutUser: mockLogoutUser,
  deleteUser: mockDeleteUser,
  changePassword: mockChangePassword,
}));

let queryClient: QueryClient;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
   <AuthContext.Provider 
      value={{ 
         user: undefined, 
         isLoading: false,
         setUser: mockSetUser
      }}>
      {children}
   </AuthContext.Provider>
  </QueryClientProvider>
);

describe("useRegister", () => {
   const registerRequest = {
      email: "newuser@gmail.com",
      password: "password123",
   };

   beforeEach(() => {
      vi.clearAllMocks();
      queryClient = new QueryClient();

      mockRegisterUser.mockResolvedValue(registerRequest);
   });

   it("calls the registerUser API", async () => {
      const { result } = renderHook(() => useRegister(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate(registerRequest);
      });

      await waitFor(() => {
         expect(mockRegisterUser).toHaveBeenCalledWith(
         registerRequest,
         expect.anything()
         );
      });
   });
});

describe("useLogin", () => {
   const loggedInUser = {
      user: {
         id: 1,
         email: "user@gmail.com",
         account_type: "user",
      },
      token: "kjhsidf872y1hkubkfsdubsdfsd",
   };

   const loginRequest = {
      email: "newuser@gmail.com",
      password: "password123",
   };

   beforeEach(() => {
      vi.clearAllMocks();
      queryClient = new QueryClient();

      mockLoginUser.mockResolvedValue(loggedInUser);
   });

   it("calls the loginUser API", async () => {
      const { result } = renderHook(() => useLogin(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate(loginRequest);
      });

      await waitFor(() => {
         expect(mockLoginUser).toHaveBeenCalledWith(
         loginRequest,
         expect.anything()
         );
      });
   });
});

describe("useCreateGuest", () => {
   const guestUser = {
      user: {
         id: 2,
         email: null,
         account_type: "guest",
      },
      token: "guest-token",
   };

   beforeEach(() => {
      vi.clearAllMocks();
      
      queryClient = new QueryClient();

      mockCreateGuestUser.mockResolvedValue(guestUser);
   });

   it("calls the createGuestUser API", async () => {
      const { result } = renderHook(() => useCreateGuest(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate();
      });

      await waitFor(() => {
         expect(mockCreateGuestUser).toHaveBeenCalled()
      });
   });
});

describe("useConvertGuest", () => {
   const convertRequest = {
      email: "newuser@gmail.com",
      password: "password123",
   };

   const convertedUser = {
      user: convertRequest,
      token: "converted-token",
   };

   beforeEach(() => {
      vi.clearAllMocks();
      
      queryClient = new QueryClient();

      mockConvertGuestAccount.mockResolvedValue(convertedUser);
   });

   it("calls the convertGuestAccount API", async () => {
      const { result } = renderHook(() => useConvertGuest(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate(convertRequest);
      });

      await waitFor(() => {
         expect(mockConvertGuestAccount).toHaveBeenCalledWith(
         convertRequest,
         expect.anything()
         );
      });
   });
});

describe("useGetUser", () => {
   const fetchedUser = {
      id: 1,
      email: "user@gmail.com",
      account_type: "user",
   };

   beforeEach(() => {
      vi.clearAllMocks();
      queryClient = new QueryClient();

      mockGetUser.mockResolvedValue(fetchedUser);
   });

   it("calls the getUser API", async () => {
      renderHook(() => useGetUser(), {
         wrapper,
      });

      await waitFor(() => {
         expect(mockGetUser).toHaveBeenCalled();
      });
   });
});

describe("useLogout", () => {
   beforeEach(() => {
      vi.clearAllMocks();
      
      queryClient = new QueryClient();

      mockLogoutUser.mockResolvedValue(undefined);
   });

   it("calls the logoutUser API", async () => {
      const { result } = renderHook(() => useLogout(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate();
      });

      await waitFor(() => {
         expect(mockLogoutUser).toHaveBeenCalled();
      });
   });

   it("clears the user after successful logout", async () => {
      const { result } = renderHook(() => useLogout(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate();
      });

      await waitFor(() => {
         expect(mockSetUser).toHaveBeenCalledWith(undefined);
      });
   });

   it("removes all queries after successful logout", async () => {
      const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");

      const { result } = renderHook(() => useLogout(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate();
      });

      await waitFor(() => {
         expect(removeQueriesSpy).toHaveBeenCalled();
      });
   });
});

describe("useDeleteUser", () => {
   beforeEach(() => {
      vi.clearAllMocks();
      
      queryClient = new QueryClient();

      mockDeleteUser.mockResolvedValue(undefined);
   });

   it("calls the deleteUser API", async () => {
      const { result } = renderHook(() => useDeleteUser(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate();
      });

      await waitFor(() => {
         expect(mockDeleteUser).toHaveBeenCalled();
      });
   });

   it("clears the user after successful deletion", async () => {
      const { result } = renderHook(() => useDeleteUser(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate();
      });

      await waitFor(() => {
         expect(mockSetUser).toHaveBeenCalledWith(undefined);
      });
   });

   it("invalidates the user query after successful deletion", async () => {
      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteUser(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate();
      });

      await waitFor(() => {
         expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ["user"],
         });
      });
   });
});

describe("useChangePassword", () => {
   const changePasswordRequest = {
      current_password: "oldpassword",
      new_password: "newpassword123",
   };

   beforeEach(() => {
      vi.clearAllMocks();

      queryClient = new QueryClient();

      mockChangePassword.mockResolvedValue(undefined);
   });

   it("calls the changePassword API", async () => {
      const { result } = renderHook(() => useChangePassword(), {
         wrapper,
      });

      await act(async () => {
         result.current.mutate(changePasswordRequest);
      });

      await waitFor(() => {
         expect(mockChangePassword).toHaveBeenCalledWith(
            changePasswordRequest,
            expect.anything()
         );
      });
   });
});