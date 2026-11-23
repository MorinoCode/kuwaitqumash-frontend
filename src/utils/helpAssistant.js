import { HELP_UI, HELP_TOPICS, SUPPORT_CONTACT } from "../data/helpGuide.js";

const DIACRITICS = /[\p{M}\u0640]/gu;
const PERSIAN_DIGITS = /[۰-۹]/g;
const ARABIC_DIGITS = /[٠-٩]/g;

const toLatinDigits = (text) =>
  text
    .replace(PERSIAN_DIGITS, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(ARABIC_DIGITS, (d) => String(d.charCodeAt(0) - 0x0660));

const LATIN_STOP = new Set([
  "a", "an", "the", "is", "are", "do", "does", "did", "how", "what", "where",
  "when", "why", "can", "could", "i", "to", "of", "and", "or", "for", "in",
  "on", "my", "me", "it", "please", "with", "there", "this", "that", "you",
  "your", "am", "want", "get", "make", "need", "should", "from", "about",
]);

const SCRIPT_STOP = new Set([
  "چطور", "چگونه", "چطوری", "چجوری", "چجور", "کجا", "کجاست", "کجاس", "چرا",
  "چیه", "چیست", "است", "هست", "را", "رو", "می", "میخواهم", "میخوام", "کنم",
  "کنیم", "بکنم", "بدم", "بگیرم", "بزنم", "ببینم", "بگذارم", "بذارم", "باید",
  "شود", "میشه", "بشه", "از", "به", "در", "با", "برای", "واسه", "که", "و", "یا",
  "یک", "یه", "من", "ما", "شما", "هم", "این", "ان", "اون", "دارم", "داره",
  "کیف", "کیفیه", "این", "لماذا", "هل", "ما", "هو", "هی", "فی", "من", "علی",
  "الی", "مع", "انا", "انت", "ارید", "ممكن", "عندی", "لیش", "ایش", "وش",
]);

// Canonical domain synonyms (trilingual + colloquial + Pinglish).
// Values are normalized tokens so both index and queries map consistently.
const SYNONYMS = new Map([
  // Auth / Password / Store ID
  ["پسورد", "رمز"],
  ["پسوورد", "رمز"],
  ["پاسورد", "رمز"],
  ["پاسوورد", "رمز"],
  ["سر", "رمز"],
  ["pass", "password"],
  ["pwd", "password"],
  ["لاگین", "ورود"],
  ["لوگین", "ورود"],
  ["signin", "login"],
  ["استور", "store"],
  ["ایدی", "id"],
  // Thermal / Printing
  ["پرینت", "چاپ"],
  ["پرینتر", "چاپ"],
  ["فیش", "حرارتی"],
  ["فیشزن", "حرارتی"],
  ["حرارت", "حرارتی"],
  ["حراريه", "حرارتی"],
  ["حراری", "حرارتی"],
  ["حراریه", "حرارتی"],
  ["80", "80mm"],
  ["80mm", "thermal"],
  ["حرارتی", "thermal"],
  ["receipt", "thermal"],
  // Delete / Cancel
  ["پاک", "حذف"],
  ["دیلیت", "حذف"],
  ["باطل", "حذف"],
  ["کنسل", "لغو"],
  // Profit / Hide
  ["پنهان", "مخفی"],
  ["چشم", "مخفی"],
  ["mask", "hide"],
  // Images
  ["تصویر", "عکس"],
  ["فوتو", "عکس"],
  ["photo", "image"],
  ["picture", "image"],
  ["img", "image"],
  // Remnants / Dead stock
  ["تهطاقه", "remnant"],
  ["ته", "remnant"],
  ["باقیمانده", "remnant"],
  ["بقایا", "remnant"],
  ["leftover", "remnant"],
  ["راکد", "deadstock"],
  ["خوابیده", "deadstock"],
  ["راكد", "deadstock"],
  ["unsold", "deadstock"],
  // Archive / Old invoices
  ["ارشیو", "archive"],
  ["ارشیف", "archive"],
  ["قدیمی", "archive"],
  ["قدیمه", "archive"],
  ["old", "archive"],
  // Registration / Signup
  ["عضویت", "signup"],
  ["ثبتنام", "signup"],
  ["register", "signup"],
  ["التسجیل", "signup"],
  // WhatsApp + Pinglish
  ["واتس", "whatsapp"],
  ["واتساپ", "whatsapp"],
  ["واتساب", "whatsapp"],
  ["واساپ", "whatsapp"],
  ["whastapp", "whatsapp"],
  ["whatsap", "whatsapp"],
  // Invoices + Pinglish
  ["فکتور", "فاکتور"],
  ["faktor", "invoice"],
  ["invocie", "invoice"],
  ["قبض", "فاکتور"],
  ["bill", "invoice"],
  // Refunds + Pinglish
  ["مرجوع", "مرجوعی"],
  ["مرجوعه", "مرجوعی"],
  ["marjoee", "refund"],
  ["پس", "مرجوعی"],
  ["برگشت", "مرجوعی"],
  ["کریدیت", "مرجوعی"],
  ["استرداد", "مرتجع"],
  // Customers
  ["مشتریان", "مشتری"],
  ["مشتري", "مشتری"],
  ["عملاء", "عمیل"],
  ["عملا", "عمیل"],
  ["زبون", "عمیل"],
  // Sales + Discounts + Pinglish
  ["forosh", "sale"],
  ["بفروشم", "فروش"],
  ["کاشیر", "فروش"],
  ["افر", "تخفیف"],
  // Inventory
  ["اقمشه", "قماش"],
  ["طاقات", "طاقه"],
  ["رول", "طاقه"],
  // Excel
  ["اکسل", "excel"],
  ["اکسل", "excel"],
  ["ایکسل", "excel"],
]);

const normalize = (text) =>
  toLatinDigits(String(text || ""))
    .toLowerCase()
    .replace(DIACRITICS, "")
    .replace(/\u200c/g, " ")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ؤئ]/g, "ی")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const ARABIC_SCRIPT = /[\u0600-\u06FF]/;

