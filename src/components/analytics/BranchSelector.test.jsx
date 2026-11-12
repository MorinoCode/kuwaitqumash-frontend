import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import BranchSelector from "./BranchSelector";
import { renderWithProviders } from "../../test/renderWithProviders";

const branches = [
  { id: 1, name: "KuwaitQumash Main" },
  { id: 2, name: "KuwaitQumash Salmiya" },
];

const setup = (selectedBranches = []) => {
  const onSelectionChange = vi.fn();
  const utils = renderWithProviders(
    <BranchSelector
      branches={branches}
      selectedBranches={selectedBranches}
      onSelectionChange={onSelectionChange}
    />,
  );
  return { ...utils, onSelectionChange };
};

describe("BranchSelector", () => {
  it("shows the placeholder when nothing is selected", () => {
    setup();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens the dropdown on click", () => {
    const { container } = setup();
    fireEvent.click(screen.getByRole("button"));
    expect(container.querySelector(".branch-selector-dropdown")).toBeInTheDocument();
  });

  it("strips the store prefix from branch names", () => {
    setup();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Salmiya")).toBeInTheDocument();
  });

  it("selects every branch", () => {
    const { onSelectionChange } = setup([]);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(document.querySelectorAll(".branch-option")[0]);
    expect(onSelectionChange).toHaveBeenCalledWith([1, 2]);
  });

  it("clears the selection when everything is already selected", () => {
    const { onSelectionChange } = setup([1, 2]);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(document.querySelectorAll(".branch-option")[0]);
    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });

  it("toggles a single branch", () => {
    const { onSelectionChange } = setup([1]);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Salmiya"));
    expect(onSelectionChange).toHaveBeenCalledWith([1, 2]);
  });

  it("removes a selected branch", () => {
    const { onSelectionChange } = setup([1, 2]);
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Main"));
    expect(onSelectionChange).toHaveBeenCalledWith([2]);
  });
});
