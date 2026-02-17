---
name: pylon-cli
description: Read-only CLI for the Pylon customer support platform API. Use when the user needs to query Pylon data — accounts, issues, contacts, tags, teams, knowledge base articles, or other customer support resources. Pylon is a B2B customer support platform that unifies Slack, email, and in-app conversations. All operations are read-only.
allowed-tools: Bash(pylon:*)
---

# Pylon CLI

Read-only CLI for the [Pylon](https://usepylon.com) customer support platform API.

## What is Pylon?

Pylon is a **B2B customer support platform** that unifies communication channels (Slack, email, in-app chat) into a single workspace. Support teams use Pylon to manage customer conversations, track issues, maintain knowledge bases, and monitor account health.

### Key concepts

- **Accounts** — Companies or organizations that are customers. Each account has a domain, tags, custom fields, and associated contacts. Accounts represent the B2B relationship.
- **Contacts** — Individual people at customer accounts. A contact has an email, name, and belongs to an account. They are the humans who submit support requests.
- **Issues** — Support tickets or conversations. An issue has a title, state (e.g. `cs_response_needed`, `waiting_on_customer`), assignee, tags, and custom fields. Issues contain messages and threads from multiple channels.
- **Messages** — Individual messages within an issue, sent by contacts or support agents.
- **Threads** — Conversation threads within an issue (e.g. a Slack thread, an email chain).
- **Followers** — Users who are following/subscribed to updates on an issue.
- **Knowledge Base (KB)** — A help center containing collections and articles. Used for self-service documentation.
- **Collections** — Folders/categories within a knowledge base that group articles by topic.
- **Articles** — Individual help articles within a knowledge base collection.
- **Tags** — Labels for categorizing accounts and issues (e.g. "Bug", "Feature Request", "Enterprise"). Tags have an object_type (account or issue) and a color.
- **Teams** — Groups of support agents (e.g. "Engineering Support", "Customer Success").
- **Users** — Support agents and team members who use Pylon to handle issues.
- **User Roles** — Permission levels for users (e.g. Admin, Member, Viewer).
- **Custom Fields** — User-defined fields on accounts, issues, or contacts (e.g. "Tier", "CSM", "Product"). Custom fields have types like text, number, select.
- **Ticket Forms** — Structured forms that customers fill out when submitting issues.
- **Macro Groups** — Groups of saved response templates (macros) that agents use for common replies.
- **Training Data** — Data sources used to train Pylon's AI agent (e.g. knowledge base content, website scrapes).
- **Audit Logs** — Records of actions taken in the workspace (requires admin permissions).

## Prerequisites

The `pylon` command must be available on PATH:

```bash
pylon --version
```

If not installed: `npm install -g @mridul_dubey__/pylon-cli`

## Authentication

```bash
# Option 1: Login and store credentials (recommended)
pylon auth login --key <api-key>

# Option 2: Environment variable
export PYLON_API_KEY=<api-key>

# Option 3: Per-command flag
pylon --api-key <key> accounts list
```

See [auth.md](references/auth.md) for full auth documentation.

## Available Commands

```
pylon auth                 # Manage authentication (login, logout, whoami, token)
pylon me                   # Get current organization
pylon accounts             # Manage accounts (list, get)
pylon contacts             # Manage contacts (list, get)
pylon issues               # Manage issues (list, get, followers, messages, threads)
pylon kb                   # Manage knowledge bases (list, get, collections, articles)
pylon tags                 # Manage tags (list, get)
pylon teams                # Manage teams (list, get)
pylon users                # Manage users (list, get)
pylon user-roles           # List user roles
pylon custom-fields        # Manage custom fields (list, get)
pylon ticket-forms         # Manage ticket forms (list, get)
pylon audit-logs           # List audit logs
pylon macro-groups         # List macro groups
pylon training-data        # List training data sources
pylon usage                # Full command reference (agent-friendly)
pylon install --skills     # Install agent skills
```

## Reference Documentation

- [auth](references/auth.md) — Authentication setup and credential management
- [accounts](references/accounts.md) — Querying customer accounts
- [contacts](references/contacts.md) — Querying individual contacts
- [issues](references/issues.md) — Working with support issues, messages, and threads
- [knowledge-base](references/knowledge-base.md) — Knowledge base, collections, and articles
- [tags](references/tags.md) — Tags and categorization
- [teams-and-users](references/teams-and-users.md) — Teams, users, and roles

## Output options

```bash
pylon accounts list                               # JSON output (default)
pylon accounts list --format table                # human-readable table
pylon accounts list --raw                         # full API envelope (request_id, pagination)
```

## Pagination

Pylon uses cursor-based pagination. Most list commands support:

```bash
pylon accounts list --limit 10                    # limit results per page
pylon accounts list --cursor <cursor>             # continue from cursor
pylon accounts list --all                         # auto-paginate all results
```

Use `--raw` to see the pagination cursor in the response.

## Discovering Options

Run `--help` on any command to see available subcommands and flags:

```bash
pylon --help
pylon issues --help
pylon issues list --help
```
