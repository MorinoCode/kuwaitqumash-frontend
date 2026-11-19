import { describe, it, expect } from "vitest";
import {
  FABRIC_TYPES,
  PATTERNS,
  COLORS,
  UNITS,
  COUNTRIES,
  optionLabel,
  optionValue,
  localizedOption,
  localizeWords,
  localizeItemName,
  getSubcategories,
  formatMeters,
  unitShort,
} from "./inventoryCategories";

describe("option catalogues", () => {
  it("labels every fabric type in three languages", () => {
    expect(FABRIC_TYPES.length).toBeGreaterThan(10);
    for (const option of FABRIC_TYPES) {
      expect(option.value).toBeTruthy();
      expect(option.labelAr).toBeTruthy();
      expect(option.labelFa).toBeTruthy();
    }
  });

  it("has unique fabric, pattern and country values", () => {
    for (const list of [FABRIC_TYPES, PATTERNS, COUNTRIES]) {
      const values = list.map((option) => option.value);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("describes every unit with a short label", () => {
    expect(UNITS.map((u) => u.value)).toEqual(["meter", "roll"]);
    expect(UNITS[0].short).toBe("m");
  });
});

describe("optionLabel", () => {
  const cotton = FABRIC_TYPES[0];

  it("returns the language specific label", () => {
    expect(optionLabel(cotton, "fa")).toBe("پنبه");
    expect(optionLabel(cotton, "ar")).toBe("قطن");
    expect(optionLabel(cotton, "en")).toBe("Cotton");
  });

  it("returns an empty string for a missing option", () => {
    expect(optionLabel(null, "fa")).toBe("");
  });
});

describe("optionValue", () => {
  it("maps a translated label back to its value", () => {
    expect(optionValue(FABRIC_TYPES, "پنبه")).toBe("Cotton");
    expect(optionValue(FABRIC_TYPES, "قطن")).toBe("Cotton");
    expect(optionValue(FABRIC_TYPES, "Cotton")).toBe("Cotton");
  });

  it("keeps an unknown value and trims it", () => {
    expect(optionValue(FABRIC_TYPES, "  Velour  ")).toBe("Velour");
  });

  it("returns an empty string for empty input", () => {
    expect(optionValue(COLORS, "")).toBe("");
  });
});

describe("localizedOption", () => {
  it("returns the raw value in English", () => {
    expect(localizedOption(COLORS, "Black", "en")).toBe("Black");
  });

  it("translates a stored value", () => {
    expect(localizedOption(COLORS, "Black", "fa")).toBe("مشکی");
    expect(localizedOption(COLORS, "Black", "ar")).toBe("أسود");
  });

  it("falls back to the raw value", () => {
    expect(localizedOption(COLORS, "Neon", "fa")).toBe("Neon");
    expect(localizedOption(COLORS, "", "fa")).toBe("");
  });
});

describe("localizeWords", () => {
  it("translates known words and keeps the rest", () => {
    expect(localizeWords("Cotton Black", "fa")).toBe("پنبه مشکی");
    expect(localizeWords("Cotton Velour", "fa")).toBe("پنبه Velour");
  });

  it("keeps the raw text in English", () => {
    expect(localizeWords("Cotton Black", "en")).toBe("Cotton Black");
  });
});

describe("localizeItemName", () => {
  it("translates a fully known name", () => {
    expect(localizeItemName("Silk Plain", "ar")).toBe("حرير سادة");
  });

  it("returns the original when any word is unknown", () => {
    expect(localizeItemName("Silk Velour", "ar")).toBe("Silk Velour");
  });

  it("returns an empty string for empty input", () => {
    expect(localizeItemName("", "ar")).toBe("");
  });
});

describe("helpers", () => {
  it("returns the pattern list as subcategories", () => {
    expect(getSubcategories("Cotton")).toBe(PATTERNS);
    expect(getSubcategories(null)).toEqual([]);
  });

  it("formats meters with two decimals", () => {
    expect(formatMeters("2.345")).toBe("2.35");
    expect(formatMeters("abc")).toBe("0.00");
    expect(formatMeters(null)).toBe("0.00");
  });

  it("normalises Arabic digits before formatting", () => {
    expect(formatMeters("٣.٥")).toBe("3.50");
  });

  it("resolves the unit short label", () => {
    expect(unitShort("roll")).toBe("roll");
    expect(unitShort("unknown")).toBe("unknown");
    expect(unitShort(undefined)).toBe("m");
  });
});
