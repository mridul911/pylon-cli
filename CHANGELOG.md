# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-17

### Added

- Initial release of pylon-cli
- Read-only CLI for the Pylon customer support platform API
- Authentication system with credential storage (`pylon auth login/logout/whoami/token/status`)
- API key resolution chain: `--api-key` flag > `PYLON_API_KEY` env var > stored credentials
- Multi-workspace support with `pylon auth default` to switch between workspaces
- Commands for all Pylon resources:
  - `pylon me` — current organization
  - `pylon accounts list|get` — customer accounts
  - `pylon contacts list|get` — individual contacts
  - `pylon issues list|get|followers|messages|threads` — support issues
  - `pylon kb list|get|collections|articles|article` — knowledge base
  - `pylon tags list|get` — tags and labels
  - `pylon teams list|get` — support teams
  - `pylon users list|get` — team members
  - `pylon user-roles list` — user permission roles
  - `pylon custom-fields list|get` — custom field definitions
  - `pylon ticket-forms list|get` — ticket form definitions
  - `pylon audit-logs list` — workspace audit logs
  - `pylon macro-groups list` — macro groups
  - `pylon training-data list` — AI training data sources
- JSON output by default, `--format table` for human-readable output
- `--raw` flag for full API envelope with pagination metadata
- Cursor-based pagination with `--cursor`, `--limit`, and `--all` options
- `pylon usage` — compact command reference for AI agents
- `pylon install --skills` — install agent skills for Claude Code and other AI agents
- Agent skill definitions with detailed Pylon domain concept documentation
- GET-only HTTP client with exponential backoff retry on 429
- Input sanitization (encodeURIComponent for IDs, RFC3339 validation for dates)
