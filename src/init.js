import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { updateGitignoreFile } from "./gitignore.js";
import { getProjectName } from "./projectName.js";
import { applyTemplateVariables, validateTemplateName } from "./templateResolver.js";

const GENERATED_BY = "create-chat-gpt-repo-memory";

const FILES_TO_GENERATE = [
  { source: "AGENTS.md", target: "AGENTS.md" },
  { source: "project-map.md", target: ".agent-memory/project-map.md" },
  { source: "architecture.md", target: ".agent-memory/architecture.md" },
  { source: "conventions.md", target: ".agent-memory/conventions.md" },
  { source: "workflows.md", target: ".agent-memory/workflows.md" },
  { source: "update-project-map.md", target: ".agent-memory/update-project-map.md" },
  { source: "prompts/fill-project-map.md", target: ".agent-memory/prompts/fill-project-map.md" }
];

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

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

    result.skipped.push(relativeTarget.replace(/\\/g, "/"));
  }

  if (options.updateGitignore) {
    result.gitignoreStatus = await updateGitignoreFile(rootDir);
  }

  return result;
}
