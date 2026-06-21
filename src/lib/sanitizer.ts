/**
 * Reusable utility to sanitize input text and protect against cross-site scripting (XSS).
 */
export function sanitizeString(val: string): string {
  if (!val) return "";
  
  return val
    .replace(/<[^>]*>/g, "") // Strip HTML tags entirely
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Sanitizes an object (e.g. parsed request body) by cleaning all string fields.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];
      if (typeof value === "string") {
        (result as Record<string, unknown>)[key] = sanitizeString(value);
      }
    }
  }
  return result;
}
