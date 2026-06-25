# create-chat-gpt-repo-memory

`create-chat-gpt-repo-memory` scaffolds Git-tracked repo memory files for ChatGPT and Codex-style coding workflows.

It creates a root `AGENTS.md` instruction file plus a shared `.agent-memory/` folder containing durable project memory templates. The package only scaffolds structure and template content. It does not analyze the target repository.

## Why `AGENTS.md` Instead of `CHATGPT.md`

This package uses `AGENTS.md` because that is the repo instruction convention used by Codex-style coding agents.

That also keeps the repository layout simple for mixed usage:

- Codex-style agents can start from `AGENTS.md`
- ChatGPT Projects can upload or reference the same files
- teams keep one Git-tracked instruction surface instead of multiple parallel formats

## Why `.agent-memory/` Instead of `.chatgpt/`

This package uses `.agent-memory/` as a plain Git-tracked documentation folder for shared repository memory:

- easy to version in Git
- readable by both human contributors and coding agents
- neutral naming that works across tools
- local caches can still stay untracked through `.gitignore`

It does not generate `.chatgpt/`, and it does not generate `CHATGPT.md`.

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

Default command:

```bash
create-chat-gpt-repo-memory
```

Explicit `init`:

```bash
create-chat-gpt-repo-memory init
```

CLI examples:

```bash
npx create-chat-gpt-repo-memory
create-chat-gpt-repo-memory init --force
create-chat-gpt-repo-memory init --no-gitignore
create-chat-gpt-repo-memory init --template dotnet
create-chat-gpt-repo-memory init --cwd ../some-project
```

## Options

- `--force`: overwrite existing generated files
- `--no-gitignore`: skip `.gitignore` updates
- `--template <name>`: choose `generic` or `dotnet`
- `--cwd <path>`: target directory to scaffold into

## Files Generated

The CLI creates:

```text
AGENTS.md
.agent-memory/
  project-map.md
  architecture.md
  conventions.md
  workflows.md
  update-project-map.md
  prompts/
    fill-project-map.md
    start-session.md
```

It does not create `.agent-memory-local/`. That path is only added to `.gitignore`.

## Template Options

- `generic`: baseline repository memory template
- `dotnet`: generic template plus .NET-specific guidance and sections

Template variables:

- `{{PROJECT_NAME}}`
- `{{TEMPLATE_NAME}}`
- `{{GENERATED_BY}}`

## Overwrite Safety

The CLI never silently overwrites generated files.

- if a file does not exist, it is created
- if a file exists and `--force` is not set, it is skipped by default
- if a file exists and `--force` is set, it is overwritten

For an existing `AGENTS.md`, the CLI is more careful:

- if the file does not already contain repo-memory guidance, the CLI appends a managed repo-memory instructions block instead of replacing the whole file
- if that managed block already exists, the CLI updates just that block on later runs
- if the existing `AGENTS.md` already contains its own repo-memory guidance and the CLI cannot safely merge it, the CLI asks whether to skip or overwrite when running interactively
- in a non-interactive environment, that unmergeable case falls back to skip

## `.gitignore` Behavior

Unless `--no-gitignore` is used, the CLI updates or creates `.gitignore` and appends this local-only block when needed:

```gitignore

# Local agent memory/cache
.agent-memory-local/
.agent-memory/**/*.db
.agent-memory/**/*.sqlite
.agent-memory/**/*.sqlite3
.agent-memory/**/*.log
```

The update is idempotent. If `.gitignore` already contains `.agent-memory-local/`, the block is not appended again.

The Git-tracked memory files themselves are never ignored by this package.

## Notes for Codex-Style Usage

- `AGENTS.md` is the root instruction file.
- Codex-style agents should start from the repo root so `AGENTS.md` can be discovered.
- Keep `.agent-memory/project-map.md` concise and move detail into supporting memory files.

## Notes for ChatGPT Project Usage

- Add `AGENTS.md` and `.agent-memory/` files to the repository.
- ChatGPT Projects do not automatically treat `.agent-memory/` as a special folder.
- Upload or reference these files in the ChatGPT Project as needed, or make sure they are available in repository context.
- Start future project sessions by telling ChatGPT to read `AGENTS.md` and the relevant `.agent-memory/` files.
- Update `.agent-memory/` files only when durable project knowledge changes.

## Initial Map-Fill Prompt

```text
Use AGENTS.md as your operating instructions for this repository. Then read .agent-memory/prompts/fill-project-map.md and execute it. Fill or update the .agent-memory files using only verified repository facts. Do not include secrets.
```

## Future Session-Start Prompt

```text
Use AGENTS.md as your operating instructions, then read .agent-memory/prompts/start-session.md and follow it for this task.
```

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

## Remove the Package Fully

If you installed the package globally, remove it with:

```bash
npm uninstall -g create-chat-gpt-repo-memory
```

If you linked it locally for development, remove the global link with:

```bash
npm unlink -g create-chat-gpt-repo-memory
```

If you also want to remove the scaffolded repo memory files from a target repository, delete:

```text
AGENTS.md
.agent-memory/
```

Then remove the local cache ignore block from `.gitignore` if you no longer want it:

```gitignore
# Local agent memory/cache
.agent-memory-local/
.agent-memory/**/*.db
.agent-memory/**/*.sqlite
.agent-memory/**/*.sqlite3
.agent-memory/**/*.log
```

## License

MIT
