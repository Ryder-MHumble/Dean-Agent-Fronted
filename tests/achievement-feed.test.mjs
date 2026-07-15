import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAchievementQueryParams,
  getAchievementMemberProfiles,
  getAchievementMemberNames,
  getAchievementPrimaryDate,
  getAchievementSourceLabel,
  mergeAchievementAuthors,
} from "../lib/achievement-feed.ts";

test("achievement query forwards the dedicated warehouse filters", () => {
  assert.equal(
    buildAchievementQueryParams({
      type: "paper",
      claimStatus: "confirmed",
      year: 2026,
      sourceSystem: "dingtalk_confirmed",
      hasMembers: true,
      keyword: " 具身智能 ",
      page: 2,
      pageSize: 20,
    }).toString(),
    "achievement_type=paper&claim_status=confirmed&venue_year=2026&source_system=dingtalk_confirmed&has_members=true&keyword=%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD&page=2&page_size=20&sort_by=venue_year&sort_order=desc",
  );
});

test("achievement members use the two-academy matched names", () => {
  assert.deepEqual(
    getAchievementMemberNames({
      zgca_members: [
        { name: "李老师", role: "advisor" },
        { scholar_name_cn: "王老师", role: "advisor" },
        { name: "李老师", role: "student" },
      ],
    }),
    ["李老师", "王老师"],
  );
});

test("achievement member profiles deduplicate real two-academy names and roles", () => {
  assert.deepEqual(
    getAchievementMemberProfiles({
      zgca_members: [
        { name: "Wei Wang", scholar_name_cn: "王伟", role: "advisor" },
        { author_name: "Wei Wang", scholar_name_cn: "王伟", role: "advisor" },
        { name: "闫沐西", author_name: "Muxi Yan", role: "student" },
      ],
    }),
    [
      { name: "王伟", role: "advisor" },
      { name: "闫沐西", role: "student" },
    ],
  );
});

test("achievement source label prefers venue then source name", () => {
  assert.equal(
    getAchievementSourceLabel({ venue: "ACL", sources: [], source_system: null }),
    "ACL",
  );
  assert.equal(
    getAchievementSourceLabel({
      venue: null,
      sources: [{ source_name: "ArXiv", system: "papers_affiliation" }],
      source_system: "papers_affiliation",
    }),
    "ArXiv",
  );
});

test("achievement authors replace matched aliases with real two-academy identities", () => {
  assert.deepEqual(
    mergeAchievementAuthors(
      ["Wei Wang", "Chengyun Yang", "Yuming Yang"],
      [
        {
          name: "王伟",
          aliases: ["Wei Wang"],
          role: "advisor",
        },
      ],
    ),
    [
      {
        name: "王伟",
        originalName: "Wei Wang",
        role: "advisor",
        isZgcaMember: true,
      },
      {
        name: "Chengyun Yang",
        originalName: null,
        role: null,
        isZgcaMember: false,
      },
      {
        name: "Yuming Yang",
        originalName: null,
        role: null,
        isZgcaMember: false,
      },
    ],
  );
});

test("achievement authors append matched students or advisors missing from paper authors", () => {
  assert.deepEqual(
    mergeAchievementAuthors(["External Author"], [
      { name: "闫沐西", aliases: ["Muxi Yan"], role: "student" },
      { name: "唐博", aliases: ["Bo Tang"], role: "advisor" },
    ]).map(({ name, role, isZgcaMember }) => ({ name, role, isZgcaMember })),
    [
      { name: "External Author", role: null, isZgcaMember: false },
      { name: "闫沐西", role: "student", isZgcaMember: true },
      { name: "唐博", role: "advisor", isZgcaMember: true },
    ],
  );
});

test("achievement date prefers publication date then venue year", () => {
  assert.equal(
    getAchievementPrimaryDate({
      publication_date: "2026-05-20T00:00:00+00:00",
      venue_year: 2025,
    }),
    "2026-05-20",
  );
  assert.equal(getAchievementPrimaryDate({ venue_year: 2025 }), "2025");
});
