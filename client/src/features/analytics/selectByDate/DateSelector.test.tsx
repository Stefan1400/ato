import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import DateSelector, { isSameDay } from "./DateSelector";

describe("DateSelector", () => {
	it("shows the selected month and date", () => {
		render(
			<DateSelector
				selectedDate={new Date(2026, 9, 3)}
				onSelect={vi.fn()}
				onClose={vi.fn()}
			/>
		);

		expect(screen.getByText("October 2026")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "3" })).toHaveClass("bg-white");
	});

	it("navigates between months across a year boundary", async () => {
		const user = userEvent.setup();

		render(
			<DateSelector
				selectedDate={new Date(2026, 0, 15)}
				onSelect={vi.fn()}
				onClose={vi.fn()}
			/>
		);

		await user.click(screen.getByRole("button", { name: "Go To Previous Month" }));
		expect(screen.getByText("December 2025")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Go To Next Month" }));
		expect(screen.getByText("January 2026")).toBeInTheDocument();
	});

	it("selects a date from the displayed month", async () => {
		const onSelect = vi.fn();
		const user = userEvent.setup();

		render(
			<DateSelector
				selectedDate={new Date(2026, 9, 3)}
				onSelect={onSelect}
				onClose={vi.fn()}
			/>
		);

		await user.click(screen.getByRole("button", { name: "12" }));

		expect(onSelect).toHaveBeenCalledWith(new Date(2026, 9, 12));
	});

	it("closes when the backdrop is clicked", async () => {
		const onClose = vi.fn();
		const user = userEvent.setup();

		render(
         <DateSelector
            selectedDate={new Date(2026, 9, 3)}
            onSelect={vi.fn()}
            onClose={onClose}
         />
		);

		await user.click(screen.getByTestId("backdrop"));

		expect(onClose).toHaveBeenCalledOnce();
	});

	it("closes when the close button is clicked", async () => {
		const onClose = vi.fn();
		const user = userEvent.setup();

		render(
			<DateSelector
				selectedDate={new Date(2026, 9, 3)}
				onSelect={vi.fn()}
				onClose={onClose}
			/>
		);

		await user.click(screen.getByRole("button", { name: "Close" }));

		expect(onClose).toHaveBeenCalledOnce();
	});

	it("updates the displayed month when selectedDate changes", () => {
		const { rerender } = render(
			<DateSelector
				selectedDate={new Date(2026, 9, 3)}
				onSelect={vi.fn()}
				onClose={vi.fn()}
			/>
		);

		rerender(
			<DateSelector
				selectedDate={new Date(2027, 1, 14)}
				onSelect={vi.fn()}
				onClose={vi.fn()}
			/>
		);

		expect(screen.getByText("February 2027")).toBeInTheDocument();
	});
});

describe("isSameDay", () => {
	it("returns true for dates on the same calendar day", () => {
		expect(isSameDay(new Date(2026, 9, 3, 8), new Date(2026, 9, 3, 20))).toBe(true);
	});

	it("returns false when the dates fall on different days", () => {
		expect(isSameDay(new Date(2026, 9, 3), new Date(2026, 9, 4))).toBe(false);
	});
});