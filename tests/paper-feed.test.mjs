import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPaperQueryParams,
  classifyPaper,
  getPaperCategorySourceQueries,
  getPaperTotalPages,
  mergePaperSampleResponses,
  normalizePaper,
} from "../lib/paper-feed.ts";

test("classifyPaper separates conferences journals and arxiv", () => {
  assert.equal(
    classifyPaper({ source: { source_id: "icml" }, venue: "ICML" }),
    "top-conference",
  );
  assert.equal(
    classifyPaper({ source: { source_id: "jmlr" }, venue: "JMLR" }),
    "top-journal",
  );
  assert.equal(
    classifyPaper({ source: { source_id: "arxiv" }, venue: "CoRR" }),
    "arxiv",
  );
});

test("academic achievement query stays paginated and scoped", () => {
  assert.equal(
    buildPaperQueryParams({
      category: "achievements",
      page: 2,
      pageSize: 20,
    }).toString(),
    "source_type=academy_weekly_signature_achievements&page=2&page_size=20&sort_by=publication_date&order=desc",
  );
});

test("paper categories query multiple real sources instead of one representative source", () => {
  assert.deepEqual(getPaperCategorySourceQueries("top-conference"), [
    { sourceId: "icml" },
    { sourceId: "neurips" },
    { sourceId: "cvpr" },
  ]);
  assert.deepEqual(getPaperCategorySourceQueries("top-journal"), [
    { sourceId: "jmlr" },
    { sourceId: "jair" },
    { sourceId: "tmlr" },
  ]);
  assert.deepEqual(getPaperCategorySourceQueries("arxiv"), [
    { sourceName: "arxiv" },
  ]);
  assert.equal(
    buildPaperQueryParams({ sourceName: "arxiv", page: 1, pageSize: 20 }).toString(),
    "source_name=arxiv&page=1&page_size=20&sort_by=publication_date&order=desc",
  );
});

test("mergePaperSampleResponses deduplicates and sorts category samples", () => {
  const items = mergePaperSampleResponses([
    {
      items: [
        { paper_id: "a", title: "A", publication_date: "2026-01-01" },
        { paper_id: "shared", title: "Shared", publication_date: "2025-01-01" },
      ],
      total: 2,
      page: 1,
      page_size: 30,
    },
    {
      items: [
        { paper_id: "b", title: "B", publication_date: "2027-01-01" },
        { paper_id: "shared", title: "Shared", publication_date: "2025-01-01" },
      ],
      total: 2,
      page: 1,
      page_size: 30,
    },
  ]);

  assert.deepEqual(items.map((paper) => paper.paper_id), ["b", "a", "shared"]);
});

test("normalizePaper provides display-safe fallback values", () => {
  const paper = normalizePaper({
    paper_id: "p1",
    title: "A paper",
    authors: [],
    source: {},
  });
  assert.equal(paper.authorsText, "作者信息待补充");
  assert.equal(paper.venueText, "来源待补充");
});

test("real paper response fields normalize without total_pages", () => {
  const response = {
    items: [
      {
        paper_id: "p2",
        title: "A real paper",
        authors: ["Alice", "Bob"],
        venue: "JMLR",
        venue_year: 2025,
        detail_url: "https://example.test/papers/p2",
        pdf_url: "https://example.test/papers/p2.pdf",
        source: {
          type: "academy_weekly_signature_achievements",
          name: "两院学术成果",
          source_id: "academy-achievements",
        },
      },
    ],
    total: 41,
    page: 2,
    page_size: 20,
  };

  const paper = normalizePaper(response.items[0]);
  assert.equal(paper.category, "achievements");
  assert.equal(paper.year, 2025);
  assert.equal(paper.sourceUrl, "https://example.test/papers/p2");
  assert.equal(paper.pdfUrl, "https://example.test/papers/p2.pdf");
  assert.equal(getPaperTotalPages(response), 3);
});

test("keyword query uses the papers API q parameter", () => {
  assert.equal(
    buildPaperQueryParams({
      keyword: " agent ",
      page: 1,
      pageSize: 50,
    }).toString(),
    "q=agent&page=1&page_size=30&sort_by=publication_date&order=desc",
  );
});

test("normalizePaper falls back to nested source links", () => {
  const paper = normalizePaper({
    paper_id: "p3",
    title: "Nested links",
    source: {
      source_id: "jmlr",
      detail_url: "https://example.test/source/p3",
      pdf_url: "https://example.test/source/p3.pdf",
    },
  });

  assert.equal(paper.sourceUrl, "https://example.test/source/p3");
  assert.equal(paper.pdfUrl, "https://example.test/source/p3.pdf");
});
