import { describe, it, expect } from "vitest";
import FabricTypeChart from "./FabricTypeChart";
import { renderWithProviders } from "../../test/renderWithProviders";

const data = [
  { fabric_type: "Silk", revenue: "400", quantity: 3 },
  { fabric_type: "Cotton", revenue: "600", quantity: 9 },
];

describe("FabricTypeChart", () => {
  it("shows the empty state without data", () => {
    const { container } = renderWithProviders(
      <FabricTypeChart theme="dark" metricType="revenue" />,
    );
    expect(container.querySelector(".no-data")).toBeInTheDocument();
  });

  it("renders a titled chart with the theme class", () => {
    const { container } = renderWithProviders(
      <FabricTypeChart data={data} theme="light" metricType="revenue" />,
    );
    expect(container.querySelector(".chart-title").textContent.length).toBeGreaterThan(0);
    expect(container.querySelector(".chart-container--light")).toBeInTheDocument();
  });

  it("renders the profit and quantity titles", () => {
    const profit = renderWithProviders(
      <FabricTypeChart data={data} theme="dark" metricType="profit" />,
    );
    const quantity = renderWithProviders(
      <FabricTypeChart data={data} theme="dark" metricType="revenue" viewType="quantity" />,
    );
    expect(profit.container.querySelector(".chart-title").textContent).not.toBe(
      quantity.container.querySelector(".chart-title").textContent,
    );
  });

  it("handles comparison data and unknown fabric types", () => {
    const { container } = renderWithProviders(
      <FabricTypeChart
        data={[...data, { fabric_type: "Velour", revenue: "100", quantity: 1 }]}
        comparisonData={[{ fabric_type: "Silk", revenue: "200" }]}
        theme="dark"
        metricType="revenue"
      />,
    );
    expect(container.querySelector(".chart-container")).toBeInTheDocument();
  });
});
