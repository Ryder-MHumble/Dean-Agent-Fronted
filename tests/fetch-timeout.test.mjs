import test from "node:test";
import assert from "node:assert/strict";

import { fetchJsonWithRetry, fetchWithTimeout } from "../lib/fetch-timeout.ts";

test("fetchWithTimeout aborts a request that does not resolve before timeout", async () => {
  let aborted = false;
  const fetcher = (_url, init = {}) =>
    new Promise((_resolve, reject) => {
      init.signal?.addEventListener("abort", () => {
        aborted = true;
        reject(new DOMException("The operation was aborted.", "AbortError"));
      });
    });

  await assert.rejects(
    fetchWithTimeout("http://example.test/report", {
      timeoutMs: 10,
      fetcher,
    }),
    /aborted/i,
  );
  assert.equal(aborted, true);
});

test("fetchWithTimeout forwards successful responses", async () => {
  const response = new Response(JSON.stringify({ ok: true }), {
    status: 200,
  });
  const result = await fetchWithTimeout("http://example.test/report", {
    timeoutMs: 100,
    fetcher: async () => response,
  });

  assert.equal(result, response);
});

test("fetchJsonWithRetry retries once after a failed fetch", async () => {
  let attempts = 0;
  const data = await fetchJsonWithRetry(
    "http://example.test/feed",
    {
      retryDelayMs: 0,
      fetcher: async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new TypeError("empty response");
        }
        return new Response(JSON.stringify({ total: 20 }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  );

  assert.equal(attempts, 2);
  assert.deepEqual(data, { total: 20 });
});
