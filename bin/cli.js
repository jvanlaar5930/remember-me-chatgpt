#!/usr/bin/env node

import { Command } from "commander";
import { resolveTargetDirectory } from "../src/paths.js";
import { initChatGptRepoMemory } from "../src/init.js";
import { SUPPORTED_TEMPLATES } from "../src/templateResolver.js";

const program = new Command();

program
  .name("create-chat-gpt-repo-memory")
  .description("Scaffold Git-tracked repo memory files for ChatGPT and Codex-style coding workflows.")
  .version("0.1.0");

function addOptions(cmd) {
  return cmd
    .option("--force", "Overwrite existing generated files.", false)
    .option("--no-gitignore", "Do not update .gitignore.")
    .option("--template <name>", `Template to use. Supported values: ${SUPPORTED_TEMPLATES.join(", ")}.`, "generic")
    .option("--cwd <path>", "Directory where files should be created.", process.cwd());
}

async function runInit(options) {
  const { force, gitignore: updateGitignore, template, cwd } = options;

  let rootDir;
  try {
    rootDir = await resolveTargetDirectory(cwd);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  let result;
  try {
    result = await initChatGptRepoMemory({ rootDir, force, updateGitignore, template });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { created, overwritten, skipped, gitignoreStatus } = result;

  console.log("\nChatGPT/Codex repo memory initialized.\n");

  if (created.length > 0) {
    console.log("Created:");
    for (const f of created) console.log(`  - ${f}`);
    console.log();
  }

  if (overwritten.length > 0) {
    console.log("Overwritten:");
    for (const f of overwritten) console.log(`  - ${f}`);
    console.log();
  }

  if (skipped.length > 0) {
    console.log("Skipped:");
    for (const f of skipped) console.log(`  - ${f}`);
    console.log();
  }

  console.log(`Gitignore: ${gitignoreStatus}\n`);

  console.log("Next steps:");
  console.log("  1. Commit AGENTS.md and .agent-memory/ files.");
  console.log("  2. For Codex-style agents, start from the repo root so the agent can read AGENTS.md.");
  console.log("  3. For ChatGPT Projects, add AGENTS.md and .agent-memory/ as project files or make sure they are available in the repository context.");
  console.log('  4. Kick off the initial map fill with:');
  console.log('     "Use AGENTS.md as your operating instructions for this repository. Then read .agent-memory/prompts/fill-project-map.md and execute it. Fill or update the .agent-memory files using only verified repository facts. Do not include secrets."');
  console.log();
  console.log('Optional metrics opt-out:');
  console.log('  Ask: "Read .agent-memory/prompts/metrics-opt-out.md and follow it for this session."');
  console.log();
  console.log('Optional metrics opt-in:');
  console.log('  Ask: "Read .agent-memory/prompts/metrics-opt-in.md and follow it for this session."');
  console.log();
}

addOptions(program);

program.action(async () => {
  await runInit(program.opts());
});

program.parseAsync(process.argv).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
