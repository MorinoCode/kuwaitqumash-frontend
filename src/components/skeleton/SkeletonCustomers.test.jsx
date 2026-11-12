import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SkeletonCustomersTableRows } from "./SkeletonCustomers";

describe("SkeletonCustomersTableRows", () => {
  it("renders eight placeholder rows", () => {
    const { container } = render(
      <table>
        <tbody>
          <SkeletonCustomersTableRows />
        </tbody>
      </table>,
    );
    expect(container.querySelectorAll("tr")).toHaveLength(8);
  });

  it("renders five placeholder cells per row", () => {
    const { container } = render(
      <table>
        <tbody>
          <SkeletonCustomersTableRows />
        </tbody>
      </table>,
    );
    expect(container.querySelectorAll("tr")[0].querySelectorAll("td")).toHaveLength(5);
  });

  it("marks the placeholders as decorative", () => {
    const { container } = render(
      <table>
        <tbody>
          <SkeletonCustomersTableRows />
        </tbody>
      </table>,
    );
    expect(container.querySelectorAll(".skeleton").length).toBeGreaterThan(8);
  });
});
