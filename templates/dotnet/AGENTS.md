# Agent Instructions for {{PROJECT_NAME}}

Before answering project-specific questions:

1. Read `.agent-memory/project-map.md`.
2. Use the project map to identify the relevant domain, files, and conventions.
3. Read only the specific files needed for the task.
4. Do not scan generated, build, cache, vendor, or dependency folders unless explicitly asked.
5. Prefer existing project patterns over introducing new architecture.
6. When changing code, identify tests or validation steps that should be added or updated.
7. When discovering important durable project facts, update the most specific relevant file under `.agent-memory/`.

## Project Memory Workflow

Use this order for project-specific work:

1. Read `.agent-memory/project-map.md`.
2. Read `.agent-memory/architecture.md` if the task involves architecture, layering, dependency flow, integrations, or background processing.
3. Read `.agent-memory/conventions.md` before making code-style, testing, logging, naming, or pattern decisions.
4. Read `.agent-memory/workflows.md` before changing build, test, deployment, database, release, or operational workflows.
5. Read source files only after narrowing the task to the relevant area.

## Project Memory Update Rule

After making changes, decide whether the change affects durable project knowledge.

Update `.agent-memory/` files only when the change affects:

- repository structure
- architecture
- major domains
- entry points
- dependency flow
- data access
- external integrations
- build, test, deployment, or release workflow
- coding conventions
- operational concerns
- known gotchas

Do not update project memory for small local implementation changes.

When updating memory:

1. Update the most specific file possible.
2. Keep `.agent-memory/project-map.md` concise.
3. Do not duplicate source code.
4. Do not include secrets.
5. If memory files conflict with current code, trust the current code and update memory.
6. Mark uncertain items as `Needs verification`.

## Multi-Agent / Multi-Session Rule

Treat `.agent-memory/` as shared project documentation.

If multiple agents or sessions are working on the same project:

- Keep memory changes in the same branch as the related code change.
- Do not update `.agent-memory/project-map.md` unless the high-level project index changed.
- Prefer updating detailed supporting files instead of the top-level project map.
- Resolve memory conflicts like documentation:
  - keep facts that match current code
  - remove stale facts
  - keep shorter wording when both versions are correct
  - mark uncertain items as `Needs verification`

## .NET-Specific Guidance

- Prefer existing dependency injection patterns.
- Check project files (`*.csproj`) before adding packages.
- Look for solution files (`*.sln`) to understand project boundaries.
- Identify test framework before writing tests.
- Do not assume EF Core, EF6, Dapper, or raw ADO.NET without checking the code.
- Be careful with generated database-first files.
- Do not scan `bin/`, `obj/`, `.vs/`, or generated EF files unless directly relevant.

## Do Not Scan By Default

Do not scan these unless directly relevant:

- `.git/`
- `bin/`
- `obj/`
- `node_modules/`
- `vendor/`
- `dist/`
- `build/`
- `target/`
- `out/`
- `.next/`
- `.nuxt/`
- `.turbo/`
- `.cache/`
- `.pytest_cache/`
- `__pycache__/`
- `.venv/`
- `venv/`
- `.gradle/`
- `.vs/`
- `.idea/`
- `.vscode/`
- `coverage/`
- generated files
- package/cache folders
- local environment folders

## Project Memory Files

Project context is stored in:

- `.agent-memory/project-map.md`
- `.agent-memory/architecture.md`
- `.agent-memory/conventions.md`
- `.agent-memory/workflows.md`
- `.agent-memory/update-project-map.md`

## Kickoff Prompts

Initial map fill:

```text
Use AGENTS.md as your operating instructions for this repository. Then read .agent-memory/prompts/fill-project-map.md and execute it. Fill or update the .agent-memory files using only verified repository facts. Do not include secrets.
```

Future session start:

```text
Use AGENTS.md as your operating instructions, then read .agent-memory/prompts/start-session.md and follow it for this task.
```
