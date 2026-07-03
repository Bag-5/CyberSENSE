# CyberSENSE

CyberSENSE is a cybersecurity awareness platform built around safe, defensive learning. It combines an authenticated Threat Academy, an AI Scam Analyzer, a CyberSENSE Assistant, interactive games, weekly competition flows, and superadmin reporting so learners can build instincts through guided practice instead of passive reading.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- PostgreSQL persistence
- OpenRouter AI integration
- OTP-based authentication

## Product Shape

- Threat Academy is the main learner hub and requires sign-in.
- Courses are structured as lesson, quiz, attack lab, then certificate.
- Course completion certificates use the learner's entered full name and generate as downloadable PDFs.
- The AI Scam Analyzer is defensive only and can enrich analysis with VirusTotal threat intelligence when indicators are present.
- The CyberSENSE Assistant answers beginner-friendly cyber questions and stays focused on safe, educational guidance.
- Weekly Quiz Competition is user-facing, but the current week is controlled by superadmin publish state.
- Superadmin tools stay separate from the learner experience.

## Included Surfaces

- Home and landing experience
- Threat Academy
- AI Scam Analyzer
- CyberSENSE Assistant
- Spot the Red Flags game
- Weekly Quiz Competition
- Reports and certificate generation
- Superadmin Control Room
- Superadmin Analytics

## Authentication

- OTP sign-in/sign-up with username and email
- Gmail SMTP for OTP delivery
- Separate learner and superadmin session handling
- Allowlisted superadmin access by email
- Immediate sign-in/sign-out updates without manual refresh

## Routes

- `/` - Home
- `/auth` - OTP authentication
- `/threats` - Threat Academy
- `/threats/[slug]` - Individual threat lesson
- `/threats/analyzer` - AI Scam Analyzer
- `/assistant` - CyberSENSE Assistant
- `/games/red-flags` - Spot the Red Flags
- `/weekly-quiz-competition` - Weekly competition
- `/reports` - Reports and certificates
- `/lab` - Simulation lab
- `/superadmin` - Superadmin control room
- `/superadmin/analytics` - Superadmin analytics

## Project Structure

- `src/app` - App Router pages, API routes, and layouts
- `src/components/home` - Homepage sections and visual surfaces
- `src/components/threats` - Threat Academy and analyzer UI
- `src/components/assistant` - Chat assistant and launcher
- `src/components/auth` - OTP sign-in and sign-out
- `src/components/reports` - Reports and certificate UI
- `src/data` - Structured content and question banks
- `src/lib/ai` - OpenRouter prompts and request handling
- `src/lib/auth` - Session, OTP, and role utilities
- `src/lib/virustotal.ts` - Threat intelligence lookup helpers
- `src/lib/extract-indicators.ts` - URL, domain, and IP extraction

## Getting Started

Copy `.env.example` to `.env`, then fill in the values for your environment.

```bash
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=mistralai/mistral-small-3.2-24b-instruct
OPENROUTER_FALLBACK_MODEL=google/gemma-4-26b-a4b-it:free
OPENROUTER_FAILOVER_ENABLED=true
VIRUSTOTAL_API_KEY=your_virustotal_key_here
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

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Notes

- The AI features are server-side only.
- The Threat Academy and its lesson pages are gated behind learner sign-in.
- The app uses a stable Webpack-based dev/build flow in this Windows environment.
- `VIRUSTOTAL_API_KEY` is optional, but when present it enriches scam analysis with live threat intelligence.
- Postgres-backed persistence powers auth, progress, leaderboard, and report flows.
