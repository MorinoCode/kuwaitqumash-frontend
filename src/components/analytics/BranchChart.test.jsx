import { describe, it, expect } from "vitest";
import BranchChart from "./BranchChart";
import { renderWithProviders } from "../../test/renderWithProviders";

const data = [
  { name: "KuwaitQumash Main", revenue: "500", quantity: 12 },
  { name: "KuwaitQumash Salmiya", revenue: "300", quantity: 8 },
];

describe("BranchChart", () => {
  it("shows the empty state without data", () => {
    const { container } = renderWithProviders(<BranchChart theme="dark" />);
    expect(container.querySelector(".no-data")).toBeInTheDocument();
  });

  it("renders a titled chart", () => {
    const { container } = renderWithProviders(
      <BranchChart data={data} theme="dark" />,
    );
    expect(container.querySelector(".chart-title").textContent.length).toBeGreaterThan(0);
    expect(container.querySelector(".chart-container--dark")).toBeInTheDocument();
  });

  it("renders the quantity view title", () => {
    const revenue = renderWithProviders(<BranchChart data={data} theme="dark" />);
    const quantity = renderWithProviders(
      <BranchChart data={data} theme="dark" viewType="quantity" />,
    );
    expect(quantity.container.querySelector(".chart-title").textContent).not.toBe(
      revenue.container.querySelector(".chart-title").textContent,
    );
  });

  it("accepts comparison data", () => {
    const { container } = renderWithProviders(
      <BranchChart
        data={data}
        comparisonData={[{ name: "KuwaitQumash Main", revenue: "450" }]}
        theme="dark"
      />,
    );
    expect(container.querySelector(".chart-container")).toBeInTheDocument();
  });
});