const stem = (word) => {
  if (!word || word.length <= 2) return word;

  if (ARABIC_SCRIPT.test(word)) {
    let w = word;
    // Strip Arabic definite article prefixes (ال، وال، بال، لل، فال، كال)
    for (const prefix of ["وال", "بال", "فال", "کال", "لل", "ال"]) {
      if (w.startsWith(prefix) && w.length - prefix.length >= 3) {
        w = w.slice(prefix.length);
        break;
      }
    }
    // Strip common Persian colloquial/plural/possessive suffixes
    for (const suffix of [
      "هامو", "هاشو", "هایم", "هایت", "هایش", "هایی", "های", "هاش", "هام",
      "ها", "ارو", "ام", "مو", "ات", "ین", "ون",
    ]) {
      if (w.endsWith(suffix) && w.length - suffix.length >= 3) {
        w = w.slice(0, -suffix.length);
        break;
      }
    }
    // Arabic accusative tanween alef (قماشًا -> قماش)
    if (w.length > 3 && w.endsWith("ا") && !["کجا", "چرا", "شما", "لماذا", "ویزا"].includes(w)) {
      w = w.slice(0, -1);
    }
    return SYNONYMS.get(w) || w;
  }

  // English lightweight stemmer
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) {
    w = `${w.slice(0, -3)}y`;
  } else if (w.length > 5 && w.endsWith("ing")) {
    w = w.slice(0, -3);
  } else if (w.length > 4 && w.endsWith("ed")) {
    w = w.slice(0, -2);
  } else if (w.length > 4 && w.endsWith("es") && !w.endsWith("ses")) {
    w = w.slice(0, -2);
  } else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) {
    w = w.slice(0, -1);
  }
  return SYNONYMS.get(w) || w;
};

const canonicalToken = (raw) => {
  if (!raw) return "";
  const direct = SYNONYMS.get(raw);
  if (direct) return direct;
  const stemmed = stem(raw);
  return SYNONYMS.get(stemmed) || stemmed;
};

