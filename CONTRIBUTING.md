# Contributing

This is a portfolio project, so contributions should preserve the main goal: demonstrate clean Vue/Nuxt product engineering in a compact application.

## Local Setup

```bash
pnpm install
pnpm dev
```

## Before Opening A Pull Request

Run:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm generate
```

## Engineering Guidelines

- Keep raw PokeAPI responses out of components.
- Normalize external data through `app/services/pokemon.mapper.ts`.
- Keep scoring and option generation in testable utility modules.
- Model game state changes through explicit events where practical.
- Add focused tests for domain logic before expanding UI tests.

