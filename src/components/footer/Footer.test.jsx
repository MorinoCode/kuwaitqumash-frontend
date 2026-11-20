import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";
import { renderWithProviders } from "../../test/renderWithProviders";

const setup = () =>
  renderWithProviders(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

describe("Footer", () => {
  it("links the legal and contact pages", () => {
    const { container } = setup();
    const hrefs = [...container.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toContain("/contact");
    expect(hrefs).toContain("/privacy");
    expect(hrefs).toContain("/terms");
  });

  it("no longer offers careers", () => {
    const { container } = setup();
    expect(container.textContent).not.toContain("فرصت‌های شغلی");
    expect(container.querySelector('a[href="#careers"]')).toBeNull();
  });

  it("shows the brand and copyright", () => {
    const { container } = setup();
    expect(container.querySelector(".footer-copyright").textContent).toContain(
      "Qummash",
    );
  });
});
