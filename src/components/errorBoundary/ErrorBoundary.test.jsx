import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const Boom = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error("kaboom");
  return <div>safe</div>;
};

let consoleError;

beforeEach(() => {
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => consoleError.mockRestore());

describe("ErrorBoundary", () => {
  it("renders children while nothing fails", () => {
    render(
      <ErrorBoundary>
        <Boom shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText("safe")).toBeInTheDocument();
  });

  it("shows the default fallback when a child throws", () => {
    render(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
  });

  it("calls onError with the thrown error", () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].message).toBe("kaboom");
  });

  it("renders a custom fallback element", () => {
    render(
      <ErrorBoundary fallback={<p>custom fallback</p>}>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText("custom fallback")).toBeInTheDocument();
  });

  it("renders a custom fallback function with reset", () => {
    const fallback = vi.fn(({ error }) => <p>received {error.message}</p>);
    render(
      <ErrorBoundary fallback={fallback}>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText("received kaboom")).toBeInTheDocument();
  });

  it("clears the error when resetKeys change", () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={[1]}>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();

    rerender(
      <ErrorBoundary resetKeys={[2]}>
        <Boom shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("safe")).toBeInTheDocument();
  });
});
