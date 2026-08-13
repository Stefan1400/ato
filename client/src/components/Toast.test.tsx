import { expect, describe, it, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useToast, ToastProvider } from "./Toast";

afterEach(() => {
   vi.useRealTimers();
});

function TestComponent() {
   const { showToast } = useToast();

   return (
      <>
         <button 
            onClick={() => {
               showToast({ type: "success", message: "Logged in successfully", duration: 3000 })
         }}>
            Show Toast
         </button>
         
         <button 
            onClick={() => {
               showToast({ type: "error", message: "Login failed. Please try again.", duration: 3000 })
         }}>
            Show Error Toast
         </button>

         <button 
            onClick={() => {
               showToast({ type: "info", message: "This is an info message.", duration: 3000 })
         }}>
            Show Info Toast
         </button>
      </>
   )
}

describe("Toast", () => {
   it("renders a success toast", async () => {
      render(
         <ToastProvider>
            <TestComponent />
         </ToastProvider> 
      )

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /show toast/i }));

      expect(
         screen.getByText('Logged in successfully')
      ).toBeInTheDocument();
   });

   it("renders an error toast", async () => {
      
      render(
         <ToastProvider>
            <TestComponent />
         </ToastProvider> 
      );

      const user = userEvent.setup();

      const showToastButton = screen.getByRole('button', { name: /show error toast/i });

      await user.click(showToastButton);

      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
   });

   it("renders an info toast", async () => {
      
      render(
         <ToastProvider>
            <TestComponent />
         </ToastProvider> 
      );

      const user = userEvent.setup();

      const showToastButton = screen.getByRole('button', { name: /show info toast/i });

      await user.click(showToastButton);

      expect(screen.getByText('This is an info message.')).toBeInTheDocument();
   });

   it("shows multiple toasts", async () => {
      
      render(
         <ToastProvider>
            <TestComponent />
         </ToastProvider> 
      );

      const user = userEvent.setup();

      const showToastButton = screen.getByRole('button', { name: /show toast/i });

      await user.click(showToastButton);
      await user.click(showToastButton);
      await user.click(showToastButton);

      expect(screen.getAllByText('Logged in successfully')).toHaveLength(3);
   });

   it("removes toast after user clicks close button", async () => {
      render(
         <ToastProvider>
            <TestComponent />
         </ToastProvider> 
      )

      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /show toast/i }));

      expect(
         screen.getByText('Logged in successfully')
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /close toast/i }));

      expect(
         screen.queryByText('Logged in successfully')
      ).not.toBeInTheDocument();
   });

   it("removes toast automatically after 3 seconds", () => {
      vi.useFakeTimers();
      
      render(
         <ToastProvider>
            <TestComponent />
         </ToastProvider> 
      );

      fireEvent.click(
         screen.getByRole('button', { name: /show toast/i })
      );

      expect(
         screen.getByText('Logged in successfully')
      ).toBeInTheDocument();

      act(() => {
         vi.advanceTimersByTime(3000);
      });

      expect(
         screen.queryByText('Logged in successfully')
      ).not.toBeInTheDocument();
   });
})