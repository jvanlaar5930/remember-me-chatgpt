#!/usr/bin/env node

import path from "node:path";
import { Command } from "commander";
import { initChatGptRepoMemory } from "../src/init.js";
import { SUPPORTED_TEMPLATES } from "../src/templateResolver.js";

function printListSection(title, items) {
  if (items.length === 0) {
    return;
  }

  console.log(`${title}:`);
  for (const item of items) {
    console.log(`  - ${item}`);
  }
  console.log("");
}

function printSummary(result) {
  console.log("ChatGPT/Codex repo memory initialized.");
  console.log("");

  printListSection("Created", result.created);
  printListSection("Overwritten", result.overwritten);
  printListSection("Skipped", result.skipped);

  console.log(`Gitignore: ${result.gitignoreStatus}`);
  console.log("");
  console.log("Next steps:");
  console.log("  1. Commit AGENTS.md and .agent-memory/ files.");
  console.log("  2. For Codex-style agents, start from the repo root so the agent can read AGENTS.md.");
  console.log("  3. For ChatGPT Projects, add AGENTS.md and .agent-memory/ as project files or make sure they are available in the repository context.");
  console.log("  4. Kick off the initial map fill with:");
  console.log('     "Use AGENTS.md as your operating instructions for this repository. Then read .agent-memory/prompts/fill-project-map.md and execute it. Fill or update the .agent-memory files using only verified repository facts. Do not include secrets."');
}

async function runInit(options) {
  const result = await initChatGptRepoMemory({
    rootDir: path.resolve(options.cwd ?? process.cwd()),
    force: Boolean(options.force),
    updateGitignore: options.gitignore,
    template: options.template
  });

  printSummary(result);
}

const program = new Command();

program
  .name("create-chat-gpt-repo-memory")
  .description("Scaffold Git-tracked repo memory files for ChatGPT and Codex-style coding workflows.")
  .showHelpAfterError();

const initCommand = new Command("init");

initCommand
  .description("Initialize AGENTS.md and .agent-memory/ templates.")
  .option("--force", "Overwrite existing generated files.")
  .option("--no-gitignore", "Do not update .gitignore.")
  .option("--template <name>", `Template to use. Supported values: ${SUPPORTED_TEMPLATES.join(", ")}.`, "generic")
  .option("--cwd <path>", "Directory where files should be created.", process.cwd())
  .action(async (options) => {
    await runInit(options);
  });

program
  .option("--force", "Overwrite existing generated files.")
  .option("--no-gitignore", "Do not update .gitignore.")
  .option("--template <name>", `Template to use. Supported values: ${SUPPORTED_TEMPLATES.join(", ")}.`, "generic")
  .option("--cwd <path>", "Directory where files should be created.", process.cwd())
  .action(async (options) => {
    await runInit(options);
  });

program.addCommand(initCommand);

try {
  await program.parseAsync(process.argv);
  process.exitCode = 0;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
