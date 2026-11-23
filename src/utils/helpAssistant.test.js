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

  it("keeps Persian when mixed with technical Latin terms", () => {
    expect(detectLanguage("Store ID چیه؟")).toBe("fa");
    expect(detectLanguage("چطور پرینت حرارتی 80mm بگیرم؟")).toBe("fa");
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

  it("matches single high-specificity domain words", () => {
    expect(findTopic("واتساپ")?.id).toBe("whatsapp-connect");
    expect(findTopic("مرجوعی")?.id).toBe("refund");
    expect(findTopic("اکسل")?.id).toBe("reports-export");
  });

  it("handles colloquial Persian, Arabic prefixes, and minor typos", () => {
    expect(findTopic("رمز یادم رفته")?.id).toBe("start-login");
    expect(findTopic("چطوری پرینت حرارتی 80mm بگیرم؟")?.id).toBe("thermal-printing");
    expect(findTopic("چجوری تخفیف بدم؟")?.id).toBe("customer-types");
    expect(findTopic("ته‌طاقه‌ها رو کجا ببینم؟")?.id).toBe("remnants-dead-stock");
    expect(findTopic("اجناس راکد کجاست؟")?.id).toBe("remnants-dead-stock");
    expect(findTopic("چطور فروشگاه جدید ثبت نام کنم؟")?.id).toBe("store-registration");
    expect(findTopic("Store ID چیه؟")?.id).toBe("start-login");
    expect(findTopic("فاکتور قدیمی کجاست؟")?.id).toBe("old-invoices-archive");
    expect(findTopic("فاکتورهامو چجوری پاک کنم؟")?.id).toBe("invoices");
    expect(findTopic("سود فروشگاه رو چطور مخفی کنم؟")?.id).toBe("dashboard");
    expect(findTopic("چطور عکس پارچه بذارم؟")?.id).toBe("inventory-add");
    expect(findTopic("how do I print thermal receipt?")?.id).toBe("thermal-printing");
    expect(findTopic("where are archived old invoices?")?.id).toBe("old-invoices-archive");
    expect(findTopic("forgot my store id")?.id).toBe("start-login");
    expect(findTopic("كيف أطبع فاتورة حرارية؟")?.id).toBe("thermal-printing");
    expect(findTopic("أين الفواتير القديمة؟")?.id).toBe("old-invoices-archive");
    expect(findTopic("واتساب للعملاء")?.id).toBe("whatsapp-send");
    expect(findTopic("how to download invocie pdf")?.id).toBe("invoices");
  });

  it("returns null for an unrelated question", () => {
    expect(findTopic("what is the weather in Tokyo today")).toBeNull();
  });

  it("returns null for an empty question", () => {
    expect(findTopic("")).toBeNull();
  });
});

describe("answerQuestion", () => {
  it("answers a matched question in its own language with related suggestions", () => {
    const result = answerQuestion("چطور مرجوعی ثبت کنم؟", "fa");
    expect(result.matched).toBe(true);
    expect(result.language).toBe("fa");
    expect(result.topicId).toBe("refund");
    expect(result.answer.length).toBeGreaterThan(20);
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("answers an English question in English", () => {
    const result = answerQuestion("how do I connect WhatsApp?", "en");
    expect(result.language).toBe("en");
    expect(result.matched).toBe(true);
  });

  it("matches every quick question across all 3 languages", () => {
    for (const lang of ["fa", "en", "ar"]) {
      for (const q of QUICK_QUESTIONS[lang]) {
        const res = answerQuestion(q, lang);
        expect(res.matched, `Quick question failed [${lang}]: ${q}`).toBe(true);
      }
    }
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
