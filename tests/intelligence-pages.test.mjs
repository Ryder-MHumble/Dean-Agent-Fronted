import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readSource(path) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

const pageSource = readSource("../app/page.tsx");

test("intelligence pages are dynamically registered and rendered", () => {
  const modules = [
    ["PapersModule", "@/components/modules/papers", "papers"],
    [
      "AcademicAchievementsModule",
      "@/components/modules/internal-shared/academic-achievements",
      "academic-achievements",
    ],
    [
      "InternalExpertsModule",
      "@/components/modules/internal-shared/internal-experts",
      "internal-experts",
    ],
  ];

  for (const [component, importPath, pageId] of modules) {
    assert.match(pageSource, new RegExp(`const ${component} = dynamic`));
    assert.match(pageSource, new RegExp(`import\\(["']${importPath}["']\\)`));
    assert.match(
      pageSource,
      new RegExp(`activePage === ["']${pageId}["'][\\s\\S]{0,100}<${component}`),
    );
  }
});

test("data report pages render outside the entrance animation wrapper", () => {
  const motionPageStart = pageSource.indexOf("<MotionPage");
  assert.ok(motionPageStart > 0);

  for (const pageId of [
    "papers",
    "academic-achievements",
    "internal-experts",
  ]) {
    const branchStart = pageSource.indexOf(`activePage === "${pageId}"`);
    assert.ok(branchStart > 0 && branchStart < motionPageStart);
  }
});

test("paper and internal pages expose the required data links", () => {
  const papersSource = readSource("../components/modules/papers/index.tsx");
  const achievementsSource = readSource(
    "../components/modules/internal-shared/academic-achievements.tsx",
  );
  const expertsSource = readSource(
    "../components/modules/internal-shared/internal-experts.tsx",
  );

  assert.match(
    papersSource,
    /https:\/\/skills\.zgci\.org\/space\/global\/intelligence-engine-api/,
  );
  assert.match(
    achievementsSource,
    /https:\/\/skills\.zgci\.org\/space\/global\/zgca-paper-author-query/,
  );
  assert.match(achievementsSource, /category=["']achievements["']/);
  assert.match(
    expertsSource,
    /http:\/\/10\.1\.132\.21:5174\/\?tab=scholars/,
  );
  assert.match(
    expertsSource,
    /https:\/\/skills\.zgci\.org\/space\/global\/liangyuan-expert-recommender/,
  );
});

test("report surfaces use compact report styling and mobile table scrolling", () => {
  const paperListSource = readSource(
    "../components/modules/papers/paper-list.tsx",
  );
  const expertsSource = readSource(
    "../components/modules/internal-shared/internal-experts.tsx",
  );

  assert.ok((paperListSource.match(/rounded-xl[^"\n]*shadow-sm/g) ?? []).length >= 2);
  assert.ok((expertsSource.match(/rounded-xl[^"\n]*shadow-sm/g) ?? []).length >= 2);
  assert.match(
    expertsSource,
    /className="[^"]*overflow-x-auto[^"]*rounded-xl[^"]*shadow-sm[^"]*"/,
  );
});

test("Skill access and scholar links remain unframed metadata links", () => {
  const skillNoteSource = readSource(
    "../components/shared/skill-access-note.tsx",
  );
  const expertsSource = readSource(
    "../components/modules/internal-shared/internal-experts.tsx",
  );

  assert.doesNotMatch(skillNoteSource, /<Button|rounded-|border|bg-white/);
  assert.match(skillNoteSource, /hover:underline/);
  assert.match(expertsSource, /更多学者数据/);
  assert.doesNotMatch(
    expertsSource.match(/<a[\s\S]*?更多学者数据[\s\S]*?<\/a>/)?.[0] ?? "",
    /rounded-|border|bg-white/,
  );
});

test("paper category labels use Chinese preprint wording", () => {
  const paperListSource = readSource(
    "../components/modules/papers/paper-list.tsx",
  );

  assert.match(paperListSource, /value: "arxiv", label: "预印本"/);
  assert.doesNotMatch(paperListSource, /label: "ArXiv"/);
});

test("generated expert snapshot starts empty for the later sync task", () => {
  const snapshot = JSON.parse(
    readSource("../lib/generated/two-academies-experts.json"),
  );

  assert.deepEqual(snapshot, { syncedAt: "", items: [] });
});
