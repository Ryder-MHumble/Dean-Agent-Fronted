import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAccessCurl,
  buildAccessPrompt,
  getIntelligenceAccessConfig,
} from "../lib/intelligence-access.ts";

test("buildAccessCurl creates the daily briefing request used by the homepage", () => {
  const config = getIntelligenceAccessConfig("home");
  const curl = buildAccessCurl(config, "https://api.example.com/");

  assert.equal(
    curl,
    "curl -sS 'https://api.example.com/api/intel/daily-briefing/report' -H 'accept: application/json'",
  );
});

test("buildAccessCurl includes both technology frontier feed requests", () => {
  const config = getIntelligenceAccessConfig("tech-frontier");
  const curl = buildAccessCurl(config, "https://api.example.com");

  assert.equal(
    curl,
    [
      "curl -sS 'https://api.example.com/api/social-posts?sort_by=published_at&order=desc&page=1&page_size=200&platform=x' -H 'accept: application/json'",
      "curl -sS 'https://api.example.com/api/social-posts?sort_by=published_at&order=desc&page=1&page_size=200&platform=wechat_mp&source_category=%E5%89%8D%E6%B2%BF%E8%AE%A4%E7%9F%A5' -H 'accept: application/json'",
    ].join("\n"),
  );
});

test("buildAccessCurl uses the actual university and sentiment page parameters", () => {
  const universityCurl = buildAccessCurl(
    getIntelligenceAccessConfig("university-eco"),
    "https://api.example.com",
  );
  const sentimentCurl = buildAccessCurl(
    getIntelligenceAccessConfig("sentiment"),
    "https://api.example.com",
  );

  assert.match(universityCurl, /\/api\/intel\/university\/feed\?page=1&page_size=20/);
  assert.match(universityCurl, /\/api\/intel\/university\/overview/);
  assert.match(sentimentCurl, /\/api\/sentiment\/overview/);
  assert.match(sentimentCurl, /\/api\/sentiment\/feed\?sort_by=publish_time&sort_order=desc&page=1&page_size=15/);
  assert.doesNotMatch(universityCurl, /limit=50|offset=0/);
  assert.doesNotMatch(sentimentCurl, /limit=50|offset=0/);
});

test("buildAccessPrompt gives an agent the page's real data boundaries", () => {
  const config = getIntelligenceAccessConfig("tech-frontier");
  const prompt = buildAccessPrompt(config, "https://api.example.com");

  assert.match(prompt, /情报引擎/);
  assert.match(prompt, /专项提取/);
  assert.match(prompt, /X 平台和微信公众号/);
  assert.match(prompt, /https:\/\/api\.example\.com\/api\/social-posts\?sort_by=published_at/);
  assert.match(prompt, /source_category=%E5%89%8D%E6%B2%BF%E8%AE%A4%E7%9F%A5/);
});

test("paper and internal pages expose their current data boundaries", () => {
  const papersCurl = buildAccessCurl(
    getIntelligenceAccessConfig("papers"),
    "https://api.example.com",
  );
  const achievementsCurl = buildAccessCurl(
    getIntelligenceAccessConfig("academic-achievements"),
    "https://api.example.com",
  );
  const expertsCurl = buildAccessCurl(
    getIntelligenceAccessConfig("internal-experts"),
    "https://api.example.com",
  );

  assert.match(
    papersCurl,
    /\/api\/papers\?page=1&page_size=20&sort_by=publication_date&order=desc/,
  );
  assert.match(
    achievementsCurl,
    /\/api\/zgca-achievements\/\?page=1&page_size=20&sort_by=venue_year&sort_order=desc/,
  );
  assert.match(expertsCurl, /\/api\/scholars\?limit=20&offset=0/);
});
