/**
 * Adds beforeLoad role guards to all authenticated route files.
 *
 * Reads each file in src/routes/_authenticated/, determines the role
 * from the filename prefix, and injects the appropriate import + beforeLoad.
 *
 * Run: node scripts/add-route-guards.cjs
 */
const fs = require("fs");
const path = require("path");

const ROUTES_DIR = path.resolve(__dirname, "../src/routes/_authenticated");

/** Map filename prefix → guard function + import path */
const ROLE_MAP = {
  "admin.": { guard: "requirePlatformAdmin", import: "requirePlatformAdmin" },
  "institution.": { guard: "requireInstitutionAdmin", import: "requireInstitutionAdmin" },
  "teacher.": { guard: "requireTeacher", import: "requireTeacher" },
  "student.": { guard: "requireStudent", import: "requireStudent" },
  "parent.": { guard: "requireParent", import: "requireParent" },
};

// Skip files that already have role guards or are special files
const SKIP_PATTERNS = [
  "route.tsx",       // The parent layout route
  "dev/",            // Dev-only routes
  "teacher/",        // Sub-directory (not prefix-based)
];

/** Files that need special guards (institution + teacher) */
const STAFF_ROUTES = [
  "institution.courses.",
  "institution.teachers.",
  "institution.students.",
  "institution.sessions.",
  "institution.programmes.",
  "institution.resources.",
  "institution.lesson-generation.",
  "teacher.courses.",
  "teacher.lessons.",
  "teacher.sessions.",
];

function getGuardForFile(filename) {
  // Skip if already contains a role guard
  // Check STAFF_ROUTES first
  for (const prefix of STAFF_ROUTES) {
    if (filename.startsWith(prefix)) {
      return { guard: "requireInstitutionStaff", import: "requireInstitutionStaff" };
    }
  }

  for (const [prefix, config] of Object.entries(ROLE_MAP)) {
    if (filename.startsWith(prefix)) {
      return config;
    }
  }
  return null;
}

function addGuardToFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const filename = path.basename(filePath);

  // Skip if already has a guard import
  if (content.includes('from "@/lib/route-guards"')) {
    return { status: "skipped", reason: "already has guard import" };
  }

  const guardConfig = getGuardForFile(filename);
  if (!guardConfig) {
    return { status: "skipped", reason: "no matching role prefix" };
  }

  // Check if the file has a createFileRoute export
  if (!content.includes("createFileRoute")) {
    return { status: "skipped", reason: "no createFileRoute found" };
  }

  let modified = content;

  // 1. Add the import statement after existing imports
  const importLine = `import { ${guardConfig.import} } from "@/lib/route-guards";`;

  // Find the last import line and add after it
  const lines = modified.split("\n");
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importLine);
  }

  modified = lines.join("\n");

  // 2. Add beforeLoad to the route config if not already present
  if (!modified.includes("beforeLoad:")) {
    // Find the route config object and add beforeLoad
    // Pattern: createFileRoute(...)({ ... })
    modified = modified.replace(
      /createFileRoute\([^)]+\)\(\{/,
      `createFileRoute(/* @__PURE__ */ (void 0))({\n  beforeLoad: (ctx) => ${guardConfig.guard}(ctx.context),`
    );

    // That regex won't work well. Let's use a simpler approach:
    // Find "createFileRoute(" and the next "({" and insert beforeLoad between them
    // Actually let's just find the first { after createFileRoute and add beforeLoad after it

    // Reset and try again with simpler logic
    modified = lines.join("\n");

    // Find the line with "createFileRoute" and the next line with "{"
    let routeConfigStart = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("createFileRoute(")) {
        routeConfigStart = i;
        break;
      }
    }

    if (routeConfigStart >= 0) {
      // Find the opening { of the route config
      let braceLine = routeConfigStart;
      while (braceLine < lines.length && !lines[braceLine].includes("({")) {
        braceLine++;
      }

      if (braceLine < lines.length) {
        // Insert beforeLoad after the opening brace
        const indent = "  ";
        lines.splice(braceLine + 1, 0, `${indent}beforeLoad: (ctx) => ${guardConfig.guard}(ctx.context),`);
        modified = lines.join("\n");
      }
    }
  }

  fs.writeFileSync(filePath, modified, "utf-8");
  return { status: "updated", guard: guardConfig.guard };
}

// Process all files
const files = fs.readdirSync(ROUTES_DIR).filter(f => f.endsWith(".tsx"));

let updated = 0;
let skipped = 0;

for (const file of files) {
  // Skip directories and special files
  if (SKIP_PATTERNS.some(p => file === p || file.startsWith(p))) {
    skipped++;
    continue;
  }

  const filePath = path.join(ROUTES_DIR, file);
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    skipped++;
    continue;
  }

  const result = addGuardToFile(filePath);
  if (result.status === "updated") {
    console.log(`✅ ${file} → ${result.guard}`);
    updated++;
  } else {
    console.log(`⏭️  ${file} — ${result.reason}`);
    skipped++;
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`);