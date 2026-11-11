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
];

export const COMPOSITIONS = [
  opt("100% Cotton", "100% Cotton", "100% قطن", "100% پنبه"),
  opt("100% Silk", "100% Silk", "100% حرير", "100% ابریشم"),
  opt("100% Wool", "100% Wool", "100% صوف", "100% پشم"),
  opt("100% Polyester", "100% Polyester", "100% بوليستر", "100% پلی‌استر"),
  opt("50% Cotton 50% Polyester", "50% Cotton 50% Polyester", "50% قطن 50% بوليستر", "50% پنبه 50% پلی‌استر"),
  opt("70% Polyester 30% Viscose", "70% Polyester 30% Viscose", "70% بوليستر 30% فيسكوز", "70% پلی‌استر 30% ویسکوز"),
  opt("95% Cotton 5% Elastane", "95% Cotton 5% Elastane", "95% قطن 5% إيلاستين", "95% پنبه 5% الاستان"),
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
];

export const UNITS = [
  { value: "meter", label: "Meter", labelAr: "متر", labelFa: "متر", short: "m" },
  { value: "roll", label: "Roll", labelAr: "طاقة", labelFa: "طاقه", short: "roll" },
  { value: "piece", label: "Piece", labelAr: "قطعة", labelFa: "عدد", short: "pc" },
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
