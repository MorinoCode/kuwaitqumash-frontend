import { describe, it, expect } from "vitest";
import { numberToWords } from "./numberToWords";

describe("numberToWords", () => {
  it("renders zero", () => {
    expect(numberToWords(0)).toBe("Zero Dinar");
  });

  it("renders a small amount", () => {
    expect(numberToWords(7)).toBe("Seven Dinar");
  });

  it("renders tens with a unit", () => {
    expect(numberToWords(21)).toBe("Twenty One Dinar");
  });

  it("renders hundreds", () => {
    expect(numberToWords(305)).toBe("Three Hundred and Five Dinar");
  });

  it("renders thousands", () => {
    expect(numberToWords(1250)).toBe("One Thousand Two Hundred and Fifty Dinar");
  });

  it("renders fils below one dinar", () => {
    expect(numberToWords(0.75)).toBe("Seven Hundred and Fifty Fils");
  });

  it("combines dinars and fils", () => {
    expect(numberToWords(12.5)).toBe("Twelve Dinar and Five Hundred Fils");
  });
});
