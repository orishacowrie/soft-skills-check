# CLAUDE.md — Project Instructions

## Overview
Soft Skills Check — open-source trainer for soft skills in the AI era.
Live: https://soft-skills.chillai.space
Repo: https://github.com/job-search-toolkit/soft-skills-check

## Tech Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- AI: GPT-4o-mini (primary, cheapest) → Claude Haiku 4.5 (fallback)
- Deployment: Cloudflare Workers via @opennextjs/cloudflare
- Storage: Cloudflare KV namespace `ANALYTICS` (anonymous aggregates), sessionStorage (user data)

## Key Architecture
- All user data stays in sessionStorage (no database for user data)
- AI calls: `src/lib/anthropic.ts` → `callAI()` — tries OpenAI first, falls back to Claude
- Questions: `src/lib/questions.ts` (self-assessment), `src/lib/quiz-questions.ts` + `src/lib/quiz-pool.ts` (210 quiz questions)
- i18n: `src/lib/i18n.ts` + `src/lib/LangContext.tsx` (RU/EN)
- All pages are client components using `useLang()` hook
- Question quality ratings collected via `/api/analytics` into KV

## User Flow
1. `/context` — profession tags + optional resume/job description
2. `/topics` — pick soft skill topics (10 available)
3. `/test` — self-assessment (5 random questions per topic)
4. `/results` — AI analysis + radar chart + gap identification
5. `/quiz` — knowledge quiz (5 random from 20+ per topic), instant feedback
6. `/homework` — email verification → personalized assignment (time + context params)

## Local Development
```bash
cp .env.example .env.local
# Add at least one: OPENAI_API_KEY or ANTHROPIC_API_KEY
npm install
npm run dev
```

## Deploy to Your Own Cloudflare
```bash
# 1. Create a Cloudflare Workers project
npx wrangler pages project create my-soft-skills

# 2. Create KV namespace for analytics
npx wrangler kv namespace create ANALYTICS
# Copy the ID into wrangler.jsonc

# 3. Set API key(s) as secrets
echo "sk-your-key" | npx wrangler secret put OPENAI_API_KEY
echo "sk-ant-your-key" | npx wrangler secret put ANTHROPIC_API_KEY  # optional fallback

# 4. Build and deploy
npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion
npx wrangler deploy --domain your-domain.example.com
```

## Testing Your Branch Before PR
```bash
# Build locally to catch errors
npm run build

# Preview with Cloudflare dev server
npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion
npx wrangler dev

# Or deploy to a preview URL (doesn't affect production)
npx wrangler deploy  # without --domain, deploys to *.workers.dev
```

## Environment Variables
- `OPENAI_API_KEY` — GPT-4o-mini (primary, ~$0.15/1M input)
- `ANTHROPIC_API_KEY` — Claude Haiku (fallback, ~$0.80/1M input)
- At least one is required. Both can be set for redundancy.

## Conventions
- All UI text goes through i18n (`src/lib/i18n.ts`) — both RU and EN
- Dark theme: bg-slate-950, cards bg-slate-900, accent violet/indigo
- AI model: GPT-4o-mini primary, Claude Haiku fallback (see `src/lib/anthropic.ts`)
- Questions: mix of general soft skills + AI-era context
- Quiz questions: correct answer must NOT be longer than alternatives
- Each question has a quality rating widget (collected in KV analytics)
