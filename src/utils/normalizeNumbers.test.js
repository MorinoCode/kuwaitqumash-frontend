import { describe, it, expect } from "vitest";
import { normalizeToLatinDigits } from "./normalizeNumbers";

describe("normalizeToLatinDigits", () => {
  it("converts Arabic-Indic digits", () => {
    expect(normalizeToLatinDigits("١٢٣")).toBe("123");
  });

  it("converts Persian digits", () => {
    expect(normalizeToLatinDigits("۴۵۶")).toBe("456");
  });

  it("keeps separators and latin digits", () => {
    expect(normalizeToLatinDigits("12-34")).toBe("12-34");
  });

  it("returns an empty string for null", () => {
    expect(normalizeToLatinDigits(null)).toBe("");
  });

  it("stringifies numbers", () => {
    expect(normalizeToLatinDigits(42)).toBe("42");
  });
});
