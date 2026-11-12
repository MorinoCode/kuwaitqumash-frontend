import { describe, it, expect } from "vitest";
import KPIStats from "./KPIStats";
import { renderWithProviders } from "../../test/renderWithProviders";

const data = {
  revenue: 1234.5,
  profit: 200,
  meters_sold: 12.345,
  transactions: 7,
};

describe("KPIStats", () => {
  it("renders nothing without data", () => {
    const { container } = renderWithProviders(<KPIStats theme="dark" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders four KPI cards", () => {
    const { container } = renderWithProviders(<KPIStats data={data} theme="dark" />);
    expect(container.querySelectorAll(".kpi-card")).toHaveLength(4);
  });

  it("formats revenue with three decimals and the KWD unit", () => {
    const { container } = renderWithProviders(<KPIStats data={data} theme="dark" />);
    expect(container.textContent).toContain("1,234.500");
    expect(container.textContent).toContain("KWD");
  });

  it("shows meters with two decimals and the metre unit", () => {
    const { container } = renderWithProviders(<KPIStats data={data} theme="dark" />);
    expect(container.textContent).toContain("12.35");
    expect(container.querySelectorAll(".kpi-card__unit").length).toBeGreaterThan(0);
  });

  it("renders a positive change", () => {
    const { container } = renderWithProviders(
      <KPIStats data={data} changes={{ revenue: 4.25 }} theme="dark" />,
    );
    const change = container.querySelector(".kpi-card__change");
    expect(change).toHaveClass("is-positive");
    expect(change.textContent).toContain("4.3%");
  });

  it("renders a negative change", () => {
    const { container } = renderWithProviders(
      <KPIStats data={data} changes={{ revenue: -2 }} theme="dark" />,
    );
    expect(container.querySelector(".kpi-card__change")).toHaveClass("is-negative");
  });

  it("falls back to zero when a metric is missing", () => {
    const { container } = renderWithProviders(<KPIStats data={{}} theme="dark" />);
    expect(container.textContent).toContain("0");
  });
});
