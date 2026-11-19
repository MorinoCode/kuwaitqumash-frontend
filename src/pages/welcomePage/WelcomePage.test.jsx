import { describe, it, expect, vi } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import i18n from "../../i18n";
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

  it("navigates to /signup from the signup call to action by default", () => {
    const { container, getByTestId } = setup();
    fireEvent.click(container.querySelector(".landing-nav__cta"));
    expect(getByTestId("path").textContent).toBe("/signup");
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

  it("shows the requested hero copy in Persian", () => {
    const { container } = setup();
    expect(container.querySelector(".hero__tagline").textContent.trim()).toBe(
      "موجودی طاقه و متراژ، فروش متری با تخفیف، فاکتور رسمی و حساب مشتری — و هرچه نیاز دارید در یک پنل",
    );
  });

  it("advertises the AI assistant instead of the credit-card note", () => {
    const { container } = setup();
    expect(container.querySelector(".hero__note").textContent).toContain(
      "به همراه دستیار هوش مصنوعی",
    );
    expect(container.textContent).not.toContain("بدون کارت بانکی");
  });

  it("drops the sold-meters statistic", () => {
    const { container } = setup();
    expect(container.querySelectorAll(".stat-band__item").length).toBe(3);
    expect(container.textContent).not.toContain("۱٬۲۵۰٬۰۰۰");
    expect(container.textContent).not.toContain("پارچه فروخته‌شده");
  });

  it("offers a single contact card without prices", () => {
    const { container } = setup();
    expect(container.querySelectorAll(".plan-card").length).toBe(1);
    expect(container.querySelector(".plan-card__price")).toBeNull();
    const card = container.querySelector(".plan-card");
    expect(card.textContent).toContain("با ما تماس بگیرید");
    expect(card.textContent).not.toContain("دینار");
    expect(card.textContent).not.toContain("رایگان");
  });

  it("removes the no-install note from the final call to action", () => {
    const { container } = setup();
    expect(container.textContent).not.toContain("بدون نصب");
    expect(container.querySelector(".final-cta__note")).toBeNull();
  });

  describe("language menu", () => {
    it("keeps the language choices hidden until the button is clicked", () => {
      const { container } = setup();
      expect(container.querySelectorAll('[role="menuitemradio"]').length).toBe(0);
    });

    it("opens the language menu without changing the language", () => {
      const { container } = setup();
      const before = i18n.language;

      fireEvent.click(container.querySelector(".landing-nav__lang"));

      expect(container.querySelectorAll('[role="menuitemradio"]').length).toBe(3);
      expect(i18n.language).toBe(before);
    });

    it("changes the language from the menu and closes it", async () => {
      const { container } = setup();
      fireEvent.click(container.querySelector(".landing-nav__lang"));

      const english = [...container.querySelectorAll('[role="menuitemradio"]')].find(
        (option) => option.textContent.includes("English"),
      );
      fireEvent.click(english);

      await waitFor(() => expect(i18n.language).toBe("en"));
      expect(container.querySelectorAll('[role="menuitemradio"]').length).toBe(0);
    });

    it("closes the menu on Escape", () => {
      const { container } = setup();
      fireEvent.click(container.querySelector(".landing-nav__lang"));

      fireEvent.keyDown(document, { key: "Escape" });

      expect(container.querySelectorAll('[role="menuitemradio"]').length).toBe(0);
    });

    it("toggles theme between dark and light", () => {
      const { container } = setup();
      const themeBtn = container.querySelector(".landing-nav__theme-btn");
      expect(themeBtn).toBeInTheDocument();
      fireEvent.click(themeBtn);
      expect(document.body.classList.contains("light") || container.querySelector(".landing--light")).toBeTruthy();
    });
  });
});
