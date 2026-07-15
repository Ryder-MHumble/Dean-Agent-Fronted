import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pageSource = readFileSync(
  new URL("../components/modules/tech-frontier/tech-frontier-page.tsx", import.meta.url),
  "utf8",
);

test("social feed does not fetch post details automatically for list avatars", () => {
  assert.doesNotMatch(pageSource, /useTechFrontierAuthorAvatars/);
});
