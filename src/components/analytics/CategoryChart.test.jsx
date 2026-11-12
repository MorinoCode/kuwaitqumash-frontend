import { describe, it, expect } from "vitest";
import CategoryChart from "./CategoryChart";
import { renderWithProviders } from "../../test/renderWithProviders";

const data = [
  { name: "Cotton", revenue: "300", quantity: 10 },
  { name: "Silk", revenue: "700", quantity: 4 },
];

describe("CategoryChart", () => {
  it("renders an empty chart container without data", () => {
    const { container } = renderWithProviders(<CategoryChart theme="dark" />);
    expect(container.querySelector(".chart-container")).toBeInTheDocument();
    expect(container.querySelector(".chart-title").textContent.length).toBeGreaterThan(0);
  });

  it("renders the title for revenue and quantity views", () => {
    const revenue = renderWithProviders(
      <CategoryChart data={data} theme="dark" metricType="revenue" />,
    );
    const revenueTitle = revenue.container.querySelector(".chart-title").textContent;
    expect(revenueTitle.length).toBeGreaterThan(0);

    const quantity = renderWithProviders(
      <CategoryChart data={data} theme="dark" viewType="quantity" />,
    );
    expect(quantity.container.querySelector(".chart-title").textContent).not.toBe(
      revenueTitle,
    );
  });

  it("applies the theme class", () => {
    const { container } = renderWithProviders(
      <CategoryChart data={data} theme="light" />,
    );
    expect(container.querySelector(".chart-container--light")).toBeInTheDocument();
  });

  it("handles comparison data", () => {
    const { container } = renderWithProviders(
      <CategoryChart
        data={data}
        comparisonData={[{ name: "Cotton", revenue: "100" }]}
        theme="dark"
      />,
    );
    expect(container.querySelector(".chart-container")).toBeInTheDocument();
  });
});
