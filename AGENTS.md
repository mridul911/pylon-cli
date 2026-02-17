## basics

- this is a TypeScript Node.js project using `tsup` for bundling and `vitest` for testing
- the CLI is read-only — it only makes GET requests to the Pylon API. never add POST/PATCH/DELETE methods
- use native `fetch` (Node 18+) for HTTP — no axios or other HTTP libraries
- prefer strict TypeScript — avoid `any`, use proper types
- use `.js` extensions in all import paths (required for ESM)

## commands

- every command file follows the same pattern: import commander, api-client, formatter, errors → register function
- all resource commands follow `pylon <resource> list` / `pylon <resource> get <id>` pattern
- all ID parameters must be sanitized with `encodeURIComponent()`
- all command actions must be wrapped in try/catch with `handleError(error)`

## error handling

- use error classes from `src/lib/errors.ts`: `AuthError`, `ApiError`, `ValidationError`, `PylonError`
- wrap command actions in try-catch with `handleError(error)`
- errors display clean messages to stderr and exit with code 1
- never expose API keys in error messages or logs

## auth

- API key resolution: `--api-key` flag > `PYLON_API_KEY` env var > stored credentials
- credentials stored in `~/.config/pylon/credentials.json` with 0600 permissions
- the `resolveApiKey()` function in `src/lib/auth.ts` handles the full resolution chain

## testing

- tests live in `tests/` mirroring the `src/` structure
- use `vitest` — run with `npm test`
- mock `fetch` for API client tests, use `execFileSync` for CLI smoke tests
- run `npm run typecheck` to verify TypeScript types

## building

- `npm run build` uses `tsup` to bundle `src/cli.ts` → `dist/cli.js` (ESM)
- `bin/pylon.js` is the shim that imports `dist/cli.js`
- only `dist/`, `bin/`, and `skills/` are published to npm

## skills

- skill files live in `skills/pylon-cli/` with YAML frontmatter format
- `pylon install --skills` copies these to `.claude/skills/pylon-cli/` in the user's project
- when adding/changing commands, update `src/commands/usage.ts` and `skills/pylon-cli/SKILL.md`
