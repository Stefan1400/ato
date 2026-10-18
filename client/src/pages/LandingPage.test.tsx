import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import LandingPage from "./LandingPage";

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="location">{location.pathname}</div>;
}

describe("LandingPage", () => {
  it("navigates to /get-started from the Get Started CTA", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
        <LocationDisplay />
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Get Started" }));

    expect(screen.getByTestId("location")).toHaveTextContent("/get-started");
  });
});
