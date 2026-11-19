import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import LegalPage from "./LegalPage";
import { renderWithProviders } from "../../test/renderWithProviders";

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="path">{location.pathname}</span>;
};

const setup = (doc) =>
  renderWithProviders(
    <MemoryRouter initialEntries={[`/${doc}`]}>
      <LegalPage doc={doc} />
      <LocationProbe />
    </MemoryRouter>,
  );

describe("LegalPage", () => {
  it("renders the privacy sections", () => {
    const { container } = setup("privacy");
    expect(container.querySelector(".legal-page__title").textContent).toContain(
      "حریم خصوصی",
    );
    expect(container.querySelectorAll(".legal-page__section").length).toBe(6);
  });

  it("renders the terms sections", () => {
    const { container } = setup("terms");
    expect(container.querySelector(".legal-page__title").textContent).toContain(
      "شرایط استفاده",
    );
    expect(container.querySelectorAll(".legal-page__section").length).toBe(6);
  });

  it("links back to the landing page", () => {
    const { container } = setup("privacy");
    fireEvent.click(container.querySelector(".landing-nav__brand"));
    expect(screen.getByTestId("path").textContent).toBe("/");
  });
});
