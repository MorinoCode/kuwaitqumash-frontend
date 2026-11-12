import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";
import { renderWithProviders } from "../../test/renderWithProviders";

const renderPage = (props = {}) =>
  renderWithProviders(
    <Pagination
      currentPage={1}
      totalPages={3}
      totalItems={45}
      itemsPerPage={20}
      onPageChange={vi.fn()}
      {...props}
    />,
  );

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = renderPage({ totalPages: 1 });
    expect(container.querySelector(".pagination")).toBeNull();
  });

  it("shows the visible range of items", () => {
    const { container } = renderPage();
    expect(container.querySelector(".pagination__text").textContent).toContain("1-20");
    expect(container.querySelector(".pagination__text").textContent).toContain("45");
  });

  it("disables the previous button on the first page", () => {
    const { container } = renderPage();
    expect(container.querySelector(".pagination__btn--prev")).toBeDisabled();
  });

  it("disables the next button on the last page", () => {
    const { container } = renderPage({ currentPage: 3 });
    expect(container.querySelector(".pagination__btn--next")).toBeDisabled();
  });

  it("reports the page the user picked", () => {
    const onPageChange = vi.fn();
    const { container } = renderPage({ onPageChange });
    const pageTwo = [...container.querySelectorAll(".pagination__page")].find(
      (btn) => btn.textContent === "2",
    );
    fireEvent.click(pageTwo);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("adds ellipses for a long page list", () => {
    const { container } = renderPage({ currentPage: 6, totalPages: 12 });
    expect(container.querySelectorAll(".pagination__ellipsis").length).toBe(2);
  });

  it("marks the active page", () => {
    const { container } = renderPage({ currentPage: 2 });
    expect(container.querySelector(".pagination__page--active").textContent).toBe("2");
  });
});