const tokenize = (text) => {
  const norm = normalize(text);
  if (!norm) return [];
  const rawParts = norm.split(" ");
  const out = [];
  for (let i = 0; i < rawParts.length; i += 1) {
    const part = rawParts[i];
    if (part.length <= 1) continue;
    // Handle common 2-word Persian compounds (ثبت نام -> signup, ته طاقه -> remnant, کلمه سر -> رمز)
    if (i + 1 < rawParts.length) {
      const pair = `${part}${rawParts[i + 1]}`;
      if (SYNONYMS.has(pair)) {
        out.push(SYNONYMS.get(pair));
      }
    }
    if (LATIN_STOP.has(part) || SCRIPT_STOP.has(part)) continue;
    const tok = canonicalToken(part);
    if (tok.length > 1 && !LATIN_STOP.has(tok) && !SCRIPT_STOP.has(tok)) {
      out.push(tok);
    }
  }
  return [...new Set(out)];
};

const toList = (values = []) => {
  const tokens = [];
  const phrases = [];
  const singles = [];

  values.forEach((value) => {
    const norm = normalize(value);
    if (!norm) return;
    const parts = tokenize(value);
    if (parts.length === 1) {
      singles.push(parts[0]);
      tokens.push(parts[0]);
    } else if (parts.length >= 2) {
      phrases.push(parts);
      parts.forEach((p) => tokens.push(p));
    }
  });

  return {
    tokens: [...new Set(tokens)],
    singles: [...new Set(singles)],
    phrases,
  };
};

const INDEX = HELP_TOPICS.map((topic) => {
  const fa = toList(topic.keywords.fa);
  const en = toList(topic.keywords.en);
  const ar = toList(topic.keywords.ar);
  const titleData = toList(Object.values(topic.titles));

  const tokenSet = new Set([
    ...fa.tokens,
    ...en.tokens,
    ...ar.tokens,
    ...titleData.tokens,
  ]);
  const singleKeywordSet = new Set([...fa.singles, ...en.singles, ...ar.singles]);
  const titleTokenSet = new Set(titleData.tokens);
  const phrases = [...fa.phrases, ...en.phrases, ...ar.phrases, ...titleData.phrases];

  return {
    topic,
    tokenSet,
    singleKeywordSet,
    titleTokenSet,
    phrases,
  };
});

const TOPIC_COUNT = INDEX.length;
const DOC_FREQ = new Map();
INDEX.forEach((entry) => {
  entry.tokenSet.forEach((token) => {
    DOC_FREQ.set(token, (DOC_FREQ.get(token) || 0) + 1);
  });
});

const tokenWeight = (token) => {
  const df = DOC_FREQ.get(token);
  if (!df) return 0;
  return 1 + Math.log(TOPIC_COUNT / df);
};

// Fast Damerau-Levenshtein distance <= 1 check for typo resilience (words >= 5 chars)
const isEditDistanceOne = (a, b) => {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;

  if (la === lb) {
    let diffs = 0;
    for (let i = 0; i < la; i += 1) {
      if (a[i] !== b[i]) {
        // Adjacent transposition (e.g. "invocie" vs "invoice")
        if (i + 1 < la && a[i] === b[i + 1] && a[i + 1] === b[i]) {
          diffs += 1;
          i += 1;
        } else {
          diffs += 1;
        }
        if (diffs > 1) return false;
      }
    }
    return diffs === 1;
  }

  const [shortStr, longStr] = la < lb ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let skipped = false;
  while (i < shortStr.length && j < longStr.length) {
    if (shortStr[i] === longStr[j]) {
      i += 1;
      j += 1;
    } else if (skipped) {
      return false;
    } else {
      skipped = true;
      j += 1;
    }
  }
  return true;
};

const ALL_INDEX_TOKENS = [...DOC_FREQ.keys()];
const LONG_INDEX_TOKENS = ALL_INDEX_TOKENS.filter((t) => t.length >= 5);

const expandWithFuzzy = (queryTokens) => {
  const expanded = [...queryTokens];
  queryTokens.forEach((tok) => {
    if (tok.length < 5 || DOC_FREQ.has(tok)) return;
    for (const candidate of LONG_INDEX_TOKENS) {
      if (isEditDistanceOne(tok, candidate)) {
        expanded.push(candidate);
        break;
      }
    }
  });
  return [...new Set(expanded)];
};

