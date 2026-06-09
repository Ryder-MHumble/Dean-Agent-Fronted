type Fetcher = typeof fetch;

interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
  fetcher?: Fetcher;
}

interface FetchJsonWithRetryOptions extends FetchWithTimeoutOptions {
  retries?: number;
  retryDelayMs?: number;
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

export async function fetchJsonWithRetry<T>(
  input: RequestInfo | URL,
  {
    retries = 1,
    retryDelayMs = 250,
    ...options
  }: FetchJsonWithRetryOptions = {},
): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const res = await fetchWithTimeout(input, options);
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      if (attempt >= retries) return null;
      if (retryDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  return null;
}
