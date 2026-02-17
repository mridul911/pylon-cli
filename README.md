# pylon-cli

Read-only CLI for the [Pylon](https://usepylon.com) customer support platform API.

Pylon is a **B2B customer support platform** that unifies communication channels — Slack, email, and in-app chat — into a single workspace. Support teams use Pylon to manage customer conversations, track issues, maintain knowledge bases, and monitor account health.

**pylon-cli** gives you read-only access to all of that data from the command line. It's built for both humans and AI agents — JSON output by default, predictable command patterns, and installable skills for Claude Code, GitHub Copilot, and other coding agents.

### Key features

- **Read-only** — only GET requests. No mutations, no accidents.
- **Agent-friendly** — JSON output, compact `usage` command, installable skills.
- **Multi-workspace auth** — store credentials for multiple Pylon workspaces, switch with `pylon auth default`.
- **Minimal dependencies** — Commander.js, cli-table3, and native `fetch`.

### Requirements

- Node.js >= 18.0.0

## Installation

```bash
npm install -g @mridul_dubey__/pylon-cli
```

## Authentication

pylon-cli supports three ways to authenticate, resolved in this order:

| Priority | Method | Best for |
|----------|--------|----------|
| 1 (highest) | `--api-key <key>` flag | One-off commands, CI scripts |
| 2 | `PYLON_API_KEY` env var | CI/CD pipelines, shell sessions |
| 3 | Stored credentials | Daily use, multiple workspaces |

### Stored credentials (recommended for daily use)

```bash
# Login — validates key against the API and stores it
pylon auth login --key <your-api-key>

# See who you're authenticated as
pylon auth whoami

# Check authentication status
pylon auth status
```

Credentials are stored in `~/.config/pylon/credentials.json` with `0600` file permissions (owner read/write only). The directory is created with `0700` permissions.

### Multiple workspaces

```bash
# Login to a second workspace
pylon auth login --key <other-api-key> --name staging

# List all configured workspaces (* = default)
pylon auth list

# Switch default workspace
pylon auth default staging

# Remove a workspace
pylon auth logout staging
```

### Environment variable

```bash
export PYLON_API_KEY=your_api_key_here
pylon accounts list
```

### Per-command flag

```bash
pylon --api-key your_api_key_here accounts list
```

### Getting an API key

Go to your Pylon workspace: **Settings > API** (requires Admin role). Create a new API key and copy it.

## Pylon concepts

Understanding these concepts helps you use the CLI effectively.

### Accounts

**Accounts** are companies or organizations that are your customers. Each account has a name, domain (e.g. `acme.com`), tags, custom fields, and associated contacts. Accounts represent the B2B customer relationship — one account per customer company.

```bash
pylon accounts list                           # list all accounts
pylon accounts get <id>                       # get account details
```

### Contacts

**Contacts** are the individual people at customer accounts. A contact has an email, name, and belongs to an account. They're the humans who open support requests and send messages.

```bash
pylon contacts list                           # list all contacts
pylon contacts get <id>                       # get contact details
```

### Issues

**Issues** are support tickets or conversations — the core unit of work in Pylon. An issue has a title, state (e.g. `open`, `cs_response_needed`, `waiting_on_customer`, `closed`), priority, assignee, tags, and custom fields. Issues contain messages from multiple channels and threads of conversation.

```bash
pylon issues list --start <t> --end <t>       # list issues (RFC3339, max 30d)
pylon issues get <id>                         # get issue details
pylon issues messages <id>                    # get messages in an issue
pylon issues threads <id>                     # get threads in an issue
pylon issues followers <id>                   # get issue followers
```

The `--start` and `--end` parameters are required for `issues list` and must be RFC3339 timestamps (e.g. `2025-01-01T00:00:00Z`). Maximum range is 30 days.

### Knowledge Base

A **knowledge base (KB)** is Pylon's help center — a collection of articles organized into collections (folders). Organizations use KBs for product documentation, FAQs, troubleshooting guides, and onboarding materials.

- **Knowledge Base** — the top-level container (e.g. "Acme Help Center")
- **Collections** — categories within a KB (e.g. "Getting Started", "Billing")
- **Articles** — individual help articles with a title, body, and metadata

```bash
pylon kb list                                 # list knowledge bases
pylon kb get <id>                             # get KB details
pylon kb collections <id>                     # list collections in a KB
pylon kb articles <id>                        # list articles in a KB
pylon kb article <kb-id> <article-id>         # get a specific article
```

### Tags

**Tags** are labels used to categorize accounts and issues. A tag has a value (e.g. "Bug", "Enterprise"), an object type (`account` or `issue`), and a color. Common patterns: issue tags like "Bug", "Feature Request", "Urgent"; account tags for tiers or ownership.

```bash
pylon tags list                               # list all tags
pylon tags get <id>                           # get tag details
```

### Teams and users

**Teams** are groups of support agents (e.g. "Engineering Support", "Customer Success"). **Users** are the individual agents and team members. **User roles** define permission levels: Admin (full access), Member (standard), Viewer (read-only).

```bash
pylon teams list                              # list teams
pylon teams get <id>                          # get team details
pylon users list                              # list users
pylon users get <id>                          # get user details
pylon user-roles list                         # list role definitions
```

### Custom fields

**Custom fields** are user-defined fields attached to accounts, issues, or contacts. They extend Pylon's data model with organization-specific data (e.g. "Tier", "CSM Name", "Product").

```bash
pylon custom-fields list --object-type <type> # list fields (account|issue|contact)
pylon custom-fields get <id>                  # get field definition
```

### Other resources

```bash
pylon ticket-forms list                       # ticket submission forms
pylon ticket-forms get <id>
pylon audit-logs list                         # workspace audit trail
pylon macro-groups list                       # saved response template groups
pylon training-data list                      # AI training data sources
```

## All commands

Every resource follows a predictable pattern: `pylon <resource> list` and `pylon <resource> get <id>`.

### Quick reference

```
Auth:
  pylon auth login --key <key>                  Store workspace credential
  pylon auth logout [workspace]                 Remove credential
  pylon auth list                               List workspaces
  pylon auth default [workspace]                Get/set default workspace
  pylon auth whoami                             Show current user info
  pylon auth token                              Print resolved API key
  pylon auth status                             Show auth status

Core:
  pylon me                                      Current organization
  pylon usage                                   Compact command reference

Accounts:
  pylon accounts list [--cursor] [--limit] [--all]
  pylon accounts get <id>

Contacts:
  pylon contacts list [--cursor] [--limit] [--all]
  pylon contacts get <id>

Issues:
  pylon issues list --start <t> --end <t> [--cursor] [--limit] [--all]
  pylon issues get <id>
  pylon issues followers <id>
  pylon issues messages <id>
  pylon issues threads <id>

Knowledge Base:
  pylon kb list [--cursor] [--limit] [--all]
  pylon kb get <id>
  pylon kb collections <id>
  pylon kb articles <id>
  pylon kb article <kb-id> <article-id>

Tags:
  pylon tags list [--cursor] [--limit] [--all]
  pylon tags get <id>

Teams:
  pylon teams list [--cursor] [--limit] [--all]
  pylon teams get <id>

Users:
  pylon users list [--cursor] [--limit] [--all]
  pylon users get <id>
  pylon user-roles list

Custom Fields:
  pylon custom-fields list --object-type <type>
  pylon custom-fields get <id>

Other:
  pylon ticket-forms list
  pylon ticket-forms get <id>
  pylon audit-logs list
  pylon macro-groups list
  pylon training-data list

Setup:
  pylon install --skills
```

## Output formats

All commands output JSON by default.

```bash
# JSON (default) — ideal for agents and piping to jq
pylon accounts list
# [{ "id": "abc", "name": "Acme Corp", ... }]

# Table — human-readable
pylon accounts list --format table
# ┌─────────┬───────────┬────────┐
# │ id      │ name      │ domain │
# ├─────────┼───────────┼────────┤
# │ abc     │ Acme Corp │ acme.… │
# └─────────┴───────────┴────────┘

# Raw — full API envelope with request_id and pagination
pylon accounts list --raw
```

## Pagination

Pylon uses cursor-based pagination. By default, commands return one page.

```bash
pylon accounts list --limit 10                # limit results per page
pylon accounts list --cursor eyJhbGci...      # continue from cursor
pylon accounts list --all                     # auto-paginate all results
```

Use `--raw` to see the pagination cursor in the response.

## Agent integration

### Installing skills

Claude Code, GitHub Copilot, and other AI agents can use locally installed skills to learn the full CLI surface.

```bash
pylon install --skills
```

This writes skill definitions and reference documentation to `.claude/skills/pylon-cli/` in your project. Agents discover these automatically.

### Skills-less operation

Any agent can also call `pylon usage` to get a compact, machine-readable summary of all commands in under 1500 tokens.

### Example agent workflow

```
> Use pylon-cli to find all open issues from the last week

Agent runs:
  pylon issues list --start 2025-02-10T00:00:00Z --end 2025-02-17T00:00:00Z \
    | jq '[.[] | select(.state != "closed") | {id, title, state}]'
```

## Security

- **Read-only enforcement** — the HTTP client only exposes a `get()` method. Write requests are impossible.
- **Secure credential storage** — credentials stored with `0600` permissions in `~/.config/pylon/credentials.json`. Directory created with `0700`.
- **Input sanitization** — all path parameters use `encodeURIComponent()`. Dates validated as RFC3339. Limits validated as positive integers.
- **Safe npm publish** — only `dist/`, `bin/`, and `skills/` are included. Source code, tests, `.env`, and config files are excluded.
- **No secrets in output** — the API key is never logged or printed in error messages.

## Development

```bash
npm install              # install dependencies
npm run build            # build with tsup
npm test                 # run tests
npm run typecheck        # verify TypeScript types
npm run dev              # watch mode
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## License

MIT
