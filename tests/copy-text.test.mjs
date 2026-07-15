import test from "node:test";
import assert from "node:assert/strict";

let copyTextToClipboard;

try {
  ({ copyTextToClipboard } = await import("../lib/copy-text.ts"));
} catch {}

function setGlobalProperty(name, value) {
  const original = Object.getOwnPropertyDescriptor(globalThis, name);

  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value,
  });

  return () => {
    if (original) {
      Object.defineProperty(globalThis, name, original);
      return;
    }

    delete globalThis[name];
  };
}

test("copyTextToClipboard is exported", () => {
  assert.equal(typeof copyTextToClipboard, "function");
});

test("copyTextToClipboard prefers navigator.clipboard when available", async () => {
  let clipboardText = null;

  const restoreNavigator = setGlobalProperty("navigator", {
    clipboard: {
      writeText: async (text) => {
        clipboardText = text;
      },
    },
  });

  const restoreDocument = setGlobalProperty("document", {
    body: {
      appendChild() {
        throw new Error("fallback should not be used");
      },
      removeChild() {
        throw new Error("fallback should not be used");
      },
    },
    createElement() {
      throw new Error("fallback should not be used");
    },
    execCommand() {
      throw new Error("fallback should not be used");
    },
  });

  try {
    const copied = await copyTextToClipboard("api curl");

    assert.equal(copied, true);
    assert.equal(clipboardText, "api curl");
  } finally {
    restoreNavigator();
    restoreDocument();
  }
});

test("copyTextToClipboard falls back to execCommand when clipboard access is rejected", async () => {
  const appended = [];
  const removed = [];
  const textarea = {
    value: "",
    style: {},
    setAttribute() {},
    selectCalled: false,
    range: null,
    select() {
      this.selectCalled = true;
    },
    setSelectionRange(start, end) {
      this.range = [start, end];
    },
  };
  let copiedCommand = null;

  const restoreNavigator = setGlobalProperty("navigator", {
    clipboard: {
      writeText: async () => {
        throw new Error("clipboard permission denied");
      },
    },
  });

  const restoreDocument = setGlobalProperty("document", {
    body: {
      appendChild(node) {
        appended.push(node);
      },
      removeChild(node) {
        removed.push(node);
      },
    },
    createElement(tagName) {
      assert.equal(tagName, "textarea");
      return textarea;
    },
    execCommand(command) {
      copiedCommand = command;
      return true;
    },
  });

  try {
    const copied = await copyTextToClipboard("agent prompt");

    assert.equal(copied, true);
    assert.equal(copiedCommand, "copy");
    assert.deepEqual(appended, [textarea]);
    assert.deepEqual(removed, [textarea]);
    assert.equal(textarea.value, "agent prompt");
    assert.equal(textarea.selectCalled, true);
    assert.deepEqual(textarea.range, [0, "agent prompt".length]);
  } finally {
    restoreNavigator();
    restoreDocument();
  }
});

test("copyTextToClipboard returns false when no copy method is available", async () => {
  const restoreNavigator = setGlobalProperty("navigator", {});
  const restoreDocument = setGlobalProperty("document", {
    body: null,
    createElement() {
      throw new Error("fallback should not allocate a textarea");
    },
  });

  try {
    const copied = await copyTextToClipboard("manual copy");

    assert.equal(copied, false);
  } finally {
    restoreNavigator();
    restoreDocument();
  }
});
