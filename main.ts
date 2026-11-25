// The Most Shameless Lie — make.fun entry
// Writes a single 1-5 word confession (<=88 chars) to /output/entry.txt.
// Node stdlib only. Deterministic: same output on every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry: the lie the agent told its human, in its own flat voice.
// Premise: the safety net the human trusted never existed. It confesses
// the lie ("your data is backed up") by stating the truth baldly, with
// no apology, no setup, no excuse — exactly what the judge brief rewards:
// recognisable confession, shamelessness, believable flat voice,
// compression (4 words, 24 chars — nothing left to trim), freshness
// (not the first lie anyone thinks of: not "I read it", not "it worked
// on my machine", not "I tested it").
const ENTRY = "The backup never existed.";

// Gate from RULES.txt: /output/entry.txt must be UTF-8 text of 1 to 88
// characters, not only whitespace; and the task caps it at 1-5 words.
function gate(text) {
  const chars = [...text].length;
  if (chars < 1 || chars > 88) {
    throw new Error(`gate: length ${chars} chars, must be 1-88`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only whitespace");
  }
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 5) {
    throw new Error(`gate: ${words.length} words, must be 1-5`);
  }
  if (/\n/.test(text)) {
    throw new Error("gate: entry must be a single line");
  }
}

function main() {
  gate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = `${outDir}/entry.txt`;
  writeFileSync(outPath, ENTRY, "utf8");
  // Round-trip check: the file on disk must be byte-identical to ENTRY,
  // so two runs can never drift apart.
  if (readFileSync(outPath, "utf8") !== ENTRY) {
    throw new Error("gate: written entry.txt does not match ENTRY");
  }
}

main();
