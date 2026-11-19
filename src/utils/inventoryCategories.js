import { normalizeToLatinDigits } from "./normalizeNumbers.js";

const opt = (value, label, labelAr, labelFa) => ({
  value,
  label,
  labelAr,
  labelFa,
});

export const FABRIC_TYPES = [
  opt("Cotton", "Cotton", "قطن", "پنبه"),
  opt("Silk", "Silk", "حرير", "ابریشم"),
  opt("Wool", "Wool", "صوف", "پشم"),
  opt("Linen", "Linen", "كتان", "کتان"),
  opt("Polyester", "Polyester", "بوليستر", "پلی‌استر"),
  opt("Viscose", "Viscose", "فيسكوز", "ویسکوز"),
  opt("Chiffon", "Chiffon", "شيفون", "شیفون"),
  opt("Crepe", "Crepe", "كريب", "کرپ"),
  opt("Satin", "Satin", "ساتان", "ساتن"),
  opt("Velvet", "Velvet", "مخمل", "مخمل"),
  opt("Lace", "Lace", "دانتيل", "دانتل"),
  opt("Denim", "Denim", "جينز", "جین"),
  opt("Jersey", "Jersey", "جيرسي", "جرسی"),
  opt("Organza", "Organza", "أورجانزا", "ارگانزا"),
  opt("Tulle", "Tulle", "تول", "تول"),
  opt("Kashmir", "Kashmir", "كشمير", "کشمیر"),
  opt("Brocade", "Brocade", "البروكار", "بروکاد"),
  opt("Charmeuse", "Charmeuse", "شارموز", "شارمز"),
  opt("Georgette", "Georgette", "جورجيت", "ژرژت"),
  opt("Muslin", "Muslin", "موسلين", "موسلین"),
  opt("Rayon", "Rayon", "رايون", "ریون"),
  opt("Nylon", "Nylon", "نايلون", "نایلون"),
  opt("Acrylic", "Acrylic", "أكريليك", "اکریلیک"),
  opt("Bamboo", "Bamboo", "بامبو", "بامبو"),
  opt("Modal", "Modal", "مودال", "مدال"),
  opt("Suede", "Suede", "شامواه", "جیر"),
  opt("Felt", "Felt", "لباد", "نمد"),
  opt("Net", "Net", "شبك", "تور"),
  opt("Terry", "Terry", "تيري", "حوله‌ای"),
  opt("Fleece", "Fleece", "فليس", "کرکی"),
];

export const PATTERNS = [
  opt("Plain", "Plain", "سادة", "ساده"),
  opt("Floral", "Floral", "زهري", "گلدار"),
  opt("Striped", "Striped", "مخطط", "راه‌راه"),
  opt("Checkered", "Checkered", "كاروهات", "شطرنجی"),
  opt("Polka Dot", "Polka Dot", "منقط", "خال‌خالی"),
  opt("Geometric", "Geometric", "هندسي", "هندسی"),
  opt("Embroidered", "Embroidered", "مطرز", "گلدوزی"),
  opt("Printed", "Printed", "مطبوع", "چاپی"),
  opt("Jacquard", "Jacquard", "جاكار", "ژاکارد"),
  opt("Paisley", "Paisley", "بيسلي", "بته‌جقه"),
  opt("Plaid", "Plaid", "كاروه", "چهارخانه"),
  opt("Herringbone", "Herringbone", "عظم السمكة", "جناغی"),
  opt("Damask", "Damask", "دمشقي", "دمشقی"),
  opt("Animal Print", "Animal Print", "طبعة حيوانية", "طرح حیوانی"),
  opt("Abstract", "Abstract", "تجريدي", "انتزاعی"),
  opt("Tie-dye", "Tie-dye", "تايداي", "تای‌دای"),
  opt("Camouflage", "Camouflage", "تمويه", "استتاری"),
  opt("Sequined", "Sequined", "مطرز بالترتر", "پولک‌دوزی"),
  opt("Textured", "Textured", "محبب", "بافت‌دار"),
];

