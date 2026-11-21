import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import { renderWithProviders } from "../../test/renderWithProviders";

const renderNavbar = (initialRoute = "/") =>
  renderWithProviders(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="*" element={<PublicNavbar />} />
      </Routes>
    </MemoryRouter>,
  );

describe("PublicNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the brand logo and links", () => {
    const { container } = renderNavbar("/");
    const logoImg = container.querySelector(".landing-nav__logo-img");
    expect(logoImg).toBeInTheDocument();

    const links = container.querySelector(".landing-nav__links");
    expect(links).toBeInTheDocument();
    expect(links.querySelectorAll("button").length).toBe(6);
  });

  it("renders the action buttons: theme, language, login and cta", () => {
    const { container } = renderNavbar("/");
    expect(container.querySelector(".landing-nav__theme-btn")).toBeInTheDocument();
    expect(container.querySelector(".landing-nav__lang")).toBeInTheDocument();
    expect(container.querySelector(".landing-nav__login")).toBeInTheDocument();
    expect(container.querySelector(".landing-nav__cta")).toBeInTheDocument();
  });

  it("opens and closes the language dropdown menu", () => {
    const { container } = renderNavbar("/");
    const langBtn = container.querySelector(".landing-nav__lang");

    expect(container.querySelectorAll('[role="menuitemradio"]').length).toBe(0);

    fireEvent.click(langBtn);
    expect(container.querySelectorAll('[role="menuitemradio"]').length).toBe(3);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(container.querySelectorAll('[role="menuitemradio"]').length).toBe(0);
  });

  it("changes language when an option is selected", () => {
    const { container } = renderNavbar("/");
    fireEvent.click(container.querySelector(".landing-nav__lang"));

    const options = container.querySelectorAll('[role="menuitemradio"]');
    expect(options.length).toBe(3);

    fireEvent.click(options[0]);
    expect(container.querySelectorAll('[role="menuitemradio"]').length).toBe(0);
  });

  it("shows primary CTA on login page and hides it on /contact", () => {
    const { container: loginContainer } = renderNavbar("/login");
    expect(loginContainer.querySelector(".landing-nav__cta")).toBeInTheDocument();
    expect(loginContainer.querySelector(".landing-nav__login")).not.toBeInTheDocument();

    const { container: targetContainer } = renderNavbar("/contact");
    expect(targetContainer.querySelector(".landing-nav__login")).toBeInTheDocument();
    expect(targetContainer.querySelector(".landing-nav__cta")).not.toBeInTheDocument();
  });
});
