# Authentication

## Overview

Pylon CLI supports three authentication methods. The API key is resolved in this order (first match wins):

| Priority | Method | Use case |
|----------|--------|----------|
| 1 | `--api-key <key>` flag | One-off commands, scripts |
| 2 | `PYLON_API_KEY` env var | CI/CD, shell sessions |
| 3 | Stored credentials | Daily use, multi-workspace |

## Stored credentials (recommended)

Credentials are stored in `~/.config/pylon/credentials.json` with file permissions restricted to the current user (0600).

### Commands

```bash
pylon auth login --key <key>           # add a workspace (validates key against API)
pylon auth login --key <key> --name me # add with custom workspace name
pylon auth logout [workspace]          # remove a workspace
pylon auth list                        # list configured workspaces (* = default)
pylon auth default [workspace]         # get or set default workspace
pylon auth whoami                      # show current org, auth source
pylon auth token                       # print resolved API key (for piping)
pylon auth status                      # show full auth status
```

### Workflow

```bash
# First workspace becomes the default
$ pylon auth login --key pylon_api_xxx
Logged in to workspace: Acme Corp (acme-corp)
  Set as default workspace

# All commands now use stored credentials
$ pylon me
{ "id": "...", "name": "Acme Corp" }

# Add additional workspace
$ pylon auth login --key pylon_api_yyy --name staging
Logged in to workspace: Staging (staging)

# Switch default
$ pylon auth default staging
```

## Environment variable

```bash
export PYLON_API_KEY=pylon_api_xxx
```

This takes precedence over stored credentials. Useful for CI/CD and automation.

## Getting an API key

1. Log in to your Pylon workspace at https://app.usepylon.com
2. Go to Settings > API
3. Create a new API token (requires Admin role)
4. Copy the key (starts with `pylon_api_`)
