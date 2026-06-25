import fs from "node:fs/promises";
import path from "node:path";

const GITIGNORE_MARKER = ".agent-memory-local/";
const GITIGNORE_BLOCK = [
  "# Local agent memory/cache",
  ".agent-memory-local/",
  ".agent-memory/**/*.db",
  ".agent-memory/**/*.sqlite",
  ".agent-memory/**/*.sqlite3",
  ".agent-memory/**/*.log"
].join("\n");

const LEGACY_PREFIX = "\\." + "chatgpt";
const LEGACY_PATTERNS = [
  new RegExp("^# .*" + "chatgpt" + ".*$", "i"),
  new RegExp(`^${LEGACY_PREFIX}-local/$`),
  new RegExp(`^${LEGACY_PREFIX}/\\*\\*/\\*\\.db$`),
  new RegExp(`^${LEGACY_PREFIX}/\\*\\*/\\*\\.sqlite$`),
  new RegExp(`^${LEGACY_PREFIX}/\\*\\*/\\*\\.sqlite3$`),
  new RegExp(`^${LEGACY_PREFIX}/\\*\\*/\\*\\.log$`)
];

function stripLegacyLines(content) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const filtered = [];
  let changed = false;

  for (const line of lines) {
    const isLegacy = LEGACY_PATTERNS.some((pattern) => pattern.test(line.trim()));
    if (isLegacy) {
      changed = true;
      continue;
    }

    filtered.push(line);
  }

  const normalized = filtered.join("\n").replace(/\n{3,}/g, "\n\n");
  return {
    changed,
    content: normalized
  };
}

function appendManagedBlock(content) {
  const trimmed = content.replace(/\s*$/, "");
  if (trimmed.length === 0) {
    return `${GITIGNORE_BLOCK}\n`;
  }

  return `${trimmed}\n\n${GITIGNORE_BLOCK}\n`;
}

export async function updateGitignoreFile(rootDir) {
  const gitignorePath = path.join(rootDir, ".gitignore");
  let current = "";

  try {
    current = await fs.readFile(gitignorePath, "utf8");
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }

  const { changed: removedLegacy, content: withoutLegacy } = stripLegacyLines(current);

  if (withoutLegacy.includes(GITIGNORE_MARKER)) {
    if (!removedLegacy) {
      return "unchanged";
    }

    await fs.writeFile(gitignorePath, `${withoutLegacy.replace(/\s*$/, "")}\n`, "utf8");
    return "updated";
  }

  const nextContent = appendManagedBlock(withoutLegacy);
  await fs.writeFile(gitignorePath, nextContent, "utf8");
  return "updated";
}
