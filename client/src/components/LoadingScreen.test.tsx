import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingScreen from "./LoadingScreen";

describe("LoadingScreen", () => {
   it("renders the loading screen with the provided text", () => {
      render(<LoadingScreen text="Loading..." />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
   });
});