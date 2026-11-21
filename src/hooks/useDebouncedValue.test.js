import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  it("delays updates until after the debounce window and resets immediately on clear", () => {
    vi.useFakeTimers();
    try {
      const { result, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 300),
        { initialProps: { value: "" } },
      );

      expect(result.current).toBe("");

      rerender({ value: "silk" });
      expect(result.current).toBe("");

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe("");

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe("silk");

      rerender({ value: "" });
      expect(result.current).toBe("");
    } finally {
      vi.useRealTimers();
    }
  });
});
