# Accounts

## What are accounts?

In Pylon, an **account** represents a **company or organization** that is a customer. Accounts are the core entity in B2B support — every support interaction ultimately relates to an account.

An account includes:
- **name** — Company name (e.g. "Acme Corp")
- **domain** / **domains** — Company domain(s) (e.g. "acme.com")
- **type** — Account type (e.g. "customer")
- **tags** — Labels for categorization (e.g. "Enterprise", "Churn risk")
- **custom_fields** — User-defined metadata (e.g. Salesforce tier, CSM, renewal date)
- **channels** — Communication channels (Slack channels, email)
- **latest_customer_activity_time** — Timestamp of last customer activity
- **crm_settings** — Links to external CRM systems (e.g. Salesforce ID)
- **is_disabled** — Whether the account is disabled

## Commands

```bash
# List all accounts
pylon accounts list --all

# List with pagination
pylon accounts list --limit 10
pylon accounts list --limit 10 --cursor <cursor>

# Get a specific account by ID
pylon accounts get <account-id>

# Table output
pylon accounts list --format table

# Full API envelope with pagination metadata
pylon accounts list --raw
```

## Common workflows

```bash
# Find an account and inspect its details
pylon accounts list --limit 50 --all | jq '.[] | select(.domain == "acme.com")'

# Get all accounts with their tags
pylon accounts list --all | jq '[.[] | {name, domain, tags}]'
```
