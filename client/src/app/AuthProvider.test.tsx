import React from "react";
import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthProvider";
import { AppRouter } from "./router";

const { mockUseGetUser } = vi.hoisted(() => ({
   mockUseGetUser: vi.fn(),
}));

vi.mock("../features/auth/useAuth", () => ({
   useGetUser: mockUseGetUser,
}));

vi.mock("../components/LoadingScreen", () => ({
   default: ({ text }: { text: string }) => <div>{text}</div>,
}));

vi.mock("../pages/WelcomePage", () => ({
   default: () => <div>Welcome Page</div>,
}));

vi.mock("../pages/HomePage", () => ({
   default: () => <div>Home Page</div>,
}));

vi.mock("../pages/NotFoundPage", () => ({
   default: () => <div>Not Found Page</div>,
}));

vi.mock("../features/auth/RegisterPage", () => ({
   default: () => <div>Register Page</div>,
}));

vi.mock("../features/auth/LoginPage", () => ({
   default: () => <div>Login Page</div>,
}));

vi.mock("../features/analytics/AnalyticsPage", () => ({
   default: () => <div>Analytics Page</div>,
}));

vi.mock("../features/auth/changePassword/ChangePasswordPage", () => ({
   default: () => <div>Change Password Page</div>,
}));

const user = {
   id: 1,
   email: "user@example.com",
   account_type: "user",
};

function TestConsumer() {
   const context = React.useContext(AuthContext);

   return (
      <div>
         <div data-testid="user">
            {context?.user?.email ?? "No user"}
         </div>
         <div data-testid="loading">
            {String(context?.isLoading)}
         </div>
      </div>
   );
};

describe("AuthProvider", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("shows the loading screen while the user is loading", () => {
      mockUseGetUser.mockReturnValue({
         data: undefined,
         isLoading: true,
      });

      render(
         <AuthProvider>
            <div>Protected content</div>
         </AuthProvider>
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
   });

   it("provides the user and loading state through AuthContext", () => {
      mockUseGetUser.mockReturnValue({
         data: user,
         isLoading: false,
      });

      render(
         <AuthProvider>
            <TestConsumer />
         </AuthProvider>
      );

      expect(screen.getByTestId("user")).toHaveTextContent("user@example.com");
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
   });

   it.each([
      ["/analytics", "Analytics Page"],
      ["/change-password", "Change Password Page"],
   ])("keeps an authenticated deep link at %s after initialization", (path, page) => {
      mockUseGetUser.mockReturnValue({
         data: undefined,
         isLoading: true,
      });

      const { rerender } = render(
         <MemoryRouter initialEntries={[path]}>
            <AuthProvider>
               <AppRouter />
            </AuthProvider>
         </MemoryRouter>
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText(page)).not.toBeInTheDocument();

      mockUseGetUser.mockReturnValue({
         data: user,
         isLoading: false,
      });

      rerender(
         <MemoryRouter initialEntries={[path]}>
            <AuthProvider>
               <AppRouter />
            </AuthProvider>
         </MemoryRouter>
      );

      expect(screen.getByText(page)).toBeInTheDocument();
      expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
   });

   it("finishes initialization after an unauthenticated user request fails", () => {
      mockUseGetUser.mockReturnValue({
         data: undefined,
         isLoading: true,
      });

      const { rerender } = render(
         <MemoryRouter initialEntries={["/analytics"]}>
            <AuthProvider>
               <AppRouter />
            </AuthProvider>
         </MemoryRouter>
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();

      mockUseGetUser.mockReturnValue({
         data: undefined,
         isLoading: false,
         error: new Error("401 Unauthorized"),
      });

      rerender(
         <MemoryRouter initialEntries={["/analytics"]}>
            <AuthProvider>
               <AppRouter />
            </AuthProvider>
         </MemoryRouter>
      );

      expect(screen.getByText("Welcome Page")).toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
   });

   it("keeps the analytics route available to an authenticated guest", () => {
      mockUseGetUser.mockReturnValue({
         data: undefined,
         isLoading: true,
      });

      const { rerender } = render(
         <MemoryRouter initialEntries={["/analytics"]}>
            <AuthProvider>
               <AppRouter />
            </AuthProvider>
         </MemoryRouter>
      );

      mockUseGetUser.mockReturnValue({
         data: { id: 2, email: null, account_type: "guest" },
         isLoading: false,
      });

      rerender(
         <MemoryRouter initialEntries={["/analytics"]}>
            <AuthProvider>
               <AppRouter />
            </AuthProvider>
         </MemoryRouter>
      );

      expect(screen.getByText("Analytics Page")).toBeInTheDocument();
      expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
   });
});