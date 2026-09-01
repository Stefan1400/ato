import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ViewByDate from "./ViewByDate";

describe("ViewByDate", () => {
   it("calls onOpen when clicked", async () => {

      const onOpen = vi.fn();

      render(<ViewByDate onOpen={onOpen} />);

      const user = userEvent.setup();

      await user.click(
         screen.getByRole("button", { name: /view by date/i })
      );

      expect(onOpen).toHaveBeenCalled();
   });
});