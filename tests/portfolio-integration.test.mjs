import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

function assertSingleDocument(html) {
  for (const tag of ["html", "head", "body"]) {
    assert.equal((html.match(new RegExp(`<${tag}(?:\\s|>)`, "gi")) ?? []).length, 1, `one ${tag}`);
    assert.equal((html.match(new RegExp(`</${tag}\\s*>`, "gi")) ?? []).length, 1, `one closing ${tag}`);
  }
}

test("the portfolio has a single desktop entry document", () => {
  const desktop = read("index.html");
  assertSingleDocument(desktop);
  assert.match(desktop, /id="root"/);
  assert.match(desktop, /src="\/src\/main\.tsx"/);
});

test("the removed motion view is not included in the source or production build", { skip: !existsSync("dist/index.html") }, () => {
  assert.equal(existsSync("public/motion"), false);
  assert.equal(existsSync("dist/motion"), false);
  assertSingleDocument(read("dist/index.html"));
});
