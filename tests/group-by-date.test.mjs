import test from "node:test";
import assert from "node:assert/strict";

import { groupByDate } from "../lib/group-by-date.ts";

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
