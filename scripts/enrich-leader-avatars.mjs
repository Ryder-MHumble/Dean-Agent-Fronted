import { execFile } from "node:child_process";
import { readFile, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.1.132.21:8001"
).replace(/\/+$/, "");
const OUTPUT_PATH = fileURLToPath(
  new URL("../lib/generated/leader-avatars.json", import.meta.url),
);
const USER_AGENT =
  "Mozilla/5.0 (compatible; IntelligenceEngineAvatarEnricher/1.0)";

export function readConcurrency(argv = process.argv.slice(2), env = process.env) {
  const inline = argv.find((value) => value.startsWith("--concurrency="));
  const optionIndex = argv.indexOf("--concurrency");
  const raw = inline?.slice("--concurrency=".length) ||
    (optionIndex >= 0 ? argv[optionIndex + 1] : "") ||
    env.AVATAR_CONCURRENCY ||
    "8";
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? Math.min(32, Math.max(1, parsed)) : 8;
}

function wait(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function withRetries(
  operation,
  { attempts = 2, delayMs = 300 } = {},
) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < attempts && delayMs > 0) await wait(delayMs * attempt);
    }
  }
  throw lastError;
}

function isHttpUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function uniqueHttpUrls(values) {
  return [...new Set(values.filter(isHttpUrl))];
}

export function isGenericImageUrl(value) {
  if (!isHttpUrl(value)) return true;
  return /(?:logo|icon|default|qrcode|qr_code|wechat|share|zhuangshi)[._/-]|\/images\/(?:150\.jpg|i-down\d*\.png)(?:\?|$)/i.test(
    value,
  );
}

export function shouldEnrichAvatarRecord(
  record,
  { retryErrors = false, retryOfficial = false } = {},
) {
  return (
    !record ||
    (record.status === "found" &&
      Boolean(record.avatarUrl) &&
      isGenericImageUrl(record.avatarUrl)) ||
    (retryErrors && record.status === "search_error") ||
    (retryOfficial && record.sourceType === "official")
  );
}

export function extractExaCandidateUrls(payload) {
  const text = Array.isArray(payload?.content)
    ? payload.content
        .filter((item) => item?.type === "text" && typeof item.text === "string")
        .map((item) => item.text)
        .join("\n")
    : "";
  const urls = [];
  for (const match of text.matchAll(/^URL:\s*(https?:\/\/\S+)/gm)) {
    urls.push(match[1].replace(/[),.;]+$/, ""));
  }
  return uniqueHttpUrls(urls);
}

export function summarizeAvatarRecords(leaders, records) {
  const leaderIds = new Set(leaders.map((leader) => leader.id));
  const recordIds = Object.keys(records);
  const values = recordIds.map((id) => records[id]);
  const missingIds = [...leaderIds].filter((id) => !(id in records));
  const extraIds = recordIds.filter((id) => !leaderIds.has(id));

  return {
    apiTotal: leaders.length,
    snapshotCount: recordIds.length,
    found: values.filter((record) => record?.status === "found").length,
    notFound: values.filter((record) => record?.status === "not_found").length,
    searchError: values.filter((record) => record?.status === "search_error")
      .length,
    rejected: values.reduce(
      (total, record) => total + (record?.rejectedCandidates || 0),
      0,
    ),
    missingIds,
    extraIds,
    coverageComplete: missingIds.length === 0 && extraIds.length === 0,
  };
}

async function fetchResponse(url, init = {}, timeoutMs = 15000) {
  return withRetries(
    async () => {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.status === 429 || response.status >= 500) {
        await response.body?.cancel();
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response;
    },
    { attempts: 2, delayMs: 300 },
  );
}

