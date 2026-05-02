Payments integration
====================

This project includes a server-side integration for Stripe payments and a simple client demo page.

Setup
-----

1. Add keys to your environment (see `.env.example`).
   - `STRIPE_SECRET_KEY` (server)
   - `VITE_STRIPE_PUBLISHABLE_KEY` (client)
   - `STRIPE_WEBHOOK_SECRET` (webhook signature verification)

2. Apply the database migration `supabase/migrations/20261102_payments.sql` to create the `payments` table.

3. Install dependencies and build:

```bash
npm ci
npm run build
```

How it works
------------

- Client calls `POST /api/payments/create-intent` with `product_id` or `amount`.
- Server creates a Stripe PaymentIntent and stores a payment record in `payments` table.
- Stripe sends webhook events to `/api/webhooks/stripe` which updates payment status.

Notes
-----

- The webhook endpoint verifies signatures; ensure `STRIPE_WEBHOOK_SECRET` is set.
- For production, run webhooks through a secure endpoint (HTTPS) and use a dedicated processing queue if necessary.
- Review RLS policies for the `payments` table during the security audit.
