# ChatCommerce Backend

FastAPI service for ChatCommerce. Use `uv` for every Python command.

## Setup

```powershell
$env:UV_CACHE_DIR="..\.uv-cache"
uv sync --all-groups
Copy-Item .env.example .env
```

Update `.env` with local or Railway-provided values. Do not use Docker for this project profile; use explicit cloud/dev services and isolated test resources.

## Commands

```powershell
uv run ruff check .
uv run ruff format --check .
uv run mypy app
uv run pytest
uv run python -c "from app.main import app; print(app.title)"
uv run uvicorn app.main:app --reload
```

## Current Scope

Implemented foundation only:

- FastAPI app factory and `/health/live`
- Pydantic settings with production required-secret checks
- Test-resource safety guards
- SQLAlchemy async session placeholders
- Unit tests for app health and configuration

Not implemented yet: auth flows, database models, migrations, catalog endpoints, Cloudinary uploads, Redis pub/sub, and realtime chat.
