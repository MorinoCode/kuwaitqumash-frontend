import { describe, it, expect } from "vitest";
import RevenueChart from "./RevenueChart";
import { renderWithProviders } from "../../test/renderWithProviders";

const data = [
  { date: "2026-01-01", revenue: "120.5", profit: "30", quantity: 2, meters: 5 },
  { date: "2026-01-02", revenue: "80", profit: "10", quantity: 1, meters: 2 },
];

const renderChart = (props = {}) =>
  renderWithProviders(<RevenueChart data={data} theme="dark" {...props} />);

describe("RevenueChart", () => {
  it("shows the empty state without data", () => {
    const { container } = renderWithProviders(<RevenueChart theme="dark" />);
    expect(container.querySelector(".no-data")).toBeInTheDocument();
  });

  it("shows the empty state for an empty array", () => {
    const { container } = renderWithProviders(<RevenueChart data={[]} theme="dark" />);
    expect(container.querySelector(".no-data")).toBeInTheDocument();
  });

  it("renders a titled chart container with the theme class", () => {
    const { container } = renderChart();
    expect(container.querySelector(".chart-container--dark")).toBeInTheDocument();
    expect(container.querySelector(".chart-title").textContent.length).toBeGreaterThan(0);
  });

  it("switches the title for the profit metric", () => {
    const { container } = renderChart({ metricType: "profit" });
    expect(container.querySelector(".chart-title").textContent.length).toBeGreaterThan(0);
  });

  it("accepts comparison data without crashing", () => {
    const { container } = renderChart({
      comparisonData: [{ revenue: 100, profit: 20 }, { revenue: 50, profit: 5 }],
    });
    expect(container.querySelector(".chart-container")).toBeInTheDocument();
  });
});
