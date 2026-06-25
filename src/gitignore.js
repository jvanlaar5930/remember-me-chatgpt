import fs from "node:fs/promises";
import path from "node:path";

const GITIGNORE_BLOCK = `
# Local agent memory/cache
.agent-memory-local/
.agent-memory/**/*.db
.agent-memory/**/*.sqlite
.agent-memory/**/*.sqlite3
.agent-memory/**/*.log
`;

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

  if (current.includes(".agent-memory-local/")) {
    return "unchanged";
  }

  const nextContent = `${current.replace(/\s*$/, "")}${GITIGNORE_BLOCK}`;
  await fs.writeFile(gitignorePath, nextContent, "utf8");
  return "updated";
}
