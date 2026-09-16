import React from "react";
import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider, AuthContext } from "./AuthProvider";

const { mockUseGetUser } = vi.hoisted(() => ({
   mockUseGetUser: vi.fn(),
}));

vi.mock("../features/auth/useAuth", () => ({
   useGetUser: mockUseGetUser,
}));

vi.mock("../components/LoadingScreen", () => ({
   default: ({ text }: { text: string }) => <div>{text}</div>,
}));

const user = {
   id: 1,
   email: "user@example.com",
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
});