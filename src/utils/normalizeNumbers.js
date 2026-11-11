/**
 * Normalize Arabic-Indic (٠١٢٣٤٥٦٧٨٩) and Persian/Extended (۰۱۲۳۴۵۶۷۸۹)
 * digits to Latin (0-9) so parseInt/parseFloat and [0-9] regex work correctly.
 * Use before saving or before any numeric calculation/validation.
 *
 * @param {string} str - User input that may contain Arabic/Persian digits
 * @returns {string} - Same string with digits converted to Latin 0-9
 */
export function normalizeToLatinDigits(str) {
  if (str == null || typeof str !== "string")
    return str === null || str === undefined ? "" : String(str);

  const latin = "0123456789";
  return str
    .replace(/[٠-٩]/g, (d) => latin["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
    .replace(/[۰-۹]/g, (d) => latin["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
}
