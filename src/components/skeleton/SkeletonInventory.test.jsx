import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  SkeletonInventoryTableRows,
  SkeletonInventoryCards,
} from "./SkeletonInventory";

describe("SkeletonInventoryTableRows", () => {
  it("renders eight placeholder rows", () => {
    const { container } = render(
      <table>
        <tbody>
          <SkeletonInventoryTableRows />
        </tbody>
      </table>,
    );
    expect(container.querySelectorAll("tr")).toHaveLength(8);
  });

  it("applies the theme modifier", () => {
    const { container } = render(
      <table>
        <tbody>
          <SkeletonInventoryTableRows theme="light" />
        </tbody>
      </table>,
    );
    expect(container.querySelector("tr")).toHaveClass("inventory-item--light");
  });
});

describe("SkeletonInventoryCards", () => {
  it("renders five mobile cards", () => {
    const { container } = render(<SkeletonInventoryCards />);
    expect(container.querySelectorAll(".skeleton-inventory-card")).toHaveLength(5);
  });

  it("renders seven detail rows per card", () => {
    const { container } = render(<SkeletonInventoryCards />);
    const firstCard = container.querySelector(".skeleton-inventory-card");
    expect(
      firstCard.querySelectorAll(".inventory-mobile-card__detail-item"),
    ).toHaveLength(7);
  });
});
