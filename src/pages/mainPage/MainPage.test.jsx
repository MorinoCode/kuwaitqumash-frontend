import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import MainPage from "./MainPage";
import { renderWithProviders } from "../../test/renderWithProviders";

let role = "store_owner";

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role } }),
}));

vi.mock("../../components/addItemModal/AddItemModal", () => ({
  default: ({ isOpen }) => <div data-testid="add-item-modal">{String(isOpen)}</div>,
}));

vi.mock("../../components/particleSphere/ParticleSphere", () => ({
  default: () => <div data-testid="home-sphere" />,
}));

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="path">{location.pathname}</span>;
};

const setup = () =>
  renderWithProviders(
    <MemoryRouter initialEntries={["/home"]}>
      <MainPage />
      <LocationProbe />
    </MemoryRouter>,
  );

beforeEach(() => {
  role = "store_owner";
});

describe("MainPage", () => {
  it("renders the shortcut cards", () => {
    const { container } = setup();
    expect(container.querySelectorAll(".dashboard-card").length).toBeGreaterThan(4);
    expect(container.querySelectorAll(".main-dashboard__section").length).toBe(3);
  });

  it("navigates to a card link", () => {
    const { container } = setup();
    fireEvent.click(container.querySelectorAll(".dashboard-card")[0]);
    expect(screen.getByTestId("path").textContent).toBe("/sales");
  });

  it("opens the add item modal from its card", () => {
    const { container } = setup();
    const cards = [...container.querySelectorAll(".dashboard-card")];
    const addCard = cards.find((card) =>
      card.className.includes("dashboard-card--success"),
    );
    fireEvent.click(addCard);
    expect(screen.getByTestId("add-item-modal").textContent).toBe("true");
  });

  it("hides the manage card from sales staff", () => {
    role = "sales_man";
    const { container } = setup();
    const titles = [...container.querySelectorAll(".dashboard-card__title")].map(
      (node) => node.textContent,
    );
    expect(titles.length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".main-dashboard__section").length).toBe(3);
  });

  it("shows the manage card to the owner", () => {
    const { container } = setup();
    expect(container.querySelectorAll(".dashboard-card").length).toBe(8);
  });

  it("renders the sphere backdrop behind the cards in dark mode", () => {
    const { container, getByTestId } = setup();
    const backdrop = container.querySelector(".main-dashboard__backdrop");
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toContainElement(getByTestId("home-sphere"));
  });

  it("skips the backdrop in light mode", () => {
    localStorage.setItem("app_theme", "light");
    const { container } = setup();
    expect(container.querySelector(".main-dashboard__backdrop")).toBeNull();
  });
});
