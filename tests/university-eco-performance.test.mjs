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
const dateGroupedListSource = readSource(
  "../components/shared/date-grouped-list.tsx",
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
    assert.match(
      source,
      /<IntelligenceWorkspace[\s\S]{0,300}listHeader=\{\s*<IntelligenceToolbar\s+variant="embedded"/,
    );
    assert.ok(source.indexOf("<Skeleton") > source.indexOf("<IntelligenceWorkspace"));
  }
});

test("university date groups use the exact-date timeline without entrance animation", () => {
  assert.match(dateGroupedListSource, /animated\?: boolean/);
  assert.match(dateGroupedListSource, /animated = true/);
  assert.match(dateGroupedListSource, /variant\?: "cards" \| "timeline"/);
  assert.match(dateGroupedListSource, /variant === "timeline"/);
  assert.match(dateGroupedListSource, /groupByCalendarDate/);
  assert.match(dateGroupedListSource, /Calendar/);
  assert.match(dateGroupedListSource, /bg-\[#e5e9f0\]/);
  for (const source of [peerDynamicsSource, researchTrackingSource]) {
    assert.match(
      source,
      /<DateGroupedList[\s\S]{0,180}variant="timeline"[\s\S]{0,80}animated=\{false\}/,
    );
  }
});

test("university detail requests ignore stale article responses", () => {
  for (const source of [peerDynamicsSource, researchTrackingSource]) {
    assert.match(source, /const detailRequestIdRef = useRef\(0\)/);
    assert.match(source, /const requestId = \+\+detailRequestIdRef\.current/);
    assert.match(source, /detailRequestIdRef\.current === requestId/);
    assert.match(
      source,
      /finally \{[\s\S]{0,160}detailRequestIdRef\.current === requestId[\s\S]{0,120}setContentLoading\(false\)/,
    );
  }
});
