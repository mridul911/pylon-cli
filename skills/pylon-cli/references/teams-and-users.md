# Teams and Users

## What are teams?

**Teams** are groups of support agents in Pylon (e.g. "Engineering Support", "Customer Success", "Billing"). Issues can be assigned to teams, and teams help organize who handles what.

## What are users?

**Users** are the support agents and team members who use Pylon. A user includes:
- **name** — Display name
- **email** / **emails** — Email addresses
- **status** — Account status (e.g. "active")
- **role_id** — Reference to the user's role
- **avatar_url** — Profile picture

Users with empty `email` and `status` are typically bots or integrations (e.g. "CSapp", "Fivetran").

## What are user roles?

**User roles** define permission levels:
- **Admin** — Full access, can manage settings and API keys
- **Member** — Standard agent access
- **Viewer** — Read-only access

## Commands

### Teams

```bash
pylon teams list                                  # list all teams
pylon teams get <team-id>                         # get team by ID
```

### Users

```bash
pylon users list                                  # list all users
pylon users get <user-id>                         # get user by ID
pylon user-roles list                             # list all roles
```

## Common workflows

```bash
# List active human users (exclude bots)
pylon users list | jq '[.[] | select(.status == "active" and .email != "")]'

# Map user IDs to names (useful for resolving assignees on issues)
pylon users list | jq '[.[] | {id, name, email}]'

# Check what role a user has
USER_ROLE=$(pylon users get <user-id> | jq -r '.role_id')
pylon user-roles list | jq ".[] | select(.id == \"$USER_ROLE\")"
```
