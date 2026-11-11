import { normalizeToLatinDigits } from "./normalizeNumbers.js";

const opt = (value, label, labelAr) => ({ value, label, labelAr });

export const FABRIC_TYPES = [
  opt("Cotton", "Cotton", "قطن"),
  opt("Silk", "Silk", "حرير"),
  opt("Wool", "Wool", "صوف"),
  opt("Linen", "Linen", "كتان"),
  opt("Polyester", "Polyester", "بوليستر"),
  opt("Viscose", "Viscose", "فيسكوز"),
  opt("Chiffon", "Chiffon", "شيفون"),
  opt("Crepe", "Crepe", "كريب"),
  opt("Satin", "Satin", "ساتان"),
  opt("Velvet", "Velvet", "مخمل"),
  opt("Lace", "Lace", "دانتيل"),
  opt("Denim", "Denim", "جينز"),
  opt("Jersey", "Jersey", "جيرسي"),
  opt("Organza", "Organza", "أورجانزا"),
  opt("Tulle", "Tulle", "تول"),
  opt("Kashmir", "Kashmir", "كشمير"),
];

export const PATTERNS = [
  opt("Plain", "Plain", "سادة"),
  opt("Floral", "Floral", "زهري"),
  opt("Striped", "Striped", "مخطط"),
  opt("Checkered", "Checkered", "كاروهات"),
  opt("Polka Dot", "Polka Dot", "منقط"),
  opt("Geometric", "Geometric", "هندسي"),
  opt("Embroidered", "Embroidered", "مطرز"),
  opt("Printed", "Printed", "مطبوع"),
  opt("Jacquard", "Jacquard", "جاكار"),
  opt("Paisley", "Paisley", "بيسلي"),
];

export const COMPOSITIONS = [
  opt("100% Cotton", "100% Cotton", "100% قطن"),
  opt("100% Silk", "100% Silk", "100% حرير"),
  opt("100% Wool", "100% Wool", "100% صوف"),
  opt("100% Polyester", "100% Polyester", "100% بوليستر"),
  opt("50% Cotton 50% Polyester", "50% Cotton 50% Polyester", "50% قطن 50% بوليستر"),
  opt("70% Polyester 30% Viscose", "70% Polyester 30% Viscose", "70% بوليستر 30% فيسكوز"),
  opt("95% Cotton 5% Elastane", "95% Cotton 5% Elastane", "95% قطن 5% إيلاستين"),
];

export const COLORS = [
  opt("White", "White", "أبيض"),
  opt("Black", "Black", "أسود"),
  opt("Beige", "Beige", "بيج"),
  opt("Cream", "Cream", "كريمي"),
  opt("Red", "Red", "أحمر"),
  opt("Maroon", "Maroon", "عنابي"),
  opt("Blue", "Blue", "أزرق"),
  opt("Navy", "Navy", "كحلي"),
  opt("Green", "Green", "أخضر"),
  opt("Olive", "Olive", "زيتي"),
  opt("Yellow", "Yellow", "أصفر"),
  opt("Mustard", "Mustard", "خردلي"),
  opt("Silver", "Silver", "فضي"),
  opt("Pink", "Pink", "وردي"),
  opt("Purple", "Purple", "بنفسجي"),
  opt("Brown", "Brown", "بني"),
  opt("Grey", "Grey", "رمادي"),
  opt("Multi", "Multi Color", "متعدد الألوان"),
];

export const UNITS = [
  { value: "meter", label: "Meter", labelAr: "متر", short: "m" },
  { value: "roll", label: "Roll", labelAr: "طاقة", short: "roll" },
  { value: "piece", label: "Piece", labelAr: "قطعة", short: "pc" },
];

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
