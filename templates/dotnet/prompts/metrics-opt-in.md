# Metrics Opt-In Prompt

Use this prompt when the user wants to enable repo-memory session metrics again.

## Instruction

For this session, print the repo-memory session metrics summary at the end of the task.

At the end of the session, read:

```text
.agent-memory/prompts/session-metrics.md
```

Then print the metrics summary to the terminal/chat output.

Do not write metrics to disk.

Do not create metrics files.

Do not create telemetry, analytics, logs, databases, local reports, or network calls.

If exact token usage is unavailable, write `unknown`.

Continue following:

* `AGENTS.md`
* `.agent-memory/project-map.md`
* `.agent-memory/architecture.md` when relevant
* `.agent-memory/conventions.md` when relevant
* `.agent-memory/workflows.md` when relevant
* `.agent-memory/update-project-map.md` when relevant

This opt-in affects only terminal/chat metrics reporting.
