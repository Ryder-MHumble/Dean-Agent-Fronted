import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readSource(path) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

const peerDynamicsSource = readSource(
  "../components/modules/university-eco/peer-dynamics.tsx",
);
const researchTrackingSource = readSource(
  "../components/modules/university-eco/research-tracking.tsx",
);
const universityModuleSource = readSource(
  "../components/modules/university-eco/index.tsx",
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

test("university tabs stay controlled and open on peer dynamics", () => {
  assert.match(
    universityModuleSource,
    /useState(?:<[^>]+>)?\(["']peers["']\)/,
  );
  assert.match(universityModuleSource, /value=\{activeTab\}/);
  assert.match(universityModuleSource, /onValueChange=\{setActiveTab\}/);
});

test("university source filters support pointer and keyboard access", () => {
  for (const source of [peerDynamicsSource, researchTrackingSource]) {
    assert.match(source, /aria-expanded=\{sourceDropdownOpen\}/);
    assert.match(source, /aria-controls=/);
    assert.match(source, /onClick=/);
    assert.match(source, /onFocus=/);
    assert.match(source, /onBlur=/);
  }
});

test("university toolbars remain visible while list data loads", () => {
  for (const source of [peerDynamicsSource, researchTrackingSource]) {
    assert.doesNotMatch(
      source,
      /if \(isLoading[^)]*\)[\s\S]{0,120}return <Skeleton/,
    );
    assert.ok(source.indexOf("<IntelligenceToolbar") >= 0);
    assert.ok(
      source.indexOf("<IntelligenceToolbar") <
        source.indexOf("<IntelligenceWorkspace"),
    );
    assert.ok(source.indexOf("<Skeleton") > source.indexOf("<IntelligenceWorkspace"));
  }
});
