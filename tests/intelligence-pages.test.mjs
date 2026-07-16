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

test("application content can shrink around horizontally scrollable report tables", () => {
  assert.match(pageSource, /"min-w-0 flex-1/);
});

test("active intelligence modules use the full app content height", () => {
  const shellModules = [
    "../components/modules/papers/index.tsx",
    "../components/modules/internal-shared/academic-achievements.tsx",
    "../components/modules/university-eco/index.tsx",
    "../components/modules/internal-mgmt/sentiment/index.tsx",
  ];
  const fixedHeightModules = [
    "../components/modules/internal-shared/internal-experts.tsx",
    "../components/modules/tech-frontier/tech-frontier-page.tsx",
    "../components/modules/talent-radar/index.tsx",
  ];

  for (const path of shellModules) {
    const source = readSource(path);
    assert.match(source, /<IntelligencePageShell/);
    assert.doesNotMatch(source, /calc\(100vh-4rem\)/);
  }

  for (const path of fixedHeightModules) {
    const source = readSource(path);
    assert.match(source, /h-\[var\(--app-content-height,100dvh\)\]/);
    assert.doesNotMatch(source, /calc\(100vh-4rem\)/);
  }

  const moduleLayout = readSource("../components/module-layout.tsx");
  const peerDynamics = readSource(
    "../components/modules/university-eco/peer-dynamics.tsx",
  );
  const researchTracking = readSource(
    "../components/modules/university-eco/research-tracking.tsx",
  );
  const home = readSource("../components/pages/home-briefing.tsx");
  assert.match(moduleLayout, /h-\[var\(--app-content-height,100dvh\)\]/);
  assert.match(moduleLayout, /flex h-full min-h-0 flex-col/);
  assert.match(peerDynamics, /flex h-full min-h-0 flex-col/);
  assert.match(researchTracking, /flex h-full min-h-0 flex-col/);
  assert.doesNotMatch(peerDynamics, /calc\(100vh - 10rem\)/);
  assert.doesNotMatch(researchTracking, /calc\(100vh - 12rem\)/);
  assert.match(home, /min-h-\[var\(--app-content-height,100dvh\)\]/);
});

test("external leaders use the shared policy intelligence list-detail pattern", () => {
  const leaderSource = readSource("../components/modules/talent-radar/index.tsx");
  assert.match(leaderSource, /<SearchInput/);
  assert.match(leaderSource, /<IntelligencePageShell/);
  assert.match(leaderSource, /<IntelligenceToolbar/);
  assert.match(leaderSource, /<IntelligenceWorkspace/);
  assert.match(leaderSource, /<IntelligenceListItem/);
  assert.match(leaderSource, /<IntelligenceDetailHeader/);
  assert.match(leaderSource, /<IntelligenceSection/);
  assert.match(leaderSource, /<FeedPagination/);
  assert.doesNotMatch(leaderSource, /<Sheet|SheetContent|<Table|TableRow/);
  assert.match(leaderSource, /line-clamp-2/);
  assert.doesNotMatch(leaderSource, /dates\[0\] \?\? new Date\(\)/);
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
  assert.match(achievementsSource, /<AcademicAchievementList/);
  assert.match(
    expertsSource,
    /http:\/\/10\.1\.132\.21:5174\/\?tab=scholars/,
  );
  assert.match(
    expertsSource,
    /https:\/\/skills\.zgci\.org\/space\/global\/liangyuan-expert-recommender/,
  );
});

test("report surfaces use compact report styling and shared pagination", () => {
  const paperListSource = readSource(
    "../components/modules/papers/paper-list.tsx",
  );
  const expertsSource = readSource(
    "../components/modules/internal-shared/internal-experts.tsx",
  );

  assert.match(paperListSource, /<IntelligenceToolbar/);
  assert.match(paperListSource, /<IntelligenceWorkspace/);
  assert.match(expertsSource, /<IntelligencePageShell/);
  assert.match(expertsSource, /<IntelligenceToolbar/);
  assert.match(expertsSource, /<IntelligenceWorkspace/);
  assert.match(expertsSource, /placeholder="搜索姓名、单位、研究方向"/);
  assert.match(expertsSource, /<FeedPagination/);
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
  assert.match(paperListSource, /当前论文数据表暂无预印本记录/);
});

test("paper page follows the policy intelligence filter and detail pattern", () => {
  const paperListSource = readSource(
    "../components/modules/papers/paper-list.tsx",
  );

  assert.match(paperListSource, /<SearchInput/);
  assert.match(paperListSource, /<DateRangeFilter/);
  assert.match(paperListSource, /<IntelligenceToolbar/);
  assert.match(paperListSource, /<IntelligenceWorkspace/);
  assert.match(paperListSource, /<IntelligenceListItem/);
  assert.match(paperListSource, /<IntelligenceDetailHeader/);
  assert.match(paperListSource, /<IntelligenceSection/);
  assert.match(paperListSource, /<FeedPagination/);
  assert.match(paperListSource, /作者/);
  assert.match(paperListSource, /摘要/);
  assert.match(paperListSource, /<PaperAuthorHoverCard/);
  assert.match(paperListSource, /const scholarCache = new Map/);
  assert.match(paperListSource, /SCHOLAR_GRAPH_URL/);
  assert.match(paperListSource, /href=\{graphUrl\}/);
  assert.match(paperListSource, /keyword=/);
  assert.match(
    paperListSource,
    /total=\{feed\.isSampled \? undefined : feed\.total\}/,
  );
  assert.match(paperListSource, /精选聚合[\s\S]{0,40}\{feed\.total\} 条/);
  assert.ok(
    paperListSource.indexOf('<IntelligenceSection title="作者">') <
      paperListSource.indexOf('<IntelligenceSection title="摘要">'),
  );
});

test("academic achievements use the dedicated warehouse list-detail page", () => {
  const achievementsSource = readSource(
    "../components/modules/internal-shared/academic-achievements.tsx",
  );
  const listSource = readSource(
    "../components/modules/internal-shared/academic-achievement-list.tsx",
  );

  assert.match(listSource, /<SearchInput/);
  assert.match(listSource, /<IntelligenceToolbar/);
  assert.match(listSource, /<IntelligenceWorkspace/);
  assert.match(listSource, /<IntelligenceListItem/);
  assert.match(listSource, /<IntelligenceDetailHeader/);
  assert.match(listSource, /<IntelligenceSection/);
  assert.match(listSource, /<FeedPagination/);
  assert.doesNotMatch(listSource, /<IntelligenceSection title="成果详情">/);
  assert.doesNotMatch(listSource, /<IntelligenceSection title="两院成员">/);
  assert.match(listSource, /<AchievementAuthorList/);
  assert.match(listSource, /useZgcaAchievements/);
  assert.match(listSource, /const scholarIdentityCache = new Map/);
  assert.match(listSource, /Promise\.all/);
  assert.match(listSource, /api\/scholars\/\$\{encodeURIComponent\(member\.scholar_id\)\}/);
  assert.match(listSource, /getAchievementSourceLabel/);
  assert.match(listSource, /<IntelligenceSection title="摘要">/);
  assert.match(listSource, /key=\{item\.id\}/);
  assert.match(listSource, /sourceUrl: selectedItem\.detail_url/);
  assert.match(listSource, /href=\{item\.pdf_url\}/);
  assert.equal(
    (listSource.match(/<IntelligenceSection title="作者">/g) ?? []).length,
    1,
  );
  assert.match(listSource, /className="flex flex-wrap gap-2"/);
  assert.match(achievementsSource, /<AcademicAchievementList/);
  assert.doesNotMatch(achievementsSource, /<PaperList/);
});

test("internal experts use the shared policy intelligence list-detail pattern", () => {
  const expertsSource = readSource(
    "../components/modules/internal-shared/internal-experts.tsx",
  );

  assert.match(expertsSource, /<SearchInput/);
  assert.match(expertsSource, /<IntelligencePageShell/);
  assert.match(expertsSource, /<IntelligenceToolbar/);
  assert.match(expertsSource, /<IntelligenceWorkspace/);
  assert.match(expertsSource, /<IntelligenceListItem/);
  assert.match(expertsSource, /<IntelligenceDetailHeader/);
  assert.match(expertsSource, /<IntelligenceSection/);
  assert.match(expertsSource, /<FeedPagination/);
  assert.doesNotMatch(expertsSource, /<Table|TableRow|TableCell/);
  assert.match(expertsSource, /研究方向/);
  assert.match(expertsSource, /学科方向/);
  assert.match(expertsSource, /function getExpertKey\(expert: ExpertRecord\)/);
  assert.match(expertsSource, /key=\{getExpertKey\(expert\)\}/);
  assert.match(
    expertsSource,
    /getExpertKey\(selectedItem\) === getExpertKey\(expert\)/,
  );
  assert.match(expertsSource, /expert\.updatedAt &&/);
  assert.match(
    expertsSource,
    /h-\[var\(--app-content-height,100dvh\)\][^"\n]*overflow-hidden/,
  );
});

test("generated expert snapshot contains only approved public fields", () => {
  const snapshot = JSON.parse(
    readSource("../lib/generated/two-academies-experts.json"),
  );
  const approvedKeys = [
    "name",
    "organization",
    "department",
    "title",
    "role",
    "region",
    "researchAreas",
    "discipline",
    "updatedAt",
  ];

  assert.ok(!Number.isNaN(Date.parse(snapshot.syncedAt)));
  assert.ok(snapshot.items.length > 0);
  for (const expert of snapshot.items) {
    assert.deepEqual(Object.keys(expert), approvedKeys);
  }
  assert.doesNotMatch(JSON.stringify(snapshot), /电子邮箱|手机号|电话|@/);
});

test("sentiment keeps full-item selection and closes details on query changes", () => {
  const sentiment = readSource(
    "../components/modules/internal-mgmt/sentiment/index.tsx",
  );
  const report = readSource(
    "../components/modules/internal-mgmt/sentiment/sentiment-report.tsx",
  );

  assert.match(
    sentiment,
    /useState<SentimentContentItem \| null>\(null\)/,
  );
  assert.match(sentiment, /setSelectedContent\(item\)/);
  assert.match(sentiment, /selectedContent\?\.content_id/);
  for (const handler of [
    "handlePlatformChange",
    "handleSearch",
    "handleSortChange",
    "handlePageChange",
  ]) {
    assert.match(
      sentiment,
      new RegExp(
        `(?:const|function) ${handler}[\\s\\S]{0,320}setSelectedContent\\(null\\)`,
      ),
    );
  }
  assert.match(sentiment, /pageSize:\s*(?:15|PAGE_SIZE)/);
  assert.match(sentiment, /pageSize=\{(?:15|PAGE_SIZE)\}/);
  assert.match(sentiment, /overview\.top_content/);
  assert.match(sentiment, /<SentimentReport/);
  assert.doesNotMatch(
    `${sentiment}\n${report}`,
    /\b(?:positive|negative|neutral|polarity)\b|正面|负面|中性/i,
  );
});