const PERSIAN_ONLY = /[پچژگ]/;
const PERSIAN_WORDS =
  /(^|\s)(چطور|چگونه|چطوری|چجوری|چرا|چیه|کجا|کجاست|میخوام|می‌خوام|کنم|شود|فروش|فاکتور|پارچه|مشتری|مرجوعی|انبار|قیمت|واتساپ|شعبه|حساب|ورود|تخفیف|ته‌طاقه|راکد|آرشیو|حرارتی|سود)(\s|$)/;
const ARABIC_ONLY = /[ةىئؤ]/;
const ARABIC_WORDS =
  /(^|\s)(كيف|لماذا|هل|أريد|اريد|أربط|أسجل|أضيف|أعمل|أطبع|فاتورة|فواتير|عميل|عملاء|قماش|مرتجع|واتساب|مخزون|فرع|دخول|سعر|متى|كم|اين|أين|ليش|ايش|وش|اليوم|غدا|الطقس|هذا|هذه|هناك|حرارية|القديمة|نسيت|السر)(\s|$)/;
const ARABIC_ARTICLE = /(^|\s)ال[^\s]{2,}/;
const TECH_LATIN_WORDS =
  /\b(pdf|qr|id|store|k-net|knet|vip|csv|excel|80mm|a4|a5|pos|hq|kwd|whatsapp|wa|rtl|ltr|usb|403|500|draft|regular|wholesaler|credit|note)\b/gi;

export const detectLanguage = (text, fallback = "fa") => {
  const raw = String(text || "").trim().toLowerCase();
  if (!raw) return fallback;

  const strippedForRatio = raw.replace(TECH_LATIN_WORDS, " ");
  const latin = (strippedForRatio.match(/[a-z]/g) || []).length;
  const rawLatin = (raw.match(/[a-z]/g) || []).length;
  const script = (raw.match(/[\u0600-\u06FF]/g) || []).length;

  if (script === 0) {
    return rawLatin > 0 ? "en" : fallback;
  }

  // Only treat as English if non-technical Latin letters clearly dominate
  if (latin > 0 && latin > script) return "en";

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
  let singleExactMatch = false;

  queryTokens.forEach((token) => {
    if (entry.tokenSet.has(token)) {
      const weight = tokenWeight(token);
      score += weight * 1.15;
      if (entry.titleTokenSet.has(token)) {
        score += 0.65;
      }
      if (entry.singleKeywordSet.has(token)) {
        singleExactMatch = true;
        score += 0.85;
      }
      matched += 1;
    }
  });

  entry.phrases.forEach((parts) => {
    if (parts.length < 2) return;
    const allPresent = parts.every((part) => queryTokens.includes(part));
    if (allPresent) {
      score += 2.8 + parts.length * 0.7;
      phraseMatch = true;
    }
  });

  return { score, matched, phraseMatch, singleExactMatch };
};

