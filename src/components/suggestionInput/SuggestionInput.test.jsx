import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SuggestionInput from "./SuggestionInput";

const Host = ({ onChange }) => {
  const [value, setValue] = useState("");
  return (
    <SuggestionInput
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
      options={[
        { value: "ساده", label: "ساده" },
        { value: "گلدار", label: "گلدار" },
        { value: "راه‌راه", label: "راه‌راه" },
      ]}
      placeholder="طرح"
    />
  );
};

describe("SuggestionInput", () => {
  it("opens the list next to the field instead of a native popup", () => {
    render(<Host onChange={vi.fn()} />);
    fireEvent.focus(screen.getByPlaceholderText("طرح"));

    const list = document.querySelector(".suggestion-input__list");
    expect(list).not.toBeNull();
    // Portalled to <body> so the modal's scroll container cannot clip it.
    expect(list.parentElement).toBe(document.body);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("filters by the typed text and commits the clicked suggestion", () => {
    const onChange = vi.fn();
    render(<Host onChange={onChange} />);

    const input = screen.getByPlaceholderText("طرح");
    fireEvent.change(input, { target: { value: "گل" } });

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("گلدار");

    fireEvent.click(options[0]);
    expect(onChange).toHaveBeenCalledWith("گلدار");
    expect(input.value).toBe("گلدار");
  });

  it("closes on Escape", () => {
    render(<Host onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText("طرح");

    fireEvent.focus(input);
    expect(screen.getAllByRole("option").length).toBeGreaterThan(0);

    fireEvent.keyDown(input, { key: "Escape" });
    expect(document.querySelector(".suggestion-input__list")).toBeNull();
  });
});
