# CLAUDE.md — Project Instructions

## Overview
Soft Skills Check — open-source trainer for soft skills in the AI era.
Live: https://soft-skills.chillai.space
Repo: https://github.com/job-search-toolkit/soft-skills-check

## Tech Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- AI: Claude Haiku 4.5 via @anthropic-ai/sdk
- Deployment: Cloudflare Workers via @opennextjs/cloudflare
- Storage: Cloudflare KV (analytics), sessionStorage (user data)

## Key Architecture
- All user data stays in sessionStorage (no database for user data)
- AI calls go through `src/lib/anthropic.ts` → callClaude() using Haiku
- Questions are in `src/lib/questions.ts` (self-assessment) and `src/lib/quiz-questions.ts` (knowledge quiz)
- i18n via `src/lib/i18n.ts` + `src/lib/LangContext.tsx` (RU/EN)
- All pages are client components using `useLang()` hook

## User Flow
1. /context — profession tags + optional resume/job description
2. /topics — pick soft skill topics (10 available)
3. /test — self-assessment (5 random questions per topic)
4. /results — AI analysis + radar chart + gap identification
5. /quiz — knowledge quiz with correct/wrong answers
6. /homework — personalized assignment (time + context params)

## Deployment
```bash
npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion
npx wrangler deploy --domain soft-skills.chillai.space
```

## Environment Variables
- ANTHROPIC_API_KEY — Claude API key (set as Cloudflare Worker secret)

## Conventions
- All UI text goes through i18n (src/lib/i18n.ts) — both RU and EN
- Dark theme: bg-slate-950, cards bg-slate-900, accent violet/indigo
- Model: claude-haiku-4-5-20251001 for all AI calls (cheap + fast)
- Questions: mix of general soft skills + AI-era context
