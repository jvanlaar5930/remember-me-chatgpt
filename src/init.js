import fs from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { updateGitignoreFile } from "./gitignore.js";
import { getProjectName } from "./projectName.js";
import { applyTemplateVariables, validateTemplateName } from "./templateResolver.js";

const GENERATED_BY = "create-chat-gpt-repo-memory";
const MANAGED_AGENTS_START = "<!-- create-chat-gpt-repo-memory:start -->";
const MANAGED_AGENTS_END = "<!-- create-chat-gpt-repo-memory:end -->";

const FILES_TO_GENERATE = [
  { source: "AGENTS.md", target: "AGENTS.md" },
  { source: "project-map.md", target: ".agent-memory/project-map.md" },
  { source: "architecture.md", target: ".agent-memory/architecture.md" },
  { source: "conventions.md", target: ".agent-memory/conventions.md" },
  { source: "workflows.md", target: ".agent-memory/workflows.md" },
  { source: "update-project-map.md", target: ".agent-memory/update-project-map.md" },
  { source: "prompts/fill-project-map.md", target: ".agent-memory/prompts/fill-project-map.md" },
  { source: "prompts/start-session.md", target: ".agent-memory/prompts/start-session.md" }
];

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

function normalizeNewlines(content) {
  return content.replace(/\r\n/g, "\n");
}

function createManagedAgentsBlock(renderedTemplate) {
  const body = normalizeNewlines(renderedTemplate)
    .replace(/^# .*?\n+/, "")
    .trim();

  return [
    MANAGED_AGENTS_START,
    "## Repo Memory Instructions",
    "",
    body,
    MANAGED_AGENTS_END
  ].join("\n");
}

function isRepoMemoryAwareAgentsFile(content) {
  return [
    ".agent-memory/project-map.md",
    ".agent-memory/",
    "Use AGENTS.md as your operating instructions",
    "Project Memory Workflow"
  ].some((needle) => content.includes(needle));
}

async function promptForAgentsConflict(relativeTarget) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return "skip";
  }

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    while (true) {
      const answer = (await readline.question(
        `${relativeTarget} already exists and could not be merged automatically. Choose [s]kip or [o]verwrite: `
      ))
        .trim()
        .toLowerCase();

      if (answer === "s" || answer === "skip") {
        return "skip";
      }

      if (answer === "o" || answer === "overwrite") {
        return "overwrite";
      }
    }
  } finally {
    readline.close();
  }
}

async function handleExistingAgentsFile({
  targetPath,
  relativeTarget,
  existingContent,
  renderedContent,
  result
}) {
  const normalizedExisting = normalizeNewlines(existingContent);
  const managedBlock = createManagedAgentsBlock(renderedContent);

  if (
    normalizedExisting.includes(MANAGED_AGENTS_START) &&
    normalizedExisting.includes(MANAGED_AGENTS_END)
  ) {
    const nextContent = normalizedExisting.replace(
      new RegExp(
        `${MANAGED_AGENTS_START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${MANAGED_AGENTS_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
      ),
      managedBlock
    );

    if (nextContent === normalizedExisting) {
      result.skipped.push(relativeTarget);
      return;
    }

    await fs.writeFile(targetPath, nextContent, "utf8");
    result.overwritten.push(`${relativeTarget} (merged)`);
    return;
  }

  if (!isRepoMemoryAwareAgentsFile(existingContent)) {
    const nextContent = `${normalizedExisting.trimEnd()}\n\n${managedBlock}\n`;
    await fs.writeFile(targetPath, nextContent, "utf8");
    result.overwritten.push(`${relativeTarget} (merged)`);
    return;
  }

  const choice = await promptForAgentsConflict(relativeTarget);

  if (choice === "overwrite") {
    await fs.writeFile(targetPath, renderedContent, "utf8");
    result.overwritten.push(relativeTarget);
    return;
  }

  result.skipped.push(relativeTarget);
}

export async function initChatGptRepoMemory(options) {
  const rootDir = path.resolve(options.rootDir);
  const template = options.template ?? "generic";

  validateTemplateName(template);
  await fs.mkdir(rootDir, { recursive: true });

  const variables = {
    PROJECT_NAME: getProjectName(rootDir),
    TEMPLATE_NAME: template,
    GENERATED_BY: GENERATED_BY
  };

  const result = {
    rootDir,
    template,
    created: [],
    overwritten: [],
    skipped: [],
    gitignoreStatus: "skipped"
  };

  for (const file of FILES_TO_GENERATE) {
    const templatePath = path.join(packageRoot, "templates", template, file.source);
    const targetPath = path.join(rootDir, file.target);
    const relativeTarget = path.relative(rootDir, targetPath) || file.target;
    const templateContent = await fs.readFile(templatePath, "utf8");
    const rendered = applyTemplateVariables(templateContent, variables);

    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    let exists = false;
    try {
      await fs.access(targetPath);
      exists = true;
    } catch (error) {
      if (error && error.code !== "ENOENT") {
        throw error;
      }
    }

    if (!exists) {
      await fs.writeFile(targetPath, rendered, "utf8");
      result.created.push(relativeTarget.replace(/\\/g, "/"));
      continue;
    }

    if (options.force) {
      await fs.writeFile(targetPath, rendered, "utf8");
      result.overwritten.push(relativeTarget.replace(/\\/g, "/"));
      continue;
    }

    if (file.target === "AGENTS.md") {
      const existingContent = await fs.readFile(targetPath, "utf8");
      await handleExistingAgentsFile({
        targetPath,
        relativeTarget: relativeTarget.replace(/\\/g, "/"),
        existingContent,
        renderedContent: rendered,
        result
      });
      continue;
    }

    result.skipped.push(relativeTarget.replace(/\\/g, "/"));
  }

  if (options.updateGitignore) {
    result.gitignoreStatus = await updateGitignoreFile(rootDir);
  }

  return result;
}