async function fetchJson(url, timeoutMs = 15000) {
  const response = await fetchResponse(
    url,
    { headers: { "User-Agent": USER_AGENT } },
    timeoutMs,
  );
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchAllLeaders() {
  const leaders = [];
  let offset = 0;
  let apiTotal = null;

  while (true) {
    const url = `${API_BASE}/api/leaders?limit=200&offset=${offset}`;
    const page = await fetchJson(url, 30000);
    if (!Array.isArray(page.items)) {
      throw new Error(`Invalid leaders response at offset ${offset}`);
    }
    apiTotal = page.total;
    leaders.push(...page.items);
    if (!page.has_more) break;
    offset = page.next_offset ?? offset + page.items.length;
    if (page.items.length === 0) {
      throw new Error("Leaders API returned an empty page with has_more=true");
    }
  }

  if (apiTotal !== leaders.length) {
    throw new Error(
      `Leaders API total ${apiTotal} does not match fetched count ${leaders.length}`,
    );
  }
  return leaders;
}

async function loadRecords() {
  try {
    const parsed = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (error) {
    if (error?.code === "ENOENT") return {};
    throw error;
  }
}

function orderedRecords(leaders, records) {
  return Object.fromEntries(
    leaders
      .filter((leader) => records[leader.id])
      .map((leader) => [leader.id, records[leader.id]]),
  );
}

async function writeRecords(leaders, records) {
  const temporaryPath = `${OUTPUT_PATH}.tmp`;
  const content = `${JSON.stringify(orderedRecords(leaders, records), null, 2)}\n`;
  await writeFile(temporaryPath, content, "utf8");
  await rename(temporaryPath, OUTPUT_PATH);
}

async function validateImageUrl(url) {
  if (!isHttpUrl(url) || isGenericImageUrl(url)) return null;
  const request = async (method) => {
    const response = await fetchResponse(
      url,
      {
        method,
        redirect: "follow",
        headers: {
          "User-Agent": USER_AGENT,
          ...(method === "GET" ? { Range: "bytes=0-2047" } : {}),
        },
      },
      12000,
    );
    const contentType = response.headers.get("content-type") || "";
    const valid = response.ok && contentType.toLowerCase().startsWith("image/");
    await response.body?.cancel();
    return valid && isHttpUrl(response.url) ? response.url : null;
  };

  try {
    const headResult = await request("HEAD");
    if (headResult) return headResult;
  } catch {
    // Some image hosts reject HEAD; retry with a ranged GET.
  }
  try {
    return await request("GET");
  } catch {
    return null;
  }
}

function backendAvatar(leader) {
  const value = leader?.leader_details?.media?.avatar_url;
  return typeof value === "string" ? value.trim() : "";
}

async function findScholarAvatar(leader, attemptedSourceUrls) {
  const queryUrl = `${API_BASE}/api/scholars?keyword=${encodeURIComponent(leader.name)}&page=1&page_size=20`;
  attemptedSourceUrls.push(queryUrl);
  const response = await fetchJson(queryUrl);
  const scholar = response.items?.find(
    (item) =>
      typeof item?.name === "string" && item.name.trim() === leader.name.trim(),
  );
  if (!scholar || !isHttpUrl(scholar.photo_url)) return null;
  const avatarUrl = await validateImageUrl(scholar.photo_url);
  if (!avatarUrl) return { rejected: true };
  return {
    avatarUrl,
    sourceUrl: isHttpUrl(scholar.profile_url)
      ? scholar.profile_url
      : scholar.photo_url,
  };
}

async function searchWithExa(leader) {
  const organization = String(leader.current_orgs || "").trim();
  const query = `${leader.name} ${organization} 头像 官方`.replace(/\s+/g, " ");
  const { stdout } = await withRetries(
    () =>
      execFileAsync(
        "mcporter",
        [
          "call",
          "exa.web_search_exa",
          "--args",
          JSON.stringify({ query, numResults: 3 }),
          "--output",
          "json",
        ],
        { cwd: "/tmp", maxBuffer: 4 * 1024 * 1024, timeout: 60000 },
      ),
    { attempts: 2, delayMs: 500 },
  );
  return JSON.parse(stdout);
}

function isWikipediaPage(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "zh.wikipedia.org" && parsed.pathname.startsWith("/wiki/");
  } catch {
    return false;
  }
}

async function getWikimediaImage(pageUrl) {
  const parsed = new URL(pageUrl);
  const title = decodeURIComponent(parsed.pathname.slice("/wiki/".length));
  const apiUrl = new URL("https://zh.wikipedia.org/w/api.php");
  apiUrl.search = new URLSearchParams({
    action: "query",
    prop: "pageimages",
    piprop: "original|thumbnail",
    pithumbsize: "600",
    redirects: "1",
    format: "json",
    origin: "*",
    titles: title,
  });
  const response = await fetchJson(apiUrl.toString());
  const page = Object.values(response.query?.pages || {})[0];
  const imageUrl = page?.original?.source || page?.thumbnail?.source;
  return isHttpUrl(imageUrl) ? imageUrl : null;
}

function isOfficialPage(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return /(?:^|\.)(?:gov\.cn|edu\.cn|ac\.cn|cas\.cn|cae\.cn|org\.cn)$/.test(
      hostname,
    );
  } catch {
    return false;
  }
}

async function readLimitedHtml(response, maxBytes = 512 * 1024) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  while (total < maxBytes) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    text += decoder.decode(value, { stream: true });
  }
  await reader.cancel();
  return text + decoder.decode();
}

function htmlAttribute(tag, name) {
  const match = tag.match(
    new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"),
  );
  return match?.[1] || "";
}

function extractOpenGraphImage(html, pageUrl) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const property = (
      htmlAttribute(tag, "property") || htmlAttribute(tag, "name")
    ).toLowerCase();
    if (property !== "og:image" && property !== "twitter:image") continue;
    const content = htmlAttribute(tag, "content");
    if (!content) continue;
    const resolved = new URL(content, pageUrl).toString();
    if (!isGenericImageUrl(resolved)) {
      return resolved;
    }
  }
  return null;
}

