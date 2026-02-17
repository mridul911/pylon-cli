# Contacts

## What are contacts?

A **contact** is an **individual person** at a customer account. Contacts are the humans who submit support requests, send messages, and interact with your team.

A contact includes:
- **name** — Person's name
- **email** / **emails** — Email address(es)
- **account** — The account (company) this contact belongs to
- **portal_role** — Their role in the customer portal (e.g. "admin")
- **custom_fields** — User-defined metadata
- **phone_numbers** — Phone numbers
- **integration_user_ids** — Links to external systems (e.g. Salesforce Contact ID)

## Commands

```bash
# List all contacts
pylon contacts list --all

# List with pagination
pylon contacts list --limit 20
pylon contacts list --limit 20 --cursor <cursor>

# Get a specific contact
pylon contacts get <contact-id>
```

## Common workflows

```bash
# Find contacts by email domain
pylon contacts list --all | jq '[.[] | select(.email | test("@acme.com$"))]'

# Get contact with their account ID
pylon contacts get <id> | jq '{name, email, account_id: .account.id}'
```
