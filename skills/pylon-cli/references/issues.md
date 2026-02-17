# Issues

## What are issues?

An **issue** is a **support ticket or conversation** in Pylon. Issues are the central unit of customer support work — they represent a customer request, bug report, question, or any interaction that needs resolution.

An issue includes:
- **title** — Short description of the request
- **number** — Sequential issue number (e.g. 11248)
- **state** — Current status (e.g. `cs_response_needed`, `waiting_on_customer`, `closed`)
- **body_html** — Full description/content in HTML
- **account** — The customer account this issue relates to
- **assignee** — The support agent assigned to handle it
- **requester** — The contact who submitted the issue
- **team** — The team responsible for this issue
- **tags** — Labels (e.g. "Bug", "Feature Request", "Question")
- **custom_fields** — User-defined metadata (e.g. priority, product area)
- **link** — URL to view the issue in the Pylon web app
- **created_at** / **updated_at** — Timestamps

### Sub-resources

- **Messages** — Individual messages within the issue (from contacts and agents across channels)
- **Threads** — Conversation threads (e.g. a Slack thread, email chain, chat thread)
- **Followers** — Users subscribed to issue updates

## Commands

```bash
# List issues (requires date range, max 30 days, RFC3339 format)
pylon issues list --start 2024-01-01T00:00:00Z --end 2024-01-31T00:00:00Z
pylon issues list --start 2024-01-01T00:00:00Z --end 2024-01-07T00:00:00Z --limit 10

# Get a specific issue
pylon issues get <issue-id>

# Get messages on an issue (the actual conversation content)
pylon issues messages <issue-id>

# Get threads on an issue
pylon issues threads <issue-id>

# Get followers of an issue
pylon issues followers <issue-id>

# Auto-paginate all issues in a date range
pylon issues list --start 2024-01-01T00:00:00Z --end 2024-01-07T00:00:00Z --all
```

## Important notes

- The `--start` and `--end` flags are **required** for `issues list`
- Dates must be in **RFC3339 format** (e.g. `2024-01-15T00:00:00Z`)
- Maximum date range is **30 days**
- Issues contain HTML in `body_html` — pipe through a tool like `jq` or use `--format table` for cleaner output

## Common workflows

```bash
# List all open issues from the last week
pylon issues list --start 2024-01-10T00:00:00Z --end 2024-01-17T00:00:00Z --all \
  | jq '[.[] | select(.state != "closed") | {number, title, state}]'

# Get the full conversation for an issue
pylon issues messages <issue-id> | jq '.[].body'

# Count issues by state
pylon issues list --start 2024-01-01T00:00:00Z --end 2024-01-31T00:00:00Z --all \
  | jq 'group_by(.state) | map({state: .[0].state, count: length})'
```
