# Start Session Prompt

Use `AGENTS.md` as your operating instructions for this repository.

Then read:

- `.agent-memory/project-map.md`
- `.agent-memory/architecture.md` if the task involves architecture, layering, dependency flow, integrations, or background processing
- `.agent-memory/conventions.md` if the task involves coding patterns, tests, naming, logging, or style
- `.agent-memory/workflows.md` if the task involves build, test, deployment, release, data, or operational workflows

Use the project map to narrow the task before reading source files.

Do not scan the entire repository unless necessary.

Do not scan generated, build, cache, vendor, dependency, IDE, coverage, or local environment folders unless directly relevant.

Do not include secrets, credentials, tokens, private keys, connection strings, or sensitive values in responses or memory files.

If you discover durable project knowledge, update the most specific relevant file under `.agent-memory/`.

If project memory conflicts with current code, trust the current code and update the memory.

## .NET Session Notes

For .NET repositories, check solution and project boundaries before making changes.

Prefer existing dependency injection, logging, configuration, test, and data-access patterns.

Do not assume a specific data access technology until verified from repository files.
