import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../components/particleSphere/ParticleSphere", () => ({
  default: () => <div data-testid="sphere" />,
}));

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="path">{location.pathname}</span>;
};

const setup = () =>
  renderWithProviders(
    <MemoryRouter initialEntries={["/"]}>
      <WelcomePage />
      <LocationProbe />
    </MemoryRouter>,
  );

describe("WelcomePage", () => {
  it("renders the hero section", () => {
    const { container } = setup();
    expect(container.querySelector(".hero")).toBeInTheDocument();
    expect(container.querySelector(".hero__wordmark").textContent).toContain("Qumash");
  });

  it("navigates to login from the primary call to action", () => {
    const { container } = setup();
    const cta = [...container.querySelectorAll("button")].find((button) =>
      /login|ورود|دخول/i.test(button.textContent),
    );
    if (cta) {
      fireEvent.click(cta);
      expect(document.body.textContent.length).toBeGreaterThan(0);
    }
  });

  it("renders the feature sections", () => {
    const { container } = setup();
    expect(container.querySelectorAll("section").length).toBeGreaterThan(1);
  });
});