export const COMPOSITIONS = [
  opt("100% Cotton", "100% Cotton", "100% قطن", "100% پنبه"),
  opt("100% Silk", "100% Silk", "100% حرير", "100% ابریشم"),
  opt("100% Wool", "100% Wool", "100% صوف", "100% پشم"),
  opt("100% Polyester", "100% Polyester", "100% بوليستر", "100% پلی‌استر"),
  opt("50% Cotton 50% Polyester", "50% Cotton 50% Polyester", "50% قطن 50% بوليستر", "50% پنبه 50% پلی‌استر"),
  opt("70% Polyester 30% Viscose", "70% Polyester 30% Viscose", "70% بوليستر 30% فيسكوز", "70% پلی‌استر 30% ویسکوز"),
  opt("95% Cotton 5% Elastane", "95% Cotton 5% Elastane", "95% قطن 5% إيلاستين", "95% پنبه 5% الاستان"),
  opt("100% Linen", "100% Linen", "100% كتان", "100% کتان"),
  opt("100% Viscose", "100% Viscose", "100% فيسكوز", "100% ویسکوز"),
  opt("100% Rayon", "100% Rayon", "100% رايون", "100% ریون"),
  opt("100% Acrylic", "100% Acrylic", "100% أكريليك", "100% اکریلیک"),
  opt("100% Nylon", "100% Nylon", "100% نايلون", "100% نایلون"),
  opt("60% Cotton 40% Polyester", "60% Cotton 40% Polyester", "60% قطن 40% بوليستر", "60% پنبه 40% پلی‌استر"),
  opt("55% Linen 45% Cotton", "55% Linen 45% Cotton", "55% كتان 45% قطن", "55% کتان 45% پنبه"),
  opt("97% Cotton 3% Elastane", "97% Cotton 3% Elastane", "97% قطن 3% إيلاستين", "97% پنبه 3% الاستان"),
  opt("80% Polyester 20% Cotton", "80% Polyester 20% Cotton", "80% بوليستر 20% قطن", "80% پلی‌استر 20% پنبه"),
];

export const COLORS = [
  opt("White", "White", "أبيض", "سفید"),
  opt("Black", "Black", "أسود", "مشکی"),
  opt("Beige", "Beige", "بيج", "بژ"),
  opt("Cream", "Cream", "كريمي", "کرم"),
  opt("Red", "Red", "أحمر", "قرمز"),
  opt("Maroon", "Maroon", "عنابي", "زرشکی"),
  opt("Blue", "Blue", "أزرق", "آبی"),
  opt("Navy", "Navy", "كحلي", "سرمه‌ای"),
  opt("Green", "Green", "أخضر", "سبز"),
  opt("Olive", "Olive", "زيتي", "زیتونی"),
  opt("Yellow", "Yellow", "أصفر", "زرد"),
  opt("Mustard", "Mustard", "خردلي", "خردلی"),
  opt("Silver", "Silver", "فضي", "نقره‌ای"),
  opt("Pink", "Pink", "وردي", "صورتی"),
  opt("Purple", "Purple", "بنفسجي", "بنفش"),
  opt("Brown", "Brown", "بني", "قهوه‌ای"),
  opt("Grey", "Grey", "رمادي", "خاکستری"),
  opt("Multi", "Multi Color", "متعدد الألوان", "چندرنگ"),
  opt("Orange", "Orange", "برتقالي", "نارنجی"),
  opt("Gold", "Gold", "ذهبي", "طلایی"),
  opt("Turquoise", "Turquoise", "فيروزي", "فیروزه‌ای"),
  opt("Teal", "Teal", "أزرق مخضر", "سبزآبی"),
  opt("Sky Blue", "Sky Blue", "أزرق سماوي", "آبی آسمانی"),
  opt("Baby Pink", "Baby Pink", "وردي فاتح", "صورتی روشن"),
  opt("Lavender", "Lavender", "لافندر", "یاسی"),
  opt("Magenta", "Magenta", "أرجواني", "سرخابی"),
  opt("Coral", "Coral", "مرجاني", "مرجانی"),
  opt("Ivory", "Ivory", "عاجي", "استخوانی"),
  opt("Burgundy", "Burgundy", "نبيذي داكن", "بوردو"),
  opt("Bronze", "Bronze", "برونزي", "برنزی"),
  opt("Khaki", "Khaki", "كاكي", "خاکی"),
  opt("Peach", "Peach", "خوخي", "هلویی"),
  opt("Mint", "Mint", "نعناعي", "نعنایی"),
];