const rankTopics = (question) => {
  const normalizedQuery = normalize(question);
  const baseTokens = tokenize(question);
  if (!normalizedQuery || baseTokens.length === 0) return { ranked: [], tokens: [] };

  const queryTokens = expandWithFuzzy(baseTokens);
  const ranked = INDEX.map((entry) => ({
    entry,
    ...scoreTopic(entry, queryTokens),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return { ranked, tokens: queryTokens };
};

export const findTopic = (question) => {
  const { ranked, tokens } = rankTopics(question);
  if (ranked.length === 0) return null;

  const best = ranked[0];

  // Direct single-word lookup (e.g. "واتساپ", "مرجوعی", "اکسل", "بارکد", "تخفیف")
  if (tokens.length === 1 && best.singleExactMatch && best.score >= 2.1) {
    return best.entry.topic;
  }

  // Multi-word questions: require a phrase hit, 2+ matching tokens, or a strong single exact domain term
  if (best.phraseMatch && best.score >= 3.2) return best.entry.topic;
  if (best.matched >= 2 && best.score >= 3.0) return best.entry.topic;
  if (best.singleExactMatch && best.score >= 3.3 && tokens.length <= 3) {
    return best.entry.topic;
  }

  return null;
};

const TOPIC_BY_ID = new Map(HELP_TOPICS.map((t) => [t.id, t]));

const buildRelatedSuggestions = (topic, ranked, language) => {
  const picked = [];
  if (topic?.related?.length) {
    topic.related.forEach((id) => {
      const target = TOPIC_BY_ID.get(id);
      if (target) picked.push(target.titles[language] || target.titles.en);
    });
  } else if (ranked.length > 0) {
    ranked.slice(0, 3).forEach((item) => {
      if (item.score >= 1.5) {
        picked.push(item.entry.topic.titles[language] || item.entry.topic.titles.en);
      }
    });
  }
  return [...new Set(picked)].slice(0, 3);
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
  const { ranked } = rankTopics(question);
  const topic = findTopic(question);
  const ui = HELP_UI[language] || HELP_UI.en;

  if (!topic) {
    return {
      language,
      matched: false,
      topicId: null,
      answer: supportFallback(language),
      suggestions: buildRelatedSuggestions(null, ranked, language),
    };
  }

  return {
    language,
    matched: true,
    topicId: topic.id,
    title: topic.titles[language] || topic.titles.en,
    answer: topic.answers[language] || topic.answers.en,
    label: ui.found,
    suggestions: buildRelatedSuggestions(topic, ranked, language),
  };
};

export const QUICK_QUESTIONS = {
  fa: [
    "چطور فروش ثبت کنم؟",
    "چطور واتساپ را به فروشگاه اضافه کنم؟",
    "چطور مرجوعی ثبت کنم؟",
    "چطور چاپ حرارتی 80mm بگیرم؟",
    "ته‌طاقه‌ها و اجناس راکد کجاست؟",
    "چطور مشتری جدید اضافه کنم؟",
    "چطور پارچه جدید اضافه کنم؟",
    "چطور فاکتور PDF بگیرم؟",
    "فاکتورهای قدیمی کجاست؟",
    "چطور سود داشبورد را مخفی کنم؟",
    "چطور کارمند اضافه کنم؟",
    "چطور شعبه جدید بسازم؟",
    "چطور لوگو آپلود کنم؟",
    "چطور پیام گروهی بفرستم؟",
    "چطور خروجی اکسل بگیرم؟",
    "چطور کپی فاکتور روی واتساپ مدیر بگیرم؟",
  ],
  en: [
    "How do I record a sale?",
    "How do I connect WhatsApp to the store?",
    "How do I refund an invoice?",
    "How do I print an 80mm thermal receipt?",
    "Where are remnants and dead stock?",
    "How do I add a customer?",
    "How do I add a new fabric?",
    "How do I get the invoice PDF?",
    "Where are old archived invoices?",
    "How do I hide profit on the dashboard?",
    "How do I add a staff member?",
    "How do I create a new branch?",
    "How do I upload the logo?",
    "How do I send a bulk message?",
    "How do I export Excel?",
    "How do I auto-receive store invoice copies on WhatsApp?",
  ],
  ar: [
    "كيف أسجل عملية بيع؟",
    "كيف أربط واتساب بالمتجر؟",
    "كيف أعمل مرتجع؟",
    "كيف أطبع فاتورة حرارية 80mm؟",
    "أين بقايا الطاقات والبضاعة الراكدة؟",
    "كيف أضيف عميلًا جديدًا؟",
    "كيف أضيف قماشًا جديدًا؟",
    "كيف أحصل على الفاتورة PDF؟",
    "أين الفواتير القديمة والأرشيف؟",
    "كيف أخفي الربح في لوحة التحكم؟",
    "كيف أضيف موظفًا؟",
    "كيف أنشئ فرعًا جديدًا؟",
    "كيف أرفع الشعار؟",
    "كيف أرسل رسالة جماعية؟",
    "كيف أصدّر إكسل؟",
    "كيف أستلم نسخة الفاتورة على واتساب المتجر؟",
  ],
};

export const getQuickQuestions = (language) => QUICK_QUESTIONS[language] || QUICK_QUESTIONS.en;

export const getUiStrings = (language) => HELP_UI[language] || HELP_UI.en;
