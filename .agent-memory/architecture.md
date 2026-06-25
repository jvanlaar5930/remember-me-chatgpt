# Architecture: remember-me-chatgpt

## High-Level Architecture

Single-package Node.js CLI tool. No server, no background processes, no database. The CLI reads templates from the package itself and writes files into a user-supplied target directory.

```
bin/cli.js
  └── src/init.js (initChatGptRepoMemory)
        ├── src/templateResolver.js  (resolve + render templates)
        ├── src/paths.js             (resolve directories)
        ├── src/projectName.js       (derive project name from path)
        └── src/gitignore.js         (.gitignore update)
```

## Major Layers or Components

1. **CLI layer** (`bin/cli.js`): commander setup, option parsing, error formatting, result printing
2. **Scaffold core** (`src/init.js`): iterates `FILES_TO_GENERATE`, renders each template, writes or merges files, returns a result object `{ created, overwritten, skipped, gitignoreStatus }`
3. **Template engine** (`src/templateResolver.js`): simple `{{VAR}}` string replacement; throws on unreplaced placeholders
4. **Filesystem utilities** (`src/gitignore.js`, `src/paths.js`, `src/projectName.js`): thin wrappers around `node:fs/promises` and `node:path`

## Dependency Flow

```
commander (external) --> bin/cli.js
bin/cli.js --> src/init.js, src/paths.js, src/templateResolver.js
src/init.js --> src/gitignore.js, src/projectName.js, src/paths.js, src/templateResolver.js
```

All other dependencies are Node.js built-ins (`node:fs/promises`, `node:path`, `node:url`, `node:readline/promises`).

## Data Flow

1. CLI parses args → resolves `rootDir` via `resolveTargetDirectory`
2. `initChatGptRepoMemory` reads each template file from `<packageRoot>/templates/<template>/<file>`
3. Template content is rendered with `applyTemplateVariables` (substitutes `{{PROJECT_NAME}}`, `{{TEMPLATE_NAME}}`, `{{GENERATED_BY}}`)
4. Each rendered file is written to `<rootDir>/<target>` — created if new, skipped or merged if existing
5. AGENTS.md gets special merge handling (see below)
6. `.gitignore` is updated idempotently
7. Result object is returned to CLI; CLI prints summary

## AGENTS.md Merge Logic (key design detail)

Three cases when `AGENTS.md` already exists and `--force` is not set:

| Condition | Action |
|---|---|
| Managed block markers already present | Replace just the managed block in-place |
| No markers, but file is not repo-memory-aware | Append managed block at end of file |
| No markers, but file already has repo-memory content | Prompt user (s/o); non-TTY → skip |

"Repo-memory-aware" is detected by presence of any of: `.agent-memory/project-map.md`, `.agent-memory/`, `Use AGENTS.md as your operating instructions`, `Project Memory Workflow`.

## External Integrations

- npm registry (publish target only — no runtime integration)
- No external APIs, no network calls at runtime

## Background, Scheduled, or Async Work

None. All operations are synchronous from the user's perspective (async/await over fs, but no background jobs).

## Data Storage and State Management

- No persistent state in the package itself
- Target filesystem is the only stateful output
- All writes are idempotent (re-running without `--force` skips existing files)

## Error Handling and Logging

- Errors from `resolveTargetDirectory` and `initChatGptRepoMemory` are caught in CLI, printed to stderr, and exit with code 1
- File access errors: `ENOENT` is handled gracefully (file-not-found is expected); other `fs` errors propagate
- Template errors (unreplaced placeholders) throw and are caught by CLI error handler
- No logging framework; uses `console.log` / `console.error` directly

## Security and Secrets Handling

- No secrets at any layer
- `.gitignore` update adds patterns to exclude local DB/log files from Git, preventing accidental secret commit in agent cache artifacts
- `--no-gitignore` flag lets users opt out of `.gitignore` changes

## Performance or Scalability Notes

- Generates at most 8 small files; performance is not a concern
- `applyTemplateVariables` iterates variables once per file — negligible

## Architectural Risks or Unclear Areas

- `getPackageRoot()` uses `import.meta.url` from `src/paths.js` to locate the package root — assumes `src/` is one level below the package root; moving files would break template resolution
- No automated tests; correctness relies on manual test plan in README
