/**
 * Production-grade structured JSON logger utility for centralized log aggregation.
 */

function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "***";
  const name = parts[0] ?? "";
  const domain = parts[1] ?? "";
  const maskedName = name.length > 2 ? `${name.slice(0, 2)}***` : "***";
  return `${maskedName}@${domain}`;
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    const logData = {
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(logData));
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    const logData = {
      level: "WARN",
      timestamp: new Date().toISOString(),
      message,
      ...meta,
    };
    console.warn(JSON.stringify(logData));
  },

  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
    const logData = {
      level: "ERROR",
      timestamp: new Date().toISOString(),
      message,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      ...meta,
    };
    console.error(JSON.stringify(logData));
  },

  /**
   * Masks sensitive fields like user emails/names for GDPR compliance.
   */
  maskPayload: (payload: Record<string, unknown>): Record<string, unknown> => {
    const masked = { ...payload };
    if (typeof masked["email"] === "string") {
      masked["email"] = maskEmail(masked["email"]);
    }
    if (typeof masked["fullName"] === "string") {
      masked["fullName"] = `${masked["fullName"].split(" ")[0] ?? ""}***`;
    }
    if (typeof masked["name"] === "string") {
      masked["name"] = `${masked["name"].split(" ")[0] ?? ""}***`;
    }
    return masked;
  }
};
