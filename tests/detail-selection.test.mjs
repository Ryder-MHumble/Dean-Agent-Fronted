import test from "node:test";
import assert from "node:assert/strict";

async function loadSelectionModule() {
  try {
    return await import("../lib/detail-selection.ts");
  } catch (error) {
    assert.fail(`默认详情选择模块尚未实现：${error.message}`);
  }
}

test("getDefaultDetailSelection opens the first result only when auto-open is enabled", async () => {
  const { getDefaultDetailSelection } = await loadSelectionModule();
  const items = [{ id: "first" }, { id: "second" }];
  const getKey = (item) => item.id;

  assert.equal(
    getDefaultDetailSelection(items, null, getKey, true),
    items[0],
  );
  assert.equal(
    getDefaultDetailSelection(items, null, getKey, false),
    null,
  );
});

test("getDefaultDetailSelection keeps visible selections and replaces stale ones", async () => {
  const { getDefaultDetailSelection } = await loadSelectionModule();
  const items = [{ id: "first" }, { id: "second" }];
  const getKey = (item) => item.id;

  assert.equal(
    getDefaultDetailSelection(items, items[1], getKey, true),
    items[1],
  );
  assert.equal(
    getDefaultDetailSelection(items, { id: "stale" }, getKey, true),
    items[0],
  );
  assert.equal(
    getDefaultDetailSelection([], items[0], getKey, true),
    null,
  );
});

test("getDefaultDetailSelection can preserve an explicit selection outside the default feed", async () => {
  const { getDefaultDetailSelection } = await loadSelectionModule();
  const items = [{ id: "first" }, { id: "second" }];
  const selected = { id: "popular" };
  const getKey = (item) => item.id;

  assert.equal(
    getDefaultDetailSelection(items, selected, getKey, true, true),
    selected,
  );
  assert.equal(
    getDefaultDetailSelection([], selected, getKey, true, true),
    selected,
  );
});
