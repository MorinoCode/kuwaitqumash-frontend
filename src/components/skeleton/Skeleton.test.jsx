import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Skeleton from "./Skeleton";

describe("Skeleton", () => {
  it("renders a decorative placeholder", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild;
    expect(el).toHaveClass("skeleton");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("applies width and height", () => {
    const { container } = render(<Skeleton width="120px" height="2rem" />);
    expect(container.firstChild.style.width).toBe("120px");
    expect(container.firstChild.style.height).toBe("2rem");
  });

  it("adds the circle modifier and extra classes", () => {
    const { container } = render(<Skeleton circle className="extra" />);
    expect(container.firstChild).toHaveClass("skeleton--circle");
    expect(container.firstChild).toHaveClass("extra");
  });
});
