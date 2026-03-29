import { RATE_LIMIT } from "./config.js";

let lastRequestTime = 0;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPage(url: string): Promise<string> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT.delayBetweenRequests) {
    await delay(RATE_LIMIT.delayBetweenRequests - elapsed);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RATE_LIMIT.maxRetries; attempt++) {
    try {
      lastRequestTime = Date.now();
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ja,en;q=0.9",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `  Retry ${attempt + 1}/${RATE_LIMIT.maxRetries}: ${(error as Error).message}`
      );
      await delay(RATE_LIMIT.retryDelay * (attempt + 1));
    }
  }

  throw lastError!;
}
