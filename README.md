# Soft Skills Check for Vibe Coders

An AI-powered assessment tool that evaluates soft skills essential for developers who work with AI tools ("vibe coders"). Take a 30-question self-assessment, get AI-generated analysis, and receive a personalized improvement plan.

## What it does

1. **Self-Assessment** (30 questions) — Rate yourself across 6 dimensions on a 1-5 scale
2. **AI Analysis** — Claude analyzes your answers and builds a skill profile with a radar chart
3. **Deep Dive** (AI-generated) — 10-15 follow-up questions focused on your weakest areas
4. **Recommendations** — Personalized action plan with daily habits and weekly goals

## The 6 Dimensions

| Dimension | What it measures |
|---|---|
| Critical Thinking | Evaluating AI output, catching hallucinations, not blindly trusting results |
| Communication | Prompt engineering, explaining technical decisions to stakeholders |
| Adaptability | Learning new tools quickly, flexibility, handling frustration |
| Self-Organization | Planning, discipline, quality control, meaningful git usage |
| Product Thinking | UX sense, understanding user needs, knowing when to ship |
| Collaboration | Teamwork, giving/receiving feedback, sharing knowledge |

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Anthropic Claude API** for AI analysis and test generation
- No database — everything runs client-side with API routes

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/your-username/soft-skills-check.git
cd soft-skills-check
npm install
```

### Configuration

Copy the example environment file and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Building

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── test/page.tsx         # Self-assessment (30 questions)
│   ├── results/page.tsx      # Results + radar chart + AI analysis
│   ├── deep-dive/page.tsx    # AI-generated follow-up test
│   ├── recommendations/      # Personalized improvement plan
│   └── api/
│       ├── analyze/          # AI analysis of test 1
│       ├── generate-test/    # Generate deep-dive questions
│       └── recommend/        # Generate recommendations
├── components/
│   ├── QuestionCard.tsx      # Single question with 1-5 scale
│   ├── ProgressBar.tsx       # Test progress indicator
│   ├── DimensionChart.tsx    # SVG radar/spider chart
│   └── RecommendationCard.tsx
├── lib/
│   ├── questions.ts          # All 30 questions with metadata
│   ├── scoring.ts            # Scoring logic (handles reverse questions)
│   └── anthropic.ts          # Claude API client
└── types/
    └── assessment.ts         # TypeScript type definitions
```

## How Scoring Works

Each question is rated 1-5. Some questions are "reverse-scored" — agreement indicates a weaker skill (e.g., "I usually move on without reading AI-generated code"). For these, the score is flipped: `adjusted = 6 - raw`.

Dimension scores are the average of their 5 questions (after adjustment), giving a 1-5 range per dimension.

## Contributing

Contributions are welcome! Some ideas:

- Add more dimensions or questions
- Improve the AI prompts for better analysis
- Add result sharing/export
- Support more languages
- Add data persistence (optional accounts)
- Improve accessibility

### Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run `npm run build` to verify everything compiles
5. Commit with a clear message
6. Open a Pull Request

## Privacy

No data is stored on the server. All assessment data lives in the browser's sessionStorage and is lost when the tab is closed. The only external call is to the Anthropic API for analysis.

## License

MIT — see [LICENSE](./LICENSE).
