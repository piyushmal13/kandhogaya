Production checklist
====================

Follow these steps to prepare and deploy the application to production.

1) Environment
 - Set required env vars (see `.env.example`). Important ones:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep secret, server-only)
   - `DATABASE_URL` (Postgres connection string for migration runner)
   - `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `CORS_ALLOW` (comma-separated allowed origins)

2) Apply migrations
 - Run locally or from CI with access to `DATABASE_URL`:

```bash
DATABASE_URL="postgres://user:pass@host:5432/db" npm run apply-migrations
```

3) Build
 - Build client and server artifacts:

```bash
npm ci
npm run build:all
```

4) Run / Docker
 - Run directly:

```bash
NODE_ENV=production DATABASE_URL=... STRIPE_SECRET_KEY=... node dist/server.js
```

 - Or build the Docker image:

```bash
docker build -t ifx-hub:latest .
docker run -p 3000:3000 --env-file .env.prod ifx-hub:latest
```

5) Webhooks
 - Configure the Stripe webhook URL to point to `/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET`.

6) Observability
 - Configure `LOG_LEVEL` and an external log sink if needed.

7) Security
 - Verify RLS policies for all Supabase tables.
 - Ensure `SUPABASE_SERVICE_ROLE_KEY` is never exposed to clients.

8) Optional
 - Configure backups, monitoring, automated migrations in CI/CD, and deploy to your platform (VPS, Kubernetes, Fly, Render, Vercel functions + static host).
