export function normalizeToLatinDigits(str) {
  if (str == null || typeof str !== "string")
    return str === null || str === undefined ? "" : String(str);

  const latin = "0123456789";
  return str
    .replace(/[٠-٩]/g, (d) => latin["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
    .replace(/[۰-۹]/g, (d) => latin["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
}
