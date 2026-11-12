import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import ParticleSphere from "./ParticleSphere";

const makeContext = () => ({
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  createRadialGradient: () => ({ addColorStop: vi.fn() }),
  fillStyle: "",
  globalAlpha: 1,
});

let originalGetContext;

beforeEach(() => {
  originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = vi.fn(() => makeContext());
  window.requestAnimationFrame = vi.fn(() => 1);
  window.cancelAnimationFrame = vi.fn();
});

afterEach(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext;
});

describe("ParticleSphere", () => {
  it("renders a decorative canvas", () => {
    const { container } = render(<ParticleSphere />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas.className).toContain("particle-sphere");
  });

  it("keeps extra class names", () => {
    const { container } = render(<ParticleSphere className="hero" />);
    expect(container.querySelector("canvas").className).toContain("hero");
  });

  it("draws on the canvas when a context is available", () => {
    const { container } = render(<ParticleSphere />);
    expect(container.querySelector("canvas").width).toBeGreaterThanOrEqual(0);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();
  });

  it("cleans up its listeners on unmount", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ParticleSphere />);
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("does nothing when the canvas context is unavailable", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
    const { container } = render(<ParticleSphere />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
