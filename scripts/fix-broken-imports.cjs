/**
 * Fixes broken imports caused by the add-route-guards script inserting
 * imports in the middle of multi-line import statements.
 *
 * Strategy: For each file, find the guard import line that's misplaced
 * (between the `import {` and the `from` of a multi-line import),
 * remove it, and re-insert after the complete multi-line import.
 *
 * Run: node scripts/fix-broken-imports.cjs
 */
const fs = require("fs");
const path = require("path");

const ROUTES_DIR = path.resolve(__dirname, "../src/routes/_authenticated");
const GUARD_IMPORT_RE = /^\s*import \{ (require\w+) \} from "@\/lib\/route-guards";$/;

const files = fs.readdirSync(ROUTES_DIR).filter((f) => f.endsWith(".tsx"));
let fixed = 0;

for (const file of files) {
  const filePath = path.join(ROUTES_DIR, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // Find the guard import line
  const guardLineIndex = lines.findIndex((line) => GUARD_IMPORT_RE.test(line));
  if (guardLineIndex < 0) continue;

  // Check if it's inside a multi-line import block.
  // A multi-line import starts with `import {` or `import {` on a line
  // and doesn't have `from` on the same line.
  // We need to check if the guard import was inserted between
  // the start of a multi-line import and its closing `from "...";`

  // Check if the guard import line is inside a multi-line import block
  let inMultilineImport = false;
  if (guardLineIndex > 0) {
    // Walk backwards to find if we're inside a multi-line import
    for (let i = guardLineIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.includes("from ") && (line.includes('"') || line.includes("'"))) {
        // This line has a from statement, not in a multi-line import
        break;
      }
      if (line.startsWith("import {") && !line.includes("from ")) {
        inMultilineImport = true;
        break;
      }
      if (line.startsWith("import (")) {
        break;
      }
    }
  }

  if (!inMultilineImport) continue;

  // Remove the guard import line from its wrong position
  const guardLine = lines[guardLineIndex];
  lines.splice(guardLineIndex, 1);

  // Find the end of the multi-line import block (the line with `from "..."`)
  // Start searching from the line where the incomplete import starts
  let importEndIndex = -1;
  for (let i = guardLineIndex - 1; i < lines.length; i++) {
    if (lines[i].includes('from "')) {
      importEndIndex = i;
      break;
    }
  }

  if (importEndIndex < 0) continue;

  // Insert the guard import after the multi-line import block
  lines.splice(importEndIndex + 1, 0, guardLine);

  fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
  console.log(`Fix: ${file}`);
  fixed++;
}

console.log(`\nFixed ${fixed} files`);
