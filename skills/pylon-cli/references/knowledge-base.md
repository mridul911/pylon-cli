# Knowledge Base

## What is the Knowledge Base?

A **knowledge base (KB)** is Pylon's **help center** — a structured collection of articles that customers and agents can reference. Organizations use knowledge bases for product documentation, FAQs, troubleshooting guides, and onboarding materials.

### Structure

- **Knowledge Base** — The top-level container (e.g. "Acme Help Center"). An organization may have multiple KBs.
- **Collections** — Folders or categories within a KB (e.g. "Getting Started", "Billing", "API Reference"). Collections can be nested (parent/child).
- **Articles** — Individual help articles within a collection, containing title, body content, and metadata.

### Collection properties
- **title** / **slug** — Name and URL-friendly identifier
- **description** — What the collection covers
- **icon** — Display icon (e.g. "folder", "rocketLaunch", "cog6Tooth")
- **parent_collection_id** — Parent collection for nested hierarchies
- **visibility_config** — Access control (public, internal_only) and AI agent access settings

### Article properties
- **title** / **slug** — Name and URL-friendly identifier
- **body** — Article content (typically HTML or markdown)
- **created_at** / **updated_at** — Timestamps

## Commands

```bash
# List all knowledge bases
pylon kb list

# Get a knowledge base by ID
pylon kb get <kb-id>

# List all collections in a knowledge base
pylon kb collections <kb-id>

# List all articles in a knowledge base
pylon kb articles <kb-id>

# Get a specific article
pylon kb article <kb-id> <article-id>
```

## Common workflows

```bash
# Browse the KB structure: list KBs, then collections, then articles
pylon kb list
pylon kb collections <kb-id> | jq '[.[] | {id, title, parent: .parent_collection_id}]'
pylon kb articles <kb-id> | jq '[.[] | {id, title, slug}]'

# Get a specific article's content
pylon kb article <kb-id> <article-id> | jq '.body'
```
