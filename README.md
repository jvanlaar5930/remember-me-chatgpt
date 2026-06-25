# create-chat-gpt-repo-memory

`create-chat-gpt-repo-memory` scaffolds Git-tracked repo memory files for ChatGPT and Codex-style coding workflows.

It creates a root `AGENTS.md` instruction file plus a shared `.agent-memory/` folder containing durable project memory templates. The package scaffolds structure and template content only. It does not analyze the target repository.

## Why `AGENTS.md` Instead of `CHATGPT.md`

This package uses `AGENTS.md` because that is the Codex-style repository instruction convention.

That keeps one shared instruction surface for mixed workflows:

- Codex-style agents can start from `AGENTS.md`
- ChatGPT Projects can upload or reference the same files
- Teams can track one repo-memory structure in Git

This package does not generate `CHATGPT.md`.

## Why `.agent-memory/` Instead of `.chatgpt/`

This package uses `.agent-memory/` as shared Git-tracked project memory:

- readable by humans and coding agents
- easy to version in Git
- neutral naming that works across tools
- separate from local cache artifacts

This package does not generate `.chatgpt/`.

## Installation

Use with `npx`:

```bash
npx create-chat-gpt-repo-memory
```

Or install globally:

```bash
npm install -g create-chat-gpt-repo-memory
create-chat-gpt-repo-memory
```

## Usage

```bash
npx create-chat-gpt-repo-memory
npx create-chat-gpt-repo-memory --template dotnet
npx create-chat-gpt-repo-memory --force
npx create-chat-gpt-repo-memory --no-gitignore
npx create-chat-gpt-repo-memory --cwd ../some-project
```

## Options

- `--force`: overwrite existing generated files
- `--no-gitignore`: skip `.gitignore` updates
- `--template <name>`: choose `generic` or `dotnet`
- `--cwd <path>`: target directory to scaffold into

## Files Generated

```text
AGENTS.md
.agent-memory/project-map.md
.agent-memory/architecture.md
.agent-memory/conventions.md
.agent-memory/workflows.md
.agent-memory/update-project-map.md
.agent-memory/prompts/fill-project-map.md
.agent-memory/prompts/start-session.md
```

The package does not create `.agent-memory-local/`. That path is added to `.gitignore` only.

## Template Options

- `generic`: baseline repository memory template
- `dotnet`: generic template plus .NET-specific guidance

Template variables:

- `{{PROJECT_NAME}}`
- `{{TEMPLATE_NAME}}`
- `{{GENERATED_BY}}`

## Initial Map-Fill Prompt

```text
Use AGENTS.md as your operating instructions for this repository. Then read .agent-memory/prompts/fill-project-map.md and execute it. Fill or update the .agent-memory files using only verified repository facts. Do not include secrets.
```

## Future Session-Start Prompt

```text
Use AGENTS.md as your operating instructions, then read .agent-memory/prompts/start-session.md and follow it for this task.
```

## Overwrite Safety

The CLI never silently overwrites generated files.

- If a file does not exist, it is created.
- If a file exists and `--force` is not set, it is skipped by default.
- If a file exists and `--force` is set, it is overwritten.

For an existing `AGENTS.md`, the CLI is more careful:

- If the file does not already contain repo-memory guidance, the CLI appends a managed repo-memory instructions block instead of replacing the whole file.
- If that managed block already exists, the CLI updates just that block on later runs.
- If the existing `AGENTS.md` already contains its own repo-memory guidance and the CLI cannot safely merge it, the CLI asks whether to skip or overwrite when running interactively.
- In a non-interactive environment, that unmergeable case falls back to skip.

## `.gitignore` Behavior

Unless `--no-gitignore` is used, the CLI updates or creates `.gitignore` and adds this local-only block when needed:

```gitignore
# Local agent memory/cache
.agent-memory-local/
.agent-memory/**/*.db
.agent-memory/**/*.sqlite
.agent-memory/**/*.sqlite3
.agent-memory/**/*.log
```

The update is idempotent. If `.gitignore` already contains `.agent-memory-local/`, the block is not appended again.

The package also removes legacy `.chatgpt-local/` and `.chatgpt/**/*.(db|sqlite|sqlite3|log)` ignore lines when it updates `.gitignore`.

The Git-tracked memory files themselves are never ignored by this package.

## Notes for Codex-Style Usage

- `AGENTS.md` is the root instruction file.
- Codex-style agents should start from the repo root so `AGENTS.md` can be discovered.
- Keep `.agent-memory/project-map.md` concise and move detail into supporting memory files.

## Notes for ChatGPT Project Usage

- ChatGPT Projects do not automatically treat `.agent-memory/` as a magic folder.
- Add `AGENTS.md` and `.agent-memory/` files to the project, or make sure they are available in repository context.
- Start future sessions by telling ChatGPT to read `AGENTS.md` and the relevant `.agent-memory/` files.

## Publishing

```bash
npm login
npm publish --access public
```

## Local Testing

```bash
npm link
create-chat-gpt-repo-memory --cwd ../some-test-repo
```

## Manual Test Plan

Create a temporary test project:

```bash
mkdir /tmp/chatgpt-memory-test
cd /tmp/chatgpt-memory-test
node /path/to/create-chat-gpt-repo-memory/bin/cli.js
```

Verify:

```text
AGENTS.md exists
.agent-memory/project-map.md exists
.agent-memory/architecture.md exists
.agent-memory/conventions.md exists
.agent-memory/workflows.md exists
.agent-memory/update-project-map.md exists
.agent-memory/prompts/fill-project-map.md exists
.agent-memory/prompts/start-session.md exists
.gitignore contains Local agent memory/cache block
```

Run it again without `--force`.

Expected:

```text
files are skipped
.gitignore is unchanged
no duplicate gitignore block
```

Run with `--force`.

Expected:

```text
existing generated files are overwritten
.gitignore remains unchanged
```

Run with dotnet template:

```bash
mkdir /tmp/chatgpt-memory-dotnet-test
node /path/to/create-chat-gpt-repo-memory/bin/cli.js --template dotnet --cwd /tmp/chatgpt-memory-dotnet-test
```

Expected:

```text
dotnet-specific sections are present
.agent-memory/prompts/start-session.md exists
```

Run against an invalid template:

```bash
node /path/to/create-chat-gpt-repo-memory/bin/cli.js --template invalid
```

Expected:

```text
clear unsupported-template error
exit code 1
```

Search for stale terms:

```bash
grep -R "CHATGPT.md\|\.chatgpt\|CLAUDE.md\|\.claude\|create-claude" .
```

Expected:

```text
No stale references, except intentional README explanation if present.
```

## License

MIT
