interface RateLimitConfig {
  limit: number;     // Maximum requests in the window
  windowMs: number;  // Window duration in milliseconds
}

// In-memory store for rate limiting IP timestamps
// In a highly scaled production server, you would use Redis instead of memoryStore
const memoryStore = new Map<string, number[]>();

// Cleanup stale IPs periodically to prevent memory leaks
if (typeof globalThis !== "undefined") {
  const globalIntervals = globalThis as unknown as { rateLimitCleanupSet: boolean };
  if (!globalIntervals.rateLimitCleanupSet) {
    setInterval(() => {
      const now = Date.now();
      for (const [ip, timestamps] of memoryStore.entries()) {
        const active = timestamps.filter((time) => now - time < 3600000); // 1 hour max window cache
        if (active.length === 0) {
          memoryStore.delete(ip);
        } else {
          memoryStore.set(ip, active);
        }
      }
    }, 600000); // Clean every 10 minutes
    globalIntervals.rateLimitCleanupSet = true;
  }
}

/**
 * Reusable Rate Limiter
 * Returns true if request is rate limited, false otherwise.
 */
export function isRateLimited(ip: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const timestamps = memoryStore.get(ip) ?? [];

  // Filter timestamps within the current window
  const validTimestamps = timestamps.filter((time) => now - time < config.windowMs);

  if (validTimestamps.length >= config.limit) {
    return true;
  }

  validTimestamps.push(now);
  memoryStore.set(ip, validTimestamps);
  return false;
}
