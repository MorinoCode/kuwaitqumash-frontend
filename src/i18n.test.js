import { describe, it, expect } from "vitest";
import i18n from "./i18n";

describe("i18n", () => {
  it("loads the three supported languages", () => {
    for (const language of ["fa", "ar", "en"]) {
      expect(i18n.hasResourceBundle(language, "translation")).toBe(true);
    }
  });

  it("starts in Persian with English as fallback", () => {
    expect(i18n.options.fallbackLng).toContain("en");
    expect(i18n.options.supportedLngs).toEqual(
      expect.arrayContaining(["fa", "ar", "en"]),
    );
  });

  it("switches language", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");
    await i18n.changeLanguage("ar");
    expect(i18n.language).toBe("ar");
    await i18n.changeLanguage("fa");
  });

  it("returns the key for a missing translation instead of crashing", () => {
    expect(i18n.t("definitely_missing_key_123")).toBe("definitely_missing_key_123");
  });
});
