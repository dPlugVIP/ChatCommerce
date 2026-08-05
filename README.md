# ChatCommerce

ChatCommerce is a reusable chat-first commerce system for one business per deployment. The first implementation target is a DplugVIP-style storefront where customers browse products and continue inquiries through chat.

## Workspace

```text
frontend/   Next.js + shadcn UI
backend/    FastAPI + PostgreSQL + Redis + Cloudinary integration points
```

Planning and agent support folders such as `.plans/`, `.agents/`, `.claude/`, `.files/`, and `prototypes/` are local workspace artifacts and are intentionally ignored by Git.

## Commands

Use `pnpm` for frontend work:

```powershell
pnpm --dir frontend install
pnpm --dir frontend lint
pnpm --dir frontend typecheck
pnpm --dir frontend test
pnpm --dir frontend build
```

Use `uv` for backend work:

```powershell
uv --directory backend sync --all-groups
uv --directory backend run ruff check .
uv --directory backend run ruff format --check .
uv --directory backend run mypy app
uv --directory backend run pytest
```

No Docker setup is planned for this project profile. Use explicit Railway/cloud service configuration for PostgreSQL, Redis, and Cloudinary.
