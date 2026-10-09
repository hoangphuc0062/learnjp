import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const lessons = JSON.parse(
  readFileSync(new URL("../content/n5/lessons.json", import.meta.url)),
);
const ids = new Set();
assert.equal(lessons.length, 25);
for (const [i, lesson] of lessons.entries()) {
  assert.equal(lesson.slug, `n5-bai-${String(i + 1).padStart(2, "0")}`);
  assert.ok(lesson.grammar.length >= 2);
  for (const exercise of lesson.exercises) {
    assert.ok(!ids.has(exercise.id), `Duplicate exercise ${exercise.id}`);
    ids.add(exercise.id);
    assert.ok(
      exercise.prompt && exercise.explanation && exercise.answers.length,
    );
    if (exercise.choices) {
      assert.equal(new Set(exercise.choices).size, exercise.choices.length);
      assert.equal(
        exercise.choices.filter((c) => exercise.answers.includes(c)).length,
        1,
      );
    }
  }
  for (const v of lesson.vocabulary) {
    assert.ok(v.illustration >= 0 && v.illustration < 36);
    for (const asset of [v.audio, v.exampleAudio])
      assert.ok(
        statSync(new URL(`../public${asset}`, import.meta.url)).size > 500,
      );
  }
  for (const g of lesson.grammar)
    assert.ok(existsSync(new URL(`../public${g.audio}`, import.meta.url)));
}
const output = ts.transpileModule(
  readFileSync(
    new URL("../lib/learning/n5-review.ts", import.meta.url),
    "utf8",
  ),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const sandbox = {
  exports: {},
  localStorage: { getItem: () => null },
  Date,
  Number,
  Object,
  JSON,
  Event: class {},
  window: { dispatchEvent: () => {} },
};
vm.runInNewContext(output, sandbox);
const { scheduleN5Review, readN5Progress } = sandbox.exports;
const now = 1_000_000_000;
const first = scheduleN5Review(undefined, true, now);
assert.equal(first.step, 0);
assert.equal(first.due, now + 86_400_000);
const early = scheduleN5Review(first, true, now + 1_000);
assert.equal(
  early.step,
  0,
  "Early practice must not advance the review interval",
);
assert.equal(
  early.due,
  first.due,
  "Early practice must preserve the existing due date",
);
const due = scheduleN5Review(first, true, first.due);
assert.equal(due.step, 1);
assert.equal(due.due, first.due + 3 * 86_400_000);
const failed = scheduleN5Review(due, false, now);
assert.equal(failed.step, -1);
assert.equal(failed.due, now + 600_000);
const recovered = scheduleN5Review(failed, true, failed.due);
assert.equal(recovered.step, 0);
assert.equal(recovered.due, failed.due + 86_400_000);
const mature = scheduleN5Review({ step: 4, due: now, attempts: 8 }, true, now);
assert.equal(mature.step, 4);
assert.equal(mature.due, now + 30 * 86_400_000);
sandbox.localStorage.getItem = () => "not-json";
assert.equal(readN5Progress().completed.length, 0);
sandbox.localStorage.getItem = () =>
  JSON.stringify({
    completed: ["n5-bai-01", 3],
    reviews: { broken: { due: "yesterday", step: 9 } },
    drafts: {},
  });
const repaired = readN5Progress();
assert.equal(repaired.completed.length, 1);
assert.equal(Object.keys(repaired.reviews).length, 0);
console.log(
  `Validated ${lessons.length} lessons, ${ids.size} exercises, audio assets and review scheduling edge cases.`,
);
