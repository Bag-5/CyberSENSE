# CyberSENSE

CyberSENSE is an interactive cybersecurity awareness platform built to help everyday users learn how to spot cyber threats through games, simulations, storytelling, and practical visual training.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion

## What’s Included

- Immersive cyberpunk homepage
- Threat Academy with dynamic detail pages
- AI Scam Analyzer powered by OpenRouter
- `Spot the Red Flags` mini-game
- Reusable modular component structure
- Responsive dark theme with neon glow effects
- OTP sign-in/sign-up backed by Postgres
- Real leaderboard and quiz progress storage

## Routes

- `/` - Homepage
- `/threats` - Threat Academy landing page
- `/threats/analyzer` - AI Scam Analyzer
- `/threats/[slug]` - Individual threat detail pages
- `/games/red-flags` - Spot the Red Flags mini-game

## Project Structure

- `src/app` - App Router pages and layouts
- `src/components/home` - Homepage sections
- `src/components/threats` - Threat Academy UI
- `src/components/games/redflags` - Mini-game UI
- `src/data` - Shared structured content
- `src/types` - Shared TypeScript types
- `src/lib/ai` - OpenRouter service and prompts

## Getting Started

Copy `.env.example` to `.env` or `.env.local`, then fill in the values for your environment:

```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=mistralai/mistral-small-3.2-24b-instruct
OPENROUTER_FALLBACK_MODEL=google/gemma-4-26b-a4b-it:free
OPENROUTER_FAILOVER_ENABLED=true
DATABASE_URL=your_postgres_connection_string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CYBERSENSE_SESSION_SECRET=your_random_session_secret
CYBERSENSE_DEV_REVEAL_OTP=true
CYBERSENSE_ADMIN_EMAILS=your_admin_email@example.com
GMAIL_USER_EMAIL=your_sender_email@example.com
GMAIL_APP_PASSWORD=your_google_app_password
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Notes

- The app uses a stable Webpack-based dev/build flow in this Windows environment.
- Turbopack is still available through `npm run dev:turbopack`, but this machine may fall back to Webpack for reliability.
- The AI analyzer calls OpenRouter only from the server-side API route.
- Postgres tables are bootstrapped automatically on first auth usage, and the matching schema is documented in [database/schema.sql](database/schema.sql).
- The site manifest, sitemap, and robots metadata are generated from the App Router layer for production deployment readiness.
