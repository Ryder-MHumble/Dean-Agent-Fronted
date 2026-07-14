import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPaperQueryParams,
  classifyPaper,
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
