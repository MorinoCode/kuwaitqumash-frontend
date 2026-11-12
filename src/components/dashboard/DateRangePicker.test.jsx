import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, act } from "@testing-library/react";
import DateRangePicker from "./DateRangePicker";
import { renderWithProviders } from "../../test/renderWithProviders";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
});

afterEach(() => vi.useRealTimers());

describe("DateRangePicker", () => {
  it("reports the default range on mount", () => {
    const onRangeChange = vi.fn();
    renderWithProviders(<DateRangePicker onRangeChange={onRangeChange} />);
    expect(onRangeChange).toHaveBeenCalled();
    expect(onRangeChange.mock.calls[0][2]).toBe("today");
  });

  it("reports a seven day range", () => {
    const onRangeChange = vi.fn();
    const { container } = renderWithProviders(
      <DateRangePicker onRangeChange={onRangeChange} />,
    );
    onRangeChange.mockClear();

    const buttons = container.querySelectorAll(".date-range-picker__btn");
    fireEvent.click(buttons[1]);

    expect(onRangeChange.mock.calls[0][2]).toBe("last_7_days");
    const [start, end] = onRangeChange.mock.calls[0];
    const days = (new Date(end) - new Date(start)) / 86400000;
    expect(days).toBeGreaterThan(6.9);
    expect(days).toBeLessThan(7.1);
  });

  it("marks the active quick range", () => {
    const { container } = renderWithProviders(<DateRangePicker onRangeChange={vi.fn()} />);
    const buttons = container.querySelectorAll(".date-range-picker__btn");
    fireEvent.click(buttons[2]);
    expect(buttons[2].className).toContain("date-range-picker__btn--active");
  });

  it("opens the custom picker instead of emitting a range", () => {
    const onRangeChange = vi.fn();
    const { container } = renderWithProviders(
      <DateRangePicker onRangeChange={onRangeChange} />,
    );
    onRangeChange.mockClear();

    fireEvent.click(container.querySelector(".date-range-picker__btn--custom"));

    expect(onRangeChange).not.toHaveBeenCalled();
    expect(container.querySelector(".date-range-picker__custom")).toBeInTheDocument();
  });

  it("emits the custom range once both dates are chosen", () => {
    const onRangeChange = vi.fn();
    const { container } = renderWithProviders(
      <DateRangePicker onRangeChange={onRangeChange} />,
    );
    fireEvent.click(container.querySelector(".date-range-picker__btn--custom"));

    const inputs = container.querySelectorAll("input[type=date]");
    fireEvent.change(inputs[0], { target: { value: "2026-03-01" } });
    fireEvent.change(inputs[1], { target: { value: "2026-03-10" } });

    const apply = container.querySelector(".date-range-picker__apply-btn");
    expect(apply).not.toBeDisabled();
    fireEvent.click(apply);

    const lastCall = onRangeChange.mock.calls.at(-1);
    expect(lastCall[2]).toBe("custom");
    expect(new Date(lastCall[0]).getDate()).toBe(1);
  });

  it("keeps apply disabled until both dates exist", () => {
    const { container } = renderWithProviders(<DateRangePicker onRangeChange={vi.fn()} />);
    fireEvent.click(container.querySelector(".date-range-picker__btn--custom"));
    expect(container.querySelector(".date-range-picker__apply-btn")).toBeDisabled();
  });

  it("closes the custom picker on cancel", () => {
    const { container } = renderWithProviders(<DateRangePicker onRangeChange={vi.fn()} />);
    fireEvent.click(container.querySelector(".date-range-picker__btn--custom"));
    act(() => {
      fireEvent.click(container.querySelector(".date-range-picker__cancel-btn"));
    });
    expect(container.querySelector(".date-range-picker__custom")).toBeNull();
  });
});
