# Conventions: remember-me-chatgpt

## Naming Conventions

- Source files: `camelCase.js` (e.g., `gitignore.js`, `projectName.js`, `templateResolver.js`)
- Exported functions: camelCase (e.g., `initChatGptRepoMemory`, `updateGitignoreFile`, `applyTemplateVariables`)
- Exported constants: SCREAMING_SNAKE_CASE (e.g., `SUPPORTED_TEMPLATES`, `GENERATED_BY`, `FILES_TO_GENERATE`)
- Template variable placeholders: `{{UPPER_SNAKE_CASE}}` (e.g., `{{PROJECT_NAME}}`)

## Project Organization

- `bin/` — CLI entry point only; no business logic
- `src/` — all business logic; each file has a single focused responsibility
- `templates/` — static template files shipped with the package; one subdirectory per template name
- `.agent-memory/` — this project's own repo memory (meta-usage of the tool's own output)

## Dependency Management

- Single runtime dependency: `commander` ^12.1.0
- All other dependencies are Node.js built-ins
- No dev dependencies, no build toolchain, no transpilation

## Application Structure

- ESM throughout (`"type": "module"` in package.json); all imports use `.js` extensions
- No classes; module-level exports of named functions and constants
- `src/init.js` is the only file with meaningful complexity; all others are thin utilities

## Testing Conventions

- No automated test suite
- Manual test plan in `README.md` covers: fresh scaffold, re-run (idempotent), `--force`, `--template dotnet`, invalid template, stale-term grep
- Validation is done by running `node bin/cli.js` against a temp directory and checking file presence

## Logging Conventions

- `console.log` for normal output (created/overwritten/skipped file lists, next steps)
- `console.error` for errors before `process.exit(1)`
- No logging framework or structured logging

## Error Handling Conventions

- All async errors from core functions are caught in `bin/cli.js` and exit with code 1
- File-not-found (`ENOENT`) is handled inline; other fs errors propagate up
- Template placeholder errors throw `Error` with a descriptive message listing the unreplaced keys

## Data Access Conventions

- All filesystem access uses `node:fs/promises` (async)
- Paths are always resolved to absolute paths before use (`path.resolve`)
- Relative paths used only in result output and user-facing messages (normalized with forward slashes via `.replace(/\\/g, "/")`)

## API or Interface Conventions

- `initChatGptRepoMemory(options)` returns `{ rootDir, template, created[], overwritten[], skipped[], gitignoreStatus }`
- `gitignoreStatus` is one of: `"updated"`, `"unchanged"`, `"skipped"`
- CLI prints each array as a bullet list; empty arrays are silently omitted

## Frontend or UI Conventions

- Not applicable (CLI tool only)

## Infrastructure Conventions

- `"files"` in `package.json` controls what is published: `bin`, `src`, `templates`, `README.md`, `LICENSE`
- `node_modules/` is never committed
- `.agent-memory-local/` is gitignored (added by the tool's own `.gitignore` update)

## Documentation Conventions

- `README.md` is the canonical user-facing documentation
- Template files in `templates/` serve as the documentation seen by end-users of the scaffold
- `.agent-memory/` serves as living project memory for AI coding sessions
