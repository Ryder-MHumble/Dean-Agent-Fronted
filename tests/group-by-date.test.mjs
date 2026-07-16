import test from "node:test";
import assert from "node:assert/strict";

import * as dateGrouping from "../lib/group-by-date.ts";

const { groupByDate } = dateGrouping;

test("groupByDate isolates future-dated items as dates needing review", () => {
  const groups = groupByDate([
    { id: "future", date: "2999-01-01" },
    { id: "unknown", date: "" },
  ]);

  assert.deepEqual(
    groups.map((group) => ({
      label: group.label,
      ids: group.items.map((item) => item.id),
    })),
    [
      { label: "日期待核验", ids: ["future"] },
      { label: "未标注", ids: ["unknown"] },
    ],
  );
});

test("groupByCalendarDate groups exact dates in descending order and keeps unknown dates last", () => {
  assert.equal(typeof dateGrouping.groupByCalendarDate, "function");

  const groups = dateGrouping.groupByCalendarDate([
    { id: "older", date: "2026-07-15" },
    { id: "newer-a", date: "2026-07-16" },
    { id: "unknown", date: "" },
    { id: "newer-b", date: "2026-07-16" },
  ]);

  assert.deepEqual(
    groups.map((group) => ({
      date: group.date,
      label: group.label,
      ids: group.items.map((item) => item.id),
    })),
    [
      {
        date: "2026-07-16",
        label: "2026年7月16日",
        ids: ["newer-a", "newer-b"],
      },
      {
        date: "2026-07-15",
        label: "2026年7月15日",
        ids: ["older"],
      },
      { date: null, label: "日期未标注", ids: ["unknown"] },
    ],
  );
});
