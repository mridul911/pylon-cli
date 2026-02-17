# Contributing to pylon-cli

Thanks for your interest in contributing! This guide covers everything you need to get started.

## Development setup

```bash
git clone https://github.com/11x-engineering/pylon-cli.git
cd pylon-cli
npm install
npm run build
```

Verify the build works:

```bash
node bin/pylon.js --help
node bin/pylon.js usage
```

## Project structure

```
src/
  cli.ts                  # Entry point — registers all commands
  commands/               # One file per resource (accounts.ts, issues.ts, etc.)
  lib/
    api-client.ts         # GET-only HTTP client with retry
    auth.ts               # API key resolution chain
    credentials.ts        # Credential storage (~/.config/pylon/)
    errors.ts             # Error classes and handler
    formatter.ts          # JSON/table output formatting
    pagination.ts         # Cursor-based pagination helper
  types/
    api.ts                # API response types
    cli.ts                # CLI option types
skills/pylon-cli/         # Agent skill definitions
tests/                    # Vitest test suite
```

## Key principles

### Read-only only

This CLI is strictly read-only. It only makes GET requests to the Pylon API. Never add POST, PATCH, PUT, or DELETE methods. The `ApiClient` class intentionally only exposes a `get()` method.

### Command pattern

Every resource command follows the same structure:

```typescript
import { Command } from 'commander';
import { createClient } from '../lib/api-client.js';
import { list } from '../lib/pagination.js';
import { output } from '../lib/formatter.js';
import { handleError } from '../lib/errors.js';

export function register(program: Command): void {
  const cmd = program.command('resource').description('Manage resources');

  cmd.command('list')
    .description('List resources')
    .option('--cursor <cursor>', 'Pagination cursor')
    .option('--limit <n>', 'Results per page')
    .option('--all', 'Fetch all pages')
    .action(async (opts) => {
      try {
        const client = createClient(program.opts());
        const data = await list(client, '/resources', opts);
        output(data, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd.command('get <id>')
    .description('Get resource by ID')
    .action(async (id) => {
      try {
        const client = createClient(program.opts());
        const { data } = await client.get(`/resources/${encodeURIComponent(id)}`);
        output(data, program.opts());
      } catch (error) {
        handleError(error);
      }
    });
}
```

### ESM imports

Use `.js` extensions in all import paths. This is required for ESM module resolution:

```typescript
// Correct
import { handleError } from '../lib/errors.js';

// Wrong — will fail at runtime
import { handleError } from '../lib/errors';
```

### Error handling

- Use error classes from `src/lib/errors.ts`: `AuthError`, `ApiError`, `ValidationError`, `PylonError`
- Wrap all command actions in try/catch with `handleError(error)`
- Never expose API keys in error messages

### Input sanitization

- All ID parameters must use `encodeURIComponent()`
- Date parameters must be validated as RFC3339

## Running tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Type check
npm run typecheck
```

## Adding a new resource command

1. Create `src/commands/<resource>.ts` following the command pattern above
2. Register it in `src/cli.ts`:
   ```typescript
   import { register as registerResource } from './commands/resource.js';
   registerResource(program);
   ```
3. Add the command to `src/commands/usage.ts`
4. Update `skills/pylon-cli/SKILL.md` with the new command
5. Add a reference file in `skills/pylon-cli/references/` if appropriate
6. Update the `SKILL_PATHS` array in `src/commands/install.ts` for new reference files
7. Add tests in `tests/commands/<resource>.test.ts`

## Updating skills

Skills are agent-facing documentation in `skills/pylon-cli/`. When changing commands:

1. Update `SKILL.md` with the new/changed commands
2. Update relevant reference files in `skills/pylon-cli/references/`
3. Update `SKILL_PATHS` in `src/commands/install.ts` if adding new files
4. Test with `pylon install --skills` to verify files are copied correctly

## Building

```bash
npm run build          # Build with tsup
npm run typecheck      # Verify TypeScript types
npm test               # Run tests
```

The build produces `dist/cli.js` (ESM bundle). The `bin/pylon.js` shim imports this.

## npm publish checklist

Before publishing:

1. `npm run build` succeeds
2. `npm test` passes
3. `npm run typecheck` passes
4. `npm pack --dry-run` shows only `dist/`, `bin/`, `skills/`, and metadata files
5. No `.env`, credentials, or source code in the package

## Code style

- Strict TypeScript — avoid `any`, use proper types
- Native `fetch` for HTTP — no axios or other HTTP libraries
- Minimal dependencies — only add a dependency if absolutely necessary
- Keep commands simple — delegate to lib modules for shared logic
