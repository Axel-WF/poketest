# pokestatdle

pokestatdle is a Nuxt 3 guessing game where players infer Pokemon base stats from public PokeAPI data. It is a small portfolio project focused on clean TypeScript domain modeling, Pinia state, API normalization, deterministic scoring rules, local browser persistence, and static deployment.

## Current Status

The game is implemented as a static Nuxt app and is configured for GitHub Pages deployment.

Implemented:

- Random Pokemon rounds using selected generation pools
- PokeAPI fetch and response mapping into internal domain models
- Difficulty modes for easy, medium, and hard rounds
- Percentage-based stat option generation
- Rank-based scoring and deviation metrics
- Round result screen
- Local browser history for the 10 latest rounds
- CI checks for type safety, linting, tests, and static generation
- GitHub Pages deployment after CI succeeds on `main`

Not yet implemented:

- Full settings page controls
- Chart-based result visualizations
- Persistent user preferences beyond in-memory session state

## How The Game Works

The app selects a random Pokemon ID from the active generation pool, fetches the Pokemon profile from PokeAPI, normalizes the response, and asks the player to infer six base stats:

- HP
- Attack
- Defense
- Special Attack
- Special Defense
- Speed

For each stat, the game presents three options: the real value plus two plausible distractors. Distractors are generated from percentage-based deltas so low stats get smaller absolute gaps and high stats get larger absolute gaps.

After a round, the app scores each answer:

- Exact answer: 100 points
- Closest wrong option: 50 points
- Farthest wrong option: 0 points

The result screen shows total score, accuracy, actual values, selected values, and deviation per stat. Completed rounds are saved in `localStorage`.

## Routes

- `/` - main menu, difficulty selection, generation filters
- `/play` - active guessing round
- `/results` - latest round summary
- `/history` - local round archive and basic performance summary
- `/settings` - placeholder settings page

## Tech Stack

- Nuxt 3
- Vue 3 Composition API
- TypeScript
- Pinia
- Tailwind CSS
- Vitest
- Vue Test Utils
- GitHub Actions
- GitHub Pages

## Requirements

- Node.js `>=22.0.0`
- pnpm `>=9.0.0`

The repository pins pnpm through:

```json
"packageManager": "pnpm@9.15.4"
```

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

Preview the generated site:

```bash
pnpm generate
npx serve .output/public
```

## Testing

The current unit tests cover domain logic:

- Stat option generation includes the correct value
- Generated options are unique
- Generated options stay inside valid stat ranges
- Difficulty changes the generated percentage delta range
- Generated wrong options scale with the actual stat value
- Scoring rewards exact answers
- Scoring ranks wrong answers by generated-option deviation

## CI/CD

This repository uses two GitHub Actions workflows:

- `CI` runs on pushes and pull requests targeting `main`
- `Deploy GitHub Pages` runs after `CI` completes successfully on `main`

The CI workflow runs:

```txt
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm generate
```

The deployment workflow builds the static app with:

```txt
NUXT_APP_BASE_URL=/poketest/
pnpm generate
```

Then it uploads `.output/public` to GitHub Pages.

## Deployment

The production deployment target is GitHub Pages:

```txt
https://Axel-WF.github.io/poketest/
```

The app uses this Nuxt base URL setting so assets resolve correctly under the repository subpath:

```ts
app: {
  baseURL: process.env.NUXT_APP_BASE_URL || '/'
}
```

For a different Pages repository name, update `NUXT_APP_BASE_URL` in `.github/workflows/deploy-pages.yml`.

## Environment Variables

The app uses the public PokeAPI endpoint by default:

```txt
NUXT_PUBLIC_POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

No private API keys are required.

## Security And Reliability Notes

- No secrets are required for local development or deployment
- `.env` files are ignored by Git
- PokeAPI responses are normalized before reaching page components
- Components do not render untrusted HTML
- Round history is stored only in the user's browser
- GitHub Pages serves the app as static files with no backend server

