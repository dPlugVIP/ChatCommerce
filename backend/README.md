# ChatCommerce Backend

FastAPI service for ChatCommerce. Use `uv` for every Python command.

## Setup

```powershell
$env:UV_CACHE_DIR="..\.uv-cache"
uv sync --all-groups
Copy-Item .env.example .env
```

Update `.env` with local or Railway public-network values. Railway's
`*.railway.internal` URLs only resolve from services inside the same Railway
project; use the public Postgres and Redis TCP URLs when running directly on
your machine.

## Docker quick start

Run PostgreSQL, Redis, migrations, seed data, and the API together:

```bash
docker compose up --build
```

The API will be available at `http://localhost:8000`. Compose overrides
`DATABASE_URL` and `REDIS_URL` with container-network addresses, so the
Railway URLs in a local `.env` are not used by the containers.

To run only the local infrastructure and run Python directly on the host:

```bash
docker compose up -d db redis
uv run alembic upgrade head
uv run python -m app.cli seed-admin
uv run uvicorn app.main:app --reload
```

## Commands

```powershell
uv run ruff check .
uv run ruff format --check .
uv run mypy app
uv run pytest
uv run alembic upgrade head
uv run python -m app.cli seed-admin
uv run python -c "from app.main import app; print(app.title)"
uv run uvicorn app.main:app --reload
```

The frontend expects `NEXT_API_URL=http://localhost:8000` in
`frontend/.env.local`.

## Railway

Set the service root directory to `backend` and the Railway config path to
`/backend/railway.json`. Railway builds `backend/Dockerfile`, runs
`alembic upgrade head` and the idempotent bootstrap seed in
`preDeployCommand`, then starts the image on Railway's assigned `$PORT`.

## Current Scope

- FastAPI app factory, CORS, and `/health/live`
- persisted users and opaque bearer sessions
- protected customer catalog and product detail endpoints
- admin product CRUD endpoints
- customer/admin conversation and message endpoints
- Alembic migrations and idempotent deployment seed

Cloudinary uploads, Redis pub/sub, and realtime WebSocket fanout remain later
passes; first-pass chat uses persisted HTTP requests.