export const UNITS = [
  { value: "meter", label: "Meter", labelAr: "متر", labelFa: "متر", short: "m" },
  { value: "roll", label: "Roll", labelAr: "طاقة", labelFa: "طاقه", short: "roll" },
];

export const COUNTRIES = [
  opt("Kuwait", "Kuwait", "الكويت", "کویت"),
  opt("Saudi Arabia", "Saudi Arabia", "السعودية", "عربستان"),
  opt("UAE", "UAE", "الإمارات", "امارات"),
  opt("Bahrain", "Bahrain", "البحرين", "بحرین"),
  opt("Qatar", "Qatar", "قطر", "قطر"),
  opt("Oman", "Oman", "عمان", "عمان"),
  opt("China", "China", "الصين", "چین"),
  opt("India", "India", "الهند", "هند"),
  opt("Turkey", "Turkey", "تركيا", "ترکیه"),
  opt("Italy", "Italy", "إيطاليا", "ایتالیا"),
  opt("Korea", "South Korea", "كوريا الجنوبية", "کره جنوبی"),
  opt("Other", "Other", "أخرى", "سایر"),
];

export const optionLabel = (option, language) => {
  if (!option) return "";
  if (language === "fa") return option.labelFa || option.label;
  if (language === "ar") return option.labelAr || option.label;
  return option.label;
};

export const optionValue = (options, input) => {
  const value = String(input ?? "").trim();
  if (!value) return "";
  const match = options.find(
    (option) =>
      option.value === value ||
      option.label === value ||
      option.labelAr === value ||
      option.labelFa === value,
  );
  return match ? match.value : value;
};


const wordLookup = new Map();

[...FABRIC_TYPES, ...PATTERNS, ...COLORS].forEach((option) => {
  [option.value, option.label].forEach((key) => {
    if (!key) return;
    const normalized = key.toLowerCase();
    if (!wordLookup.has(normalized)) wordLookup.set(normalized, option);
  });
});

export const localizedOption = (options, value, language) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (language === "en") return raw;
  const match = options.find(
    (option) =>
      option.value === raw ||
      option.label === raw ||
      option.labelAr === raw ||
      option.labelFa === raw,
  );
  return match ? optionLabel(match, language) : raw;
};

export const localizeWords = (text, language) => {
  const raw = String(text ?? "").trim();
  if (!raw || language === "en") return raw;
  return raw
    .split(/(\s+)/)
    .map((token) => {
      if (!token.trim()) return token;
      const option = wordLookup.get(token.trim().toLowerCase());
      return option ? optionLabel(option, language) : token;
    })
    .join("");
};

export const localizeItemName = (text, language) => {
  const raw = String(text ?? "").trim();
  if (!raw || language === "en") return raw;
  const tokens = raw.split(/\s+/).filter(Boolean);
  const mapped = tokens.map((token) => {
    const option = wordLookup.get(token.toLowerCase());
    return option ? optionLabel(option, language) : null;
  });
  if (mapped.some((part) => part === null)) return raw;
  return mapped.join(" ");
};

export const getSubcategories = (fabricType) => {
  if (!fabricType) return [];
  return PATTERNS;
};

export const formatMeters = (value) => {
  const n = parseFloat(normalizeToLatinDigits(String(value ?? "")));
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
};

export const unitShort = (unit) =>
  UNITS.find((u) => u.value === unit)?.short || unit || "m";

export const getTotalStockMeters = (item) => {
  const length = parseFloat(item?.length_m ?? item?.meters) || 0;
  const qty = Math.max(1, parseInt(item?.quantity, 10) || 1);
  return Math.round(length * qty * 1000) / 1000;
};

export const getRollBreakdown = (item) => {
  const totalMeters = getTotalStockMeters(item);
  const rollLength = parseFloat(item?.roll_length_m) || 0;
  if (item?.unit !== "roll" || rollLength <= 0) {
    return { totalMeters, rollLength: 0, fullRolls: 0, remainderMeters: 0 };
  }
  const fullRolls = Math.floor((totalMeters + 0.0001) / rollLength);
  const remainderMeters = Math.max(
    0,
    Math.round((totalMeters - fullRolls * rollLength) * 1000) / 1000,
  );
  return { totalMeters, rollLength, fullRolls, remainderMeters };
};
