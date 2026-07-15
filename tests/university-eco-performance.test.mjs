import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readSource(path) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

const peerDynamicsSource = readSource(
  "../components/modules/university-eco/peer-dynamics.tsx",
);
const universityFeedHookSource = readSource("../hooks/use-university-feed.ts");

test("university ecosystem opens on the university-news feed by default", () => {
  assert.match(
    peerDynamicsSource,
    /useState<FilterTag>\("university_news"\)/,
  );
});

test("university ecosystem cards do not prefetch article details for covers", () => {
  assert.doesNotMatch(peerDynamicsSource, /hydrateCardCovers/);
  assert.doesNotMatch(peerDynamicsSource, /coverLoadingIdsRef/);
});

test("university feed loading is not blocked by overview and source metadata", () => {
  assert.doesNotMatch(
    universityFeedHookSource,
    /const \[feedData, overviewData, sourcesData\] = await Promise\.all/,
  );
  assert.match(universityFeedHookSource, /setIsLoading\(false\)/);
});
