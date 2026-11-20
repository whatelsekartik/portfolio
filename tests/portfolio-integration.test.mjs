import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import vm from "node:vm";

const read = (path) => readFileSync(path, "utf8");
const desktop = read("index.html");
const motion = read("public/motion/index.html");
const motionCss = read("public/motion/style.css");
const motionScript = read("public/motion/script.js");

function assertSingleDocument(html) {
  for (const tag of ["html", "head", "body"]) {
    assert.equal((html.match(new RegExp(`<${tag}(?:\\s|>)`, "gi")) ?? []).length, 1, `one ${tag}`);
    assert.equal((html.match(new RegExp(`</${tag}\\s*>`, "gi")) ?? []).length, 1, `one closing ${tag}`);
  }
}

test("desktop and motion portfolio are separate HTML documents", () => {
  assertSingleDocument(desktop);
  assertSingleDocument(motion);
  assert.match(desktop, /id="root"/);
  assert.match(desktop, /src="\/src\/main\.tsx"/);
  assert.doesNotMatch(desktop, /(?:style\.css|script\.js|browser-shell)/);
  assert.match(motion, /href="style\.css"/);
  assert.match(motion, /src="script\.js"/);
  assert.match(motion, /href="\.\.\/"[^>]*>Desktop view/);
  assert.match(read("src/components/MenuBar.tsx"), /import\.meta\.env\.BASE_URL}motion\//);
});

test("motion content and animation have a readable, reduced-motion fallback", () => {
  assert.match(motionCss, /\.reveal\s*\{\s*opacity:\s*1/);
  assert.match(motionCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(motionScript, /prefers-reduced-motion:\s*no-preference/);
  assert.doesNotMatch(motionScript, /monitor-glow|mainTl/);
  let ready;
  vm.runInNewContext(motionScript, {
    document: { addEventListener: (_event, callback) => { ready = callback; } },
    window: {},
  });
  assert.doesNotThrow(() => ready(), "the page must not throw if the GSAP CDN is unavailable");
});

test("motion portfolio uses current contact details and accurate result labels", () => {
  assert.match(motion, /mailto:whatelsekartik@gmail\.com/);
  assert.match(motion, /github\.com\/whatelsekartik/);
  assert.match(motion, /JEE Math percentile/);
  assert.match(motion, /82% overall in HSC Science/);
  assert.doesNotMatch(motion, /expected 90%\+|kartikgaikwad250@gmail\.com/);
});

test("production build includes the motion portfolio assets", { skip: !existsSync("dist/index.html") }, () => {
  for (const file of ["index.html", "style.css", "script.js"]) {
    assert.equal(existsSync(`dist/motion/${file}`), true, `dist/motion/${file}`);
  }
  assertSingleDocument(read("dist/index.html"));
  assertSingleDocument(read("dist/motion/index.html"));
});
