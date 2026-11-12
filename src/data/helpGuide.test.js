import { describe, it, expect } from "vitest";
import {
  HELP_LANGUAGES,
  HELP_UI,
  HELP_TOPICS,
  SUPPORT_CONTACT,
} from "./helpGuide";

describe("help guide data", () => {
  it("supports the three interface languages", () => {
    expect(HELP_LANGUAGES).toEqual(["fa", "en", "ar"]);
  });

  it("provides UI strings in every language", () => {
    for (const language of HELP_LANGUAGES) {
      const ui = HELP_UI[language];
      expect(ui).toBeTruthy();
      for (const key of ["title", "subtitle", "placeholder", "greeting", "noAnswer"]) {
        expect(ui[key]).toBeTruthy();
      }
      expect(ui.suggestions.length).toBeGreaterThan(0);
    }
  });

  it("keeps the support contact empty rather than inventing a number", () => {
    expect(SUPPORT_CONTACT).toEqual({ phone: "", whatsapp: "" });
  });

  it("has unique topic ids", () => {
    const ids = HELP_TOPICS.map((topic) => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("answers every topic in all languages", () => {
    for (const topic of HELP_TOPICS) {
      for (const language of HELP_LANGUAGES) {
        expect(topic.titles[language]).toBeTruthy();
        expect(topic.answers[language].length).toBeGreaterThan(20);
        expect(topic.keywords[language].length).toBeGreaterThan(0);
      }
    }
  });

  it("covers the main product areas", () => {
    const categories = new Set(HELP_TOPICS.map((topic) => topic.category));
    for (const category of ["basic", "inventory", "customers", "sales"]) {
      expect(categories.has(category)).toBe(true);
    }
  });
});
