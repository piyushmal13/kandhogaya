import React, { useState } from 'react';

export default function PaymentsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1.0 })
      });
      const body = await resp.json();
      if (!resp.ok) {
        setMessage(body.error || 'Failed to start checkout');
        setLoading(false);
        return;
      }
      if (body.url) {
        window.location.href = body.url;
      } else {
        setMessage('No checkout URL returned');
      }
    } catch (err: any) {
      setMessage(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Payments</h2>
      <p>Click the button to open Stripe Checkout (test)</p>
      <button onClick={handleCheckout} disabled={loading}>{loading ? 'Redirecting...' : 'Pay with Stripe'}</button>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}
