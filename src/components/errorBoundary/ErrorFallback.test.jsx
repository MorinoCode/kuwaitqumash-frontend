import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ErrorFallback from "./ErrorFallback";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("ErrorFallback", () => {
  it("shows an alert with a retry button", () => {
    const { container } = renderWithProviders(
      <ErrorFallback error={new Error("boom")} resetErrorBoundary={vi.fn()} />,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(container.querySelector(".error-fallback__btn--primary")).toBeInTheDocument();
  });

  it("calls resetErrorBoundary when retrying", () => {
    const reset = vi.fn();
    const { container } = renderWithProviders(
      <ErrorFallback error={new Error("x")} resetErrorBoundary={reset} />,
    );
    fireEvent.click(container.querySelector(".error-fallback__btn--primary"));
    expect(reset).toHaveBeenCalled();
  });

  it("reveals the stack trace on demand", () => {
    renderWithProviders(
      <ErrorFallback error={new Error("stack-me")} resetErrorBoundary={vi.fn()} />,
    );
    fireEvent.click(screen.getByText(/جزئیات|show details/i));
    expect(screen.getByText(/stack-me/)).toBeInTheDocument();
  });

  it("does not show a details toggle without an error", () => {
    const { container } = renderWithProviders(<ErrorFallback resetErrorBoundary={vi.fn()} />);
    expect(container.querySelector(".error-fallback__details")).toBeNull();
  });
});
