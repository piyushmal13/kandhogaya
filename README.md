# IFXTrades Trading Intelligence Hub

The official ecosystem for IFXTrades retail traders. A scalable, production-grade fintech SaaS platform for trading signals, algorithmic bots, webinars, and financial education.

## 🚀 Overview

**IFXTrades** is designed with a "Stable Core + Dynamic Content Layer" architecture. This allows the IFXTrades admin team to update signals, products, and content daily through a CRM-style admin panel without requiring new code deployments.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4.0, Motion, Lucide Icons.
- **Backend**: Node.js (Express) with Supabase integration.
- **Database**: Supabase PostgreSQL.
- **Auth**: Supabase Auth (JWT).
- **Storage**: Supabase Storage for bot files, images, and videos.
- **Payments**: Integrated with Stripe and Razorpay.

## 📂 Project Structure

```text
├── src/
│   ├── components/         # Reusable IFXTrades UI components
│   ├── pages/              # Dashboard, Admin, Signals, Marketplace
│   ├── lib/                # Supabase & API utilities
│   └── App.tsx             # Main Application Logic & Branding
├── .env.example            # Environment variables template
├── server.ts               # Unified IFXTrades Backend Server
└── database/
    └── migrations.sql      # Supabase/PostgreSQL Schema
```

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your Supabase keys:
```bash
cp .env.example .env
```

### 4. Run the Project
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🔑 Admin Access
- **Admin Email**: `admin@ifxtrades.com`
- **Role**: Set `{"role": "admin"}` in Supabase user metadata.

## 📡 License Validation API
MT5 bots can validate IFXTrades licenses via:
`POST /api/license/validate`
```json
{
  "license_key": "IFX-GOLD-XXXX",
  "account_id": "12345678",
  "hardware_id": "HWID-XYZ"
}
```

## 📄 License
This project is proprietary to IFXTrades.
