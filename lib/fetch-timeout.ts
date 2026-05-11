type Fetcher = typeof fetch;

interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
  fetcher?: Fetcher;
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  { timeoutMs = 8000, fetcher = fetch, signal, ...init }: FetchWithTimeoutOptions = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  try {
    return await fetcher(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}
