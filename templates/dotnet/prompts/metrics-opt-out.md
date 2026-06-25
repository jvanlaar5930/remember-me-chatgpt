# Metrics Opt-Out Prompt

Use this prompt when the user wants to skip repo-memory session metrics.

## Instruction

For this session, do not print the repo-memory session metrics summary unless the user explicitly asks for it again.

Do not read `.agent-memory/prompts/session-metrics.md` automatically.

Do not report token usage, file counts, search counts, validation counts, irrelevant file counts, or memory-maintenance counts unless directly requested.

Continue following:

- `AGENTS.md`
- `.agent-memory/project-map.md`
- `.agent-memory/architecture.md` when relevant
- `.agent-memory/conventions.md` when relevant
- `.agent-memory/workflows.md` when relevant
- `.agent-memory/update-project-map.md` when relevant

This opt-out affects only metrics reporting.

It does not disable repo memory.

It does not disable project-map usage.

It does not disable memory-file updates when durable project knowledge changes.

Do not write this preference to disk unless the user explicitly asks.
