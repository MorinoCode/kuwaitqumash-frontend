import { describe, it, expect } from "vitest";
import Footer from "./Footer";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("Footer", () => {
  it("renders the brand logo", () => {
    const { getByAltText } = renderWithProviders(<Footer />);
    expect(getByAltText("KuwaitQumash")).toBeInTheDocument();
  });

  it("shows the current year in the copyright line", () => {
    const { container } = renderWithProviders(<Footer />);
    expect(container.textContent).toContain(String(new Date().getFullYear()));
  });

  it("links to the pricing and privacy sections", () => {
    const { container } = renderWithProviders(<Footer />);
    const anchors = [...container.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(anchors).toContain("#pricing");
    expect(anchors).toContain("#privacy");
  });
});
