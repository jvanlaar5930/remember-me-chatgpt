# Fill Project Map Prompt

Inspect this repository and fill in the repo memory files.

Start with:

- `AGENTS.md`
- `.agent-memory/project-map.md`
- `.agent-memory/architecture.md`
- `.agent-memory/conventions.md`
- `.agent-memory/workflows.md`
- `.agent-memory/update-project-map.md`

## Goal

Create a concise, durable project memory that helps future ChatGPT/Codex-style coding sessions understand this repository without repeatedly scanning the entire codebase.

## Rules

- Start with `.agent-memory/project-map.md`.
- Keep `.agent-memory/project-map.md` concise enough to be useful at the beginning of a future coding session.
- Move detailed explanations into `.agent-memory/architecture.md`, `.agent-memory/conventions.md`, and `.agent-memory/workflows.md`.
- Do not scan generated, build, cache, vendor, dependency, IDE, coverage, or local environment folders unless directly relevant.
- Do not include secrets, credentials, tokens, private keys, connection strings, or sensitive values.
- Mark uncertain items as `Needs verification`.
- Do not invent facts.
- Prefer facts grounded in repository files over guesses.
- When finished, summarize files updated, domains discovered, unclear areas, and suggested next improvements.

## Suggested Scan Order

1. Top-level README and documentation
2. Workspace, solution, package, manifest, or project files
3. Application startup, command, service, or entry-point files
4. Configuration files, without exposing secret values
5. Main source folders
6. Test or validation folders
7. Build, CI/CD, deployment, infrastructure, or release files
8. Scripts and operational tooling
