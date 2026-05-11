import test from "node:test";
import assert from "node:assert/strict";

import {
  filterItemsByDateRange,
  hasActiveDateRange,
  paginateItems,
} from "../lib/feed-list-utils.ts";

test("hasActiveDateRange detects user-provided range values", () => {
  assert.equal(hasActiveDateRange({ from: "", to: "" }), false);
  assert.equal(hasActiveDateRange({ from: "2026-05-01", to: "" }), true);
  assert.equal(hasActiveDateRange({ from: "", to: "2026-05-31" }), true);
});

test("filterItemsByDateRange keeps items inside an inclusive date range", () => {
  const items = [
    { id: "old", date: "2026-04-30" },
    { id: "start", date: "2026-05-01" },
    { id: "middle", date: "2026-05-11T09:30:00" },
    { id: "end", date: "2026-05-31" },
    { id: "future", date: "2026-06-01" },
    { id: "unknown", date: "" },
  ];

  assert.deepEqual(
    filterItemsByDateRange(items, {
      from: "2026-05-01",
      to: "2026-05-31",
    }).map((item) => item.id),
    ["start", "middle", "end"],
  );
});

test("paginateItems returns a clamped page from an already-filtered list", () => {
  const items = Array.from({ length: 12 }, (_, index) => ({ id: index + 1 }));

  assert.deepEqual(paginateItems(items, 2, 5), {
    items: [{ id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }],
    page: 2,
    pageSize: 5,
    total: 12,
    totalPages: 3,
  });

  assert.deepEqual(paginateItems(items, 99, 5), {
    items: [{ id: 11 }, { id: 12 }],
    page: 3,
    pageSize: 5,
    total: 12,
    totalPages: 3,
  });
});
