import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LegalPage from "./LegalPage";
import { renderWithProviders } from "../../test/renderWithProviders";

const setup = (doc) =>
  renderWithProviders(
    <MemoryRouter>
      <LegalPage doc={doc} />
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
    expect(container.querySelector(".legal-page__back").getAttribute("href")).toBe(
      "/",
    );
  });
});
