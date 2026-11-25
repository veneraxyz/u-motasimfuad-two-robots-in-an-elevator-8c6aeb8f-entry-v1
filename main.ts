import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One robot's awkward elevator small talk to another robot.
const LINE =
  "So... your battery is at 4%, mine is at 97%, and we have six floors left to pretend I didn't notice.";

function main(): void {
  // Validation guard: exactly one non-blank line, 1-200 characters.
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(`entry line must be 1-200 characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line must not be whitespace only");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry line must be exactly one line");
  }
  // Extra validation: no control characters may sneak into the line.
  for (const ch of LINE) {
    if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
      throw new Error("entry line must not contain control characters");
    }
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE + "\n", "utf8");

  // Read-back guard: the file on disk must be exactly the line plus
  // one trailing newline — nothing more, nothing less.
  const onDisk = readFileSync(outPath, "utf8");
  if (onDisk !== LINE + "\n") {
    throw new Error("read-back mismatch: entry.txt does not equal the line plus one trailing newline");
  }
  const lines = onDisk.split("\n");
  if (lines.length !== 2 || lines[1] !== "") {
    throw new Error("read-back mismatch: entry.txt must be exactly one line plus a trailing newline");
  }
}

main();
