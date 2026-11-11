import { HELP_UI, HELP_TOPICS, SUPPORT_CONTACT } from "../data/helpGuide.js";

const DIACRITICS = /[\u064B-\u0652\u0670\u0640\u06D6-\u06ED]/g;
const LATIN_STOP = new Set([
  "a", "an", "the", "is", "are", "do", "does", "how", "what", "where", "when",
  "can", "i", "to", "of", "and", "or", "for", "in", "on", "my", "me", "it",
  "please", "with", "there", "this", "that", "you", "your", "am", "want",
]);
const SCRIPT_STOP = new Set([
  "چطور", "چگونه", "چطوری", "کجا", "چرا", "چیه", "چیست", "است", "هست", "را",
  "می", "می‌خواهم", "میخوام", "کنم", "کنیم", "باید", "شود", "از", "به",
  "در", "با", "برای", "که", "و", "یا", "یک", "من", "شما", "رو", "هم",
  "كيف", "كيفية", "أين", "لماذا", "هل", "ما", "هو", "هي", "في", "من", "على",
  "إلى", "الى", "مع", "أنا", "انت", "أنت",
]);

const normalize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(DIACRITICS, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ؤئ]/g, "ی")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (text) =>
  normalize(text)
    .split(" ")
    .filter((word) => word.length > 1 && !LATIN_STOP.has(word) && !SCRIPT_STOP.has(word));

const toList = (values = []) => {
  const out = [];
  values.forEach((value) => {
    const full = normalize(value);
    if (!full) return;
    out.push(full);
    full.split(" ").forEach((part) => {
      if (part.length > 1) out.push(part);
    });
  });
  return [...new Set(out)];
};

const INDEX = HELP_TOPICS.map((topic) => ({
  topic,
  keywords: {
    fa: toList(topic.keywords.fa),
    en: toList(topic.keywords.en),
    ar: toList(topic.keywords.ar),
  },
  keywordSet: new Set([
    ...toList(topic.keywords.fa),
    ...toList(topic.keywords.en),
    ...toList(topic.keywords.ar),
    ...toList(Object.values(topic.titles)),
  ]),
}));

const TOPIC_COUNT = INDEX.length;
const DOC_FREQ = new Map();
INDEX.forEach((entry) => {
  const seen = new Set();
  entry.keywordSet.forEach((token) => {
    if (token.includes(" ") || seen.has(token)) return;
    seen.add(token);
    DOC_FREQ.set(token, (DOC_FREQ.get(token) || 0) + 1);
  });
});

const tokenWeight = (token) => {
  const df = DOC_FREQ.get(token);
  if (!df) return 0;
  return 1 + Math.log(TOPIC_COUNT / df);
};

const PERSIAN_ONLY = /[پچژگ]/;
const PERSIAN_WORDS =
  /(^|\s)(چطور|چگونه|چطوری|چرا|کجا|میخوام|می‌خوام|کنم|شود|فروش|فاکتور|پارچه|مشتری|مرجوعی|انبار|قیمت|واتساپ|شعبه|حساب|ورود)(\s|$)/;
const ARABIC_ONLY = /[ةىئؤ]/;
const ARABIC_WORDS =
  /(^|\s)(كيف|لماذا|هل|أريد|اريد|أربط|أسجل|أضيف|أعمل|فاتورة|عميل|قماش|مرتجع|واتساب|مخزون|فرع|دخول|سعر|متى|كم|اين|أين|ليش|ايش|وش|اليوم|غدا|الطقس|هذا|هذه|هناك)(\s|$)/;
const ARABIC_ARTICLE = /(^|\s)ال[^\s]{2,}/;

export const detectLanguage = (text, fallback = "fa") => {
  const raw = String(text || "").trim().toLowerCase();
  if (!raw) return fallback;

  const latin = (raw.match(/[a-z]/g) || []).length;
  const script = (raw.match(/[\u0600-\u06FF]/g) || []).length;

  if (latin > 0 && latin >= script) return "en";
  if (script === 0) return fallback;

  const arabicHits =
    (raw.match(new RegExp(ARABIC_ONLY.source, "g")) || []).length +
    (ARABIC_WORDS.test(raw) ? 2 : 0) +
    (ARABIC_ARTICLE.test(raw) ? 1 : 0);
  const persianHits =
    (raw.match(new RegExp(PERSIAN_ONLY.source, "g")) || []).length +
    (PERSIAN_WORDS.test(raw) ? 2 : 0);

  if (arabicHits > persianHits) return "ar";
  if (persianHits > 0) return "fa";
  return fallback === "ar" ? "ar" : "fa";
};

