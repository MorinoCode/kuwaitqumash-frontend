import { describe, it, expect } from "vitest";
import {
  detectLanguage,
  findTopic,
  answerQuestion,
  supportFallback,
  getQuickQuestions,
  getUiStrings,
  QUICK_QUESTIONS,
} from "./helpAssistant";

describe("detectLanguage", () => {
  it("detects Persian", () => {
    expect(detectLanguage("چطور فروش ثبت کنم؟")).toBe("fa");
  });

  it("detects Arabic", () => {
    expect(detectLanguage("كيف أسجل عملية بيع؟")).toBe("ar");
  });

  it("detects English", () => {
    expect(detectLanguage("how do I record a sale?")).toBe("en");
  });

  it("falls back for empty input", () => {
    expect(detectLanguage("", "ar")).toBe("ar");
    expect(detectLanguage("", "fa")).toBe("fa");
  });
});

describe("findTopic", () => {
  it("finds the sales topic in Persian", () => {
    expect(findTopic("چطور فروش ثبت کنم؟").id).toBe("sales");
  });

  it("finds the customer topic in English", () => {
    expect(findTopic("how do I add a customer?").id).toBe("customers-add");
  });

  it("finds the inventory topic in Arabic", () => {
    const topic = findTopic("كيف أضيف قماشًا جديدًا؟");
    expect(topic).toBeTruthy();
    expect(["inventory-add", "inventory-list"]).toContain(topic.id);
  });

  it("returns null for an unrelated question", () => {
    expect(findTopic("what is the weather in Tokyo today")).toBeNull();
  });

  it("returns null for an empty question", () => {
    expect(findTopic("")).toBeNull();
  });
});

describe("answerQuestion", () => {
  it("answers a matched question in its own language", () => {
    const result = answerQuestion("چطور مرجوعی ثبت کنم؟", "fa");
    expect(result.matched).toBe(true);
    expect(result.language).toBe("fa");
    expect(result.topicId).toBeTruthy();
    expect(result.answer.length).toBeGreaterThan(20);
  });

  it("answers an English question in English", () => {
    const result = answerQuestion("how do I connect WhatsApp?", "en");
    expect(result.language).toBe("en");
    expect(result.matched).toBe(true);
  });

  it("falls back to support text when nothing matches", () => {
    const result = answerQuestion("zzzz unknown topic", "fa");
    expect(result.matched).toBe(false);
    expect(result.topicId).toBeNull();
    expect(result.answer.length).toBeGreaterThan(10);
  });
});

describe("helpers", () => {
  it("returns quick questions per language", () => {
    expect(getQuickQuestions("fa")).toBe(QUICK_QUESTIONS.fa);
    expect(getQuickQuestions("xx")).toBe(QUICK_QUESTIONS.en);
    expect(getQuickQuestions("ar").length).toBeGreaterThan(5);
  });

  it("returns UI strings per language", () => {
    expect(getUiStrings("ar").title).toBeTruthy();
    expect(getUiStrings("nope").title).toBeTruthy();
  });

  it("builds the support fallback without inventing contacts", () => {
    const text = supportFallback("fa");
    expect(text.length).toBeGreaterThan(10);
    expect(text).not.toContain("☎");
  });
});
