# Updating the Project Map

Use this file as maintenance guidance for repo memory.

## When to Update

Update `.agent-memory/` memory files when discovering or changing durable project facts such as:

- New major domains
- Important entry points
- Critical files
- Non-obvious configuration behavior
- Data access or state management patterns
- External integrations
- Testing or validation conventions
- Build, deployment, release, or operational behavior
- Known gotchas
- Significant architecture or dependency-flow changes

Do not update project memory for every code change.

## Where to Update

Use the most specific file possible:

- `.agent-memory/project-map.md` for concise high-level index changes
- `.agent-memory/architecture.md` for architecture, dependency flow, data flow, and integration design
- `.agent-memory/conventions.md` for coding, naming, testing, logging, and organization patterns
- `.agent-memory/workflows.md` for build, test, validation, deployment, release, debugging, and operational steps

## Multi-Agent Memory Updates

When multiple agents are working concurrently:

- Do not update `.agent-memory/project-map.md` unless the high-level project index changed.
- Keep memory changes in the same branch as the code change that caused them.
- If a memory file conflicts during merge, resolve it like documentation:
  - keep facts that match current code
  - remove stale facts
  - keep the shorter wording when both are correct
  - mark uncertain items as `Needs verification`

## Rules

- Keep summaries short and useful.
- Do not duplicate entire source files.
- Do not include secrets, credentials, tokens, private keys, connection strings, or sensitive values.
- Mark uncertain items as `Needs verification`.
- Do not invent facts.
- Prefer facts grounded in repository files over guesses.
- Remove stale statements when contradicted by code.
- Move detailed explanations out of `.agent-memory/project-map.md` and into supporting memory files.

## Maintenance Workflow

1. Read `.agent-memory/project-map.md`.
2. Inspect only the relevant project files.
3. Decide whether durable project knowledge changed.
4. If yes, update the smallest relevant memory section.
5. Keep the top-level project map concise.
6. Add detailed notes to supporting memory files when needed.