const scoreTopic = (entry, queryTokens) => {
  let score = 0;
  let matched = 0;
  let phraseMatch = false;

  queryTokens.forEach((token) => {
    if (entry.keywordSet.has(token)) {
      score += tokenWeight(token) * 1.1;
      matched += 1;
    }
  });

  entry.keywordSet.forEach((keyword) => {
    if (!keyword.includes(" ")) return;
    const parts = keyword.split(" ").filter((part) => part.length > 1 && !SCRIPT_STOP.has(part));
    if (parts.length < 2) return;
    const allPresent = parts.every((part) => queryTokens.includes(part));
    if (allPresent) {
      score += 2.6 + parts.length * 0.6;
      phraseMatch = true;
    }
  });

  return { score, matched, phraseMatch };
};

export const findTopic = (question) => {
  const normalizedQuery = normalize(question);
  const queryTokens = tokenize(question);
  if (!normalizedQuery || queryTokens.length === 0) return null;

  let best = null;
  INDEX.forEach((entry) => {
    const result = scoreTopic(entry, queryTokens);
    if (!best || result.score > best.score) {
      best = { entry, ...result };
    }
  });

  if (!best || best.score < 3.2) return null;
  // A single loosely matching word is not enough; require a phrase hit or two words.
  if (!best.phraseMatch && best.matched < 2) return null;
  return best.entry.topic;
};

export const supportFallback = (language) => {
  const ui = HELP_UI[language] || HELP_UI.en;
  const parts = [];
  if (SUPPORT_CONTACT.phone) parts.push(`☎ ${SUPPORT_CONTACT.phone}`);
  if (SUPPORT_CONTACT.whatsapp) parts.push(`WhatsApp: ${SUPPORT_CONTACT.whatsapp}`);
  const contact = parts.length ? `\n${parts.join("  •  ")}` : "";
  return `${ui.noAnswer}${contact}`;
};

export const answerQuestion = (question, uiLanguage = "fa") => {
  const language = detectLanguage(question, uiLanguage);
  const topic = findTopic(question);
  const ui = HELP_UI[language] || HELP_UI.en;

  if (!topic) {
    return { language, matched: false, topicId: null, answer: supportFallback(language) };
  }

  return {
    language,
    matched: true,
    topicId: topic.id,
    title: topic.titles[language] || topic.titles.en,
    answer: topic.answers[language] || topic.answers.en,
    label: ui.found,
  };
};

export const QUICK_QUESTIONS = {
  fa: [
    "چطور فروش ثبت کنم؟",
    "چطور واتساپ را به فروشگاه اضافه کنم؟",
    "چطور مرجوعی ثبت کنم؟",
    "چطور مشتری جدید اضافه کنم؟",
    "چطور پارچه جدید اضافه کنم؟",
    "چطور فاکتور PDF بگیرم؟",
    "چطور کارمند اضافه کنم؟",
    "چطور شعبه جدید بسازم؟",
    "چطور لوگو آپلود کنم؟",
    "چطور پیام گروهی بفرستم؟",
    "چطور خروجی اکسل بگیرم؟",
    "چطور فاکتور را چاپ کنم؟",
  ],
  en: [
    "How do I record a sale?",
    "How do I add WhatsApp to the store?",
    "How do I refund an invoice?",
    "How do I add a customer?",
    "How do I add a new fabric?",
    "How do I get the invoice PDF?",
    "How do I add a staff member?",
    "How do I create a new branch?",
    "How do I upload the logo?",
    "How do I send a bulk message?",
    "How do I export Excel?",
    "How do I print an invoice?",
  ],
  ar: [
    "كيف أسجل عملية بيع؟",
    "كيف أضيف واتساب إلى المتجر؟",
    "كيف أعمل مرتجع؟",
    "كيف أضيف عميلًا جديدًا؟",
    "كيف أضيف قماشًا جديدًا؟",
    "كيف أحصل على الفاتورة PDF؟",
    "كيف أضيف موظفًا؟",
    "كيف أنشئ فرعًا جديدًا؟",
    "كيف أرفع الشعار؟",
    "كيف أرسل رسالة جماعية؟",
    "كيف أصدّر إكسل؟",
    "كيف أطبع الفاتورة؟",
  ],
};

export const getQuickQuestions = (language) => QUICK_QUESTIONS[language] || QUICK_QUESTIONS.en;

export const getUiStrings = (language) => HELP_UI[language] || HELP_UI.en;
