# ChatCommerce Frontend

Next.js frontend for ChatCommerce.

## Commands

Run frontend commands from the repository root through the pnpm workspace:

```powershell
pnpm --filter frontend install
pnpm --filter frontend dev
pnpm --filter frontend lint
pnpm --filter frontend typecheck
pnpm --filter frontend test
pnpm --filter frontend build
```

You can also use `pnpm --dir frontend <script>` when working inside this package, but the root `pnpm-lock.yaml` is the monorepo lockfile.

## Notes

- Prefer existing shadcn UI components before adding custom primitives.
- API access should go through the BFF/client helpers under `src/lib/api`.
- The current screens are mock-backed until the FastAPI API contracts are implemented.
