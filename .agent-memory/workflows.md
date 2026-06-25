# Workflows: remember-me-chatgpt

## Add a New Feature

1. Add or modify logic in the relevant `src/` file
2. If adding a new CLI option, add it in `bin/cli.js` via `addOptions()` and thread it through `runInit` → `initChatGptRepoMemory`
3. If adding a new template, add a folder under `templates/` with the same 8 files as `generic/`, register the name in `SUPPORTED_TEMPLATES` in `src/templateResolver.js`
4. Update `README.md` if the feature is user-visible
5. Run manual test plan (see README) against a temp directory

## Add or Update a Test

No automated test runner is configured. Add manual verification steps to the test plan in `README.md`. To run:

```bash
mkdir /tmp/chatgpt-memory-test
node /path/to/create-chat-gpt-repo-memory/bin/cli.js --cwd /tmp/chatgpt-memory-test
```

## Trace a Bug

1. Reproduce with `node bin/cli.js [options]` against a temp directory
2. The main logic is in `src/init.js` (`initChatGptRepoMemory`); trace the `FILES_TO_GENERATE` loop
3. AGENTS.md merge issues: see `handleExistingAgentsFile` and `isRepoMemoryAwareAgentsFile` in `src/init.js`
4. .gitignore issues: see `src/gitignore.js` (`stripLegacyLines`, `appendManagedBlock`)
5. Template rendering issues: see `applyTemplateVariables` in `src/templateResolver.js`

## Modify Data or State-Related Code

Not applicable — no database or persistent state. All state is filesystem files in the target directory.

## Work With Configuration and Secrets

No configuration files or secrets. Do not introduce environment variable reading or config files without documenting them here.

## Update External Integrations

The only external system is the npm registry (publish target). To update publish behavior, edit `package.json` (`"files"`, `"version"`, `"engines"`).

## Build and Run Locally

No build step required.

```bash
# Run directly
node bin/cli.js

# Run with options
node bin/cli.js --template dotnet --cwd ../some-target-repo

# Link globally for testing
npm link
create-chat-gpt-repo-memory --cwd ../some-target-repo
```

## Validate Before Commit

1. Run `node bin/cli.js` against a fresh temp directory — check all 8 files are created
2. Run again without `--force` — check all files are skipped, .gitignore unchanged
3. Run with `--force` — check files are overwritten
4. Run with `--template dotnet` — check dotnet-specific content is present
5. Run with `--template invalid` — check error message and exit code 1
6. Check for stale references:
   ```bash
   grep -R "CHATGPT.md\|\.chatgpt\|CLAUDE.md\|\.claude\|create-claude" .
   ```

## Deployment or Release

1. Bump version in `package.json`
2. Commit and tag
3. Publish:
   ```bash
   npm publish --access public --otp=<your-6-digit-code>
   ```
   Or use a granular npm access token with bypass-2FA enabled (set via `npm config set //registry.npmjs.org/:_authToken <token>`)

## Rollback or Recovery

- npm allows unpublishing within 72 hours of publish: `npm unpublish create-chat-gpt-repo-memory@<version>`
- After 72 hours, use `npm deprecate` to warn users: `npm deprecate create-chat-gpt-repo-memory@<version> "reason"`
