# Vyala Archon — PQC Intelligence Dashboard

An ultra-premium, dark-mode enterprise security dashboard for mapping Post-Quantum Cryptography vulnerabilities across enterprise supply chains.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **Lucide React** (icons)
- **Framer Motion** (animations)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure backend URL (optional — defaults to localhost:8000)
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Contract

The dashboard connects to `POST /api/scan/domain` on your Python backend.

**Request:**
```json
{ "target": "core/tests", "scan_type": "local" }
```

**Response:** `CBOMReport` — see `lib/api.ts` for the full TypeScript interface.

## File Structure

```
vyala_brightdata-web/
├── app/
│   ├── layout.tsx          # Root layout, fonts, dark bg
│   ├── page.tsx            # Main dashboard (Bento Grid)
│   └── globals.css         # Tailwind + custom animations
│
├── components/
│   ├── layout/Header.tsx   # Vyala branding + status bar
│   ├── dashboard/
│   │   ├── InvokeTerminal.tsx  # Raycast-style command input
│   │   ├── StatCard.tsx        # Premium metric cards
│   │   └── FindingsGrid.tsx    # Grid of ThreatCards
│   ├── scan/ThreatCard.tsx     # Luxury vulnerability card
│   └── ui/
│       ├── LoadingSpinner.tsx  # Premium loading states
│       └── Badge.tsx           # Severity/vuln class badges
│
├── lib/
│   ├── api.ts              # TypeScript interfaces + fetch
│   └── utils.ts            # Tailwind helpers + formatters
│
└── public/
    └── vyala_logo.svg      # Brand asset
```
