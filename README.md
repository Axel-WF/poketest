# pokestatdle

pokestatdle is a Nuxt 3 guessing game that asks players to infer Pokemon base stats from external API data. It is intended to work as a feature-rich game first, while still demonstrating TypeScript modeling, Pinia state, API normalization, scoring, local persistence, and performance-aware UI.

## Project Status

This repository is in the setup phase. The initial structure is ready for implementation:

- Nuxt 3 + Vue 3 + TypeScript starter configuration
- Pinia-oriented state boundaries
- PokeAPI client and mapper layer
- Domain types for Pokemon profiles, game events, stat questions, and scoring
- Utility modules for random selection, shuffling, clamping, generation ranges, and scoring
- GitHub Actions workflow for type checks, linting, tests, and static generation
- Public repository documentation and contribution hygiene

## Product Goal

The app selects a random Pokemon, normalizes its PokeAPI data into an internal profile, and asks the user to infer six base stats:

- HP
- Attack
- Defense
- Special Attack
- Special Defense
- Speed

For each stat, the game generates three controlled options: the real value plus two plausible distractors. Distractors use percentage-based deltas, so low stats get smaller absolute gaps and high stats get larger absolute gaps. The two distractors can both be lower, both be higher, or split around the real value, preventing the real value from always being the numeric middle. After a round, the app calculates score, deviation, accuracy, and performance history.

## Tech Stack

- Nuxt 3
- Vue 3 Composition API
- TypeScript
- Pinia
- Tailwind CSS
- VueUse
- Vitest
- Vue Test Utils
- Playwright
- Chart.js or another Vue-compatible charting library

## Game Features

- Classic stat inference rounds
- Generation pool selection for random Pokemon IDs
- Percentage-based distractor generation by difficulty
- Difficulty hints: easy reveals base total and two correct stats, medium reveals base total, hard hides base total
- Rank-based scoring: exact answers score 100, the closest wrong option scores 50, and the farthest wrong option scores 0
- Round results with deviation and accuracy metrics
- Local performance history
- Settings for difficulty, generation filters, theme, and accessibility

## Planned Routes

- `/` - game entry point
- `/play` - main game loop
- `/results` - round summary and charts
- `/history` - previous rounds and performance analytics
- `/settings` - difficulty, generations, theme, and accessibility options

## Development

Install dependencies:

```bash
pnpm install
```

Run the app locally:

```bash
pnpm dev
```

Run quality checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

Generate a static build:

```bash
pnpm generate
```

## Testing Strategy

The first tests should focus on domain logic:

- Stat option generation includes the correct value
- Generated options are unique
- Generated options stay inside valid stat ranges
- Difficulty changes the generated percentage delta range
- Generated wrong options scale with the actual stat value
- Scoring rewards exact answers and ranks wrong answers by generated-option deviation
- PokeAPI mapper normalizes the expected response shape

## Deployment

This app is intended for static deployment through GitHub Pages, Cloudflare Pages, Netlify, or Vercel. The Nuxt config uses static generation defaults so the app can be hosted without a backend server.

## Security And Reliability Notes

- No API keys are required or exposed
- External API data is normalized before use
- Components should not depend on raw PokeAPI responses
- User-submitted HTML is not rendered
- Error states should avoid leaking technical stack traces
- Strict TypeScript should prevent invalid game states where practical

## Roadmap

- Build the game store and event dispatcher
- Implement PokeAPI caching and prefetching
- Build the main play experience
- Add results charts and history analytics
- Add settings for difficulty and generation filters
- Add unit and component tests
- Polish responsive UI, accessibility, and deployment docs
