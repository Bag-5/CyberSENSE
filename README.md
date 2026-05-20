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

Create `.env.local` and add your OpenRouter key:

```bash
OPENROUTER_API_KEY=your_key_here
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
