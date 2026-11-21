import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import i18n from "../../../i18n";
import MainLayout from "./MainLayout";
import { renderWithProviders } from "../../../test/renderWithProviders";

const logout = vi.fn();

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({ logout, user: { id: 1 } }),
}));

vi.mock("../../sidebar/Sidebar", () => ({
  default: ({ closeSidebar }) => (
    <div data-testid="sidebar">
      <button type="button" onClick={closeSidebar}>
        close-sidebar
      </button>
    </div>
  ),
}));

const setup = () =>
  renderWithProviders(
    <MemoryRouter initialEntries={["/home"]}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<div data-testid="page">home page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  document.body.className = "";
});

describe("MainLayout", () => {
  it("renders the sidebar and the routed page", () => {
    setup();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("page")).toBeInTheDocument();
  });

  it("opens and closes the mobile sidebar", () => {
    const { container } = setup();
    const overlay = container.querySelector(".sidebar-overlay");
    const wrapper = container.querySelector(".layout-sidebar");

    fireEvent.click(container.querySelector(".hamburger-btn"));
    expect(wrapper.className).toContain("open");
    expect(overlay.className).toContain("active");

    fireEvent.click(screen.getByText("close-sidebar"));
    expect(container.querySelector(".layout-sidebar").className).not.toContain("open");
  });

  it("closes the sidebar from the overlay", () => {
    const { container } = setup();
    fireEvent.click(container.querySelector(".hamburger-btn"));
    fireEvent.click(container.querySelector(".sidebar-overlay"));
    expect(container.querySelector(".layout-sidebar").className).not.toContain("open");
  });

  it("opens the language menu and switches language", async () => {
    const { container } = setup();
    const langButton = container.querySelector(".lang-menu .header-btn");
    fireEvent.click(langButton);
    expect(container.querySelector(".lang-menu__list")).toBeInTheDocument();

    const english = [...container.querySelectorAll(".lang-menu__item")].find((item) =>
      item.textContent.includes("English"),
    );
    fireEvent.click(english);

    await waitFor(() => expect(i18n.language).toBe("en"));
    expect(document.body.classList.contains("font-english")).toBe(true);
    expect(container.querySelector(".lang-menu__list")).toBeNull();

    await act(async () => {
      await i18n.changeLanguage("fa");
    });
  });

  it("closes the language menu with Escape", () => {
    const { container } = setup();
    fireEvent.click(container.querySelector(".lang-menu .header-btn"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(container.querySelector(".lang-menu__list")).toBeNull();
  });

  it("toggles the theme", () => {
    const { container } = setup();
    const themeButton = container.querySelectorAll(".main-header__right .header-btn")[2];
    const before = container.querySelector(".main-layout").className;
    fireEvent.click(themeButton);
    expect(container.querySelector(".main-layout").className).not.toBe(before);
  });

  it("logs out from the header", () => {
    const { container } = setup();
    fireEvent.click(container.querySelector(".header-btn--logout"));
    expect(logout).toHaveBeenCalled();
  });

  it("opens and closes the help assistant", async () => {
    const { container } = setup();
    const helpButton = container.querySelector(".header-btn--help");

    fireEvent.click(helpButton);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    fireEvent.click(helpButton);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
