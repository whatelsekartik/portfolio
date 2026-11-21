import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

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

// The verified crop excludes the analytics dashboard's private traffic-source panel.
// Review the image for sensitive content before changing this hash.
test("Campus+ analytics image is the reviewed, metadata-free crop", async () => {
  const image = readFileSync("src/assets/projects/campus-plus-analytics.webp");
  assert.equal(createHash("sha256").update(image).digest("hex"), "9aab39a2b01a566d758fd9013d11f92ed37c4e0ed461cc5b8cf201fe12b6f783");
  const metadata = await sharp(image).metadata();
  assert.equal(metadata.width, 1601);
  assert.equal(metadata.height, 510);
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.xmp, undefined);
});
