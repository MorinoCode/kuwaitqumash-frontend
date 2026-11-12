import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

const Consumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = "";
  });

  it("defaults to the dark theme", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button").textContent).toBe("dark");
    expect(document.body).toHaveClass("dark");
  });

  it("restores the stored theme", () => {
    localStorage.setItem("app_theme", "light");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(screen.getByRole("button").textContent).toBe("light");
    expect(document.body).toHaveClass("light");
    expect(document.body).not.toHaveClass("dark");
  });

  it("toggles and persists the theme", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("light");
    expect(localStorage.getItem("app_theme")).toBe("light");
    expect(document.body).toHaveClass("light");
  });

  it("returns undefined outside the provider", () => {
    const Probe = () => <span>{String(useTheme())}</span>;
    render(<Probe />);
    expect(screen.getByText("undefined")).toBeInTheDocument();
  });
});
