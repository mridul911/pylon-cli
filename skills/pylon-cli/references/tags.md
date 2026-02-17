# Tags

## What are tags?

**Tags** are labels used to **categorize accounts and issues** in Pylon. They help support teams organize, filter, and report on their work.

A tag includes:
- **value** — The tag name (e.g. "Bug", "Feature Request", "Enterprise")
- **object_type** — What the tag applies to: `account` or `issue`
- **hex_color** — Display color (e.g. "magenta", "#94A3B8")

### Common tag patterns
- **Issue tags**: "Bug", "Feature Request", "Question", "Urgent"
- **Account tags**: Team member names (for account ownership), tier labels, product labels

## Commands

```bash
# List all tags
pylon tags list

# Get a specific tag
pylon tags get <tag-id>
```

## Common workflows

```bash
# List all issue tags
pylon tags list | jq '[.[] | select(.object_type == "issue")]'

# List all account tags
pylon tags list | jq '[.[] | select(.object_type == "account")]'
```
