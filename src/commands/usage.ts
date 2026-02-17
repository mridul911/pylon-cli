import { Command } from 'commander';

const USAGE_TEXT = `Available commands:

  Auth:
  pylon auth login --key <key>                    Add workspace credential
  pylon auth logout [workspace]                   Remove workspace credential
  pylon auth list                                 List configured workspaces
  pylon auth default [workspace]                  Get/set default workspace
  pylon auth whoami                               Show current user and auth info
  pylon auth token                                Print resolved API key
  pylon auth status                               Show authentication status

  Core:
  pylon me                                        Get current organization
  pylon usage                                     This command reference

  Accounts (companies/organizations in Pylon):
  pylon accounts list [--cursor] [--limit] [--all] List accounts
  pylon accounts get <id>                          Get account by ID

  Contacts (individual people associated with accounts):
  pylon contacts list [--cursor] [--limit] [--all] List contacts
  pylon contacts get <id>                          Get contact by ID

  Issues (support tickets/conversations):
  pylon issues list --start <t> --end <t> [--cursor] [--limit] [--all] List issues (max 30d)
  pylon issues get <id>                            Get issue by ID
  pylon issues followers <id>                      Get issue followers
  pylon issues messages <id>                       Get issue messages
  pylon issues threads <id>                        Get issue threads

  Knowledge Base (help center articles):
  pylon kb list [--cursor] [--limit] [--all]       List knowledge bases
  pylon kb get <id>                                Get knowledge base by ID
  pylon kb collections <id>                        List KB collections
  pylon kb articles <id>                           List KB articles
  pylon kb article <kb-id> <article-id>            Get specific KB article

  Tags (labels for categorizing accounts/issues):
  pylon tags list [--cursor] [--limit] [--all]     List tags
  pylon tags get <id>                              Get tag by ID

  Teams (groups of support agents):
  pylon teams list [--cursor] [--limit] [--all]    List teams
  pylon teams get <id>                             Get team by ID

  Users (support agents/team members):
  pylon users list [--cursor] [--limit] [--all]    List users
  pylon users get <id>                             Get user by ID
  pylon user-roles list                            List user roles

  Other:
  pylon custom-fields list --object-type <type>    List custom fields (account|issue|contact)
  pylon custom-fields get <id>                     Get custom field by ID
  pylon ticket-forms list                          List ticket forms
  pylon ticket-forms get <id>                      Get ticket form by ID
  pylon audit-logs list                            List audit logs
  pylon macro-groups list                          List macro groups (response templates)
  pylon training-data list                         List AI training data sources

  Setup:
  pylon install --skills                           Install agent skills for Claude Code

Global options:
  --api-key <key>      API key (or set PYLON_API_KEY, or use pylon auth login)
  --format <format>    json (default) | table
  --raw                Include full API envelope`;

export function register(program: Command): void {
  program
    .command('usage')
    .description('Show compact command reference (agent-friendly)')
    .action(() => {
      console.log(USAGE_TEXT);
    });
}