async function getOfficialPageImage(pageUrl, leaderName) {
  const response = await fetchResponse(
    pageUrl,
    { redirect: "follow", headers: { "User-Agent": USER_AGENT } },
    15000,
  );
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok || !contentType.toLowerCase().includes("text/html")) {
    await response.body?.cancel();
    return null;
  }
  const html = await readLimitedHtml(response);
  if (!html.includes(leaderName)) return null;
  return extractOpenGraphImage(html, response.url || pageUrl);
}

function baseRecord(leader, attemptedSourceUrls, rejectedCandidates) {
  return {
    leaderId: leader.id,
    name: leader.name,
    avatarUrl: null,
    sourceUrl: null,
    status: "not_found",
    sourceType: null,
    attemptedSourceUrls: uniqueHttpUrls(attemptedSourceUrls),
    rejectedCandidates,
  };
}

async function enrichLeader(leader) {
  const attemptedSourceUrls = [];
  let rejectedCandidates = 0;
  const existingAvatar = backendAvatar(leader);
  if (existingAvatar) {
    attemptedSourceUrls.push(existingAvatar);
    const avatarUrl = await validateImageUrl(existingAvatar);
    if (avatarUrl) {
      return {
        ...baseRecord(leader, attemptedSourceUrls, rejectedCandidates),
        avatarUrl,
        sourceUrl: existingAvatar,
        status: "found",
        sourceType: "backend",
      };
    }
    rejectedCandidates += 1;
  }

  try {
    const scholar = await findScholarAvatar(leader, attemptedSourceUrls);
    if (scholar?.rejected) rejectedCandidates += 1;
    if (scholar?.avatarUrl) {
      attemptedSourceUrls.push(scholar.sourceUrl, scholar.avatarUrl);
      return {
        ...baseRecord(leader, attemptedSourceUrls, rejectedCandidates),
        avatarUrl: scholar.avatarUrl,
        sourceUrl: scholar.sourceUrl,
        status: "found",
        sourceType: "scholar",
      };
    }
  } catch (error) {
    rejectedCandidates += 1;
    console.error(`[scholar] ${leader.name}: ${error.message}`);
  }

  let searchResult;
  try {
    searchResult = await searchWithExa(leader);
  } catch (error) {
    return {
      ...baseRecord(leader, attemptedSourceUrls, rejectedCandidates),
      status: "search_error",
      error: error.message,
    };
  }

  const candidateUrls = extractExaCandidateUrls(searchResult);
  attemptedSourceUrls.push(...candidateUrls);
  for (const pageUrl of candidateUrls) {
    try {
      let imageUrl = null;
      let sourceType = null;
      if (isWikipediaPage(pageUrl)) {
        imageUrl = await getWikimediaImage(pageUrl);
        sourceType = "wikimedia";
      } else if (isOfficialPage(pageUrl)) {
        imageUrl = await getOfficialPageImage(pageUrl, leader.name);
        sourceType = "official";
      }
      if (!imageUrl) {
        rejectedCandidates += 1;
        continue;
      }
      const avatarUrl = await validateImageUrl(imageUrl);
      if (!avatarUrl) {
        rejectedCandidates += 1;
        continue;
      }
      attemptedSourceUrls.push(imageUrl);
      return {
        ...baseRecord(leader, attemptedSourceUrls, rejectedCandidates),
        avatarUrl,
        sourceUrl: pageUrl,
        status: "found",
        sourceType,
      };
    } catch {
      rejectedCandidates += 1;
    }
  }

  return baseRecord(leader, attemptedSourceUrls, rejectedCandidates);
}

async function main() {
  const leaders = await fetchAllLeaders();
  const records = await loadRecords();
  const concurrency = readConcurrency();
  const retryErrors = process.argv.includes("--retry-errors");
  const retryOfficial = process.argv.includes("--retry-official");
  const unresolved = leaders.filter((leader) =>
    shouldEnrichAvatarRecord(records[leader.id], {
      retryErrors,
      retryOfficial,
    }),
  );
  console.error(
    `Fetched ${leaders.length} leaders; ${unresolved.length} require enrichment at concurrency ${concurrency}.`,
  );

  for (let index = 0; index < unresolved.length; index += concurrency) {
    const batch = unresolved.slice(index, index + concurrency);
    const results = await Promise.all(
      batch.map(async (leader) => {
        try {
          return await enrichLeader(leader);
        } catch (error) {
          return {
            ...baseRecord(leader, [], 0),
            status: "search_error",
            error: error.message,
          };
        }
      }),
    );
    for (const record of results) records[record.leaderId] = record;
    await writeRecords(leaders, records);
    console.error(
      `Processed ${Math.min(index + batch.length, unresolved.length)}/${unresolved.length}`,
    );
  }

  const summary = summarizeAvatarRecords(leaders, records);
  if (!summary.coverageComplete || summary.snapshotCount !== leaders.length) {
    throw new Error(`Incomplete avatar coverage: ${JSON.stringify(summary)}`);
  }
  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
