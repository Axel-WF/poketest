# Deployment

The app is designed for static deployment.

## Recommended Targets

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

## Build Command

```bash
pnpm generate
```

## Output Directory

```txt
.output/public
```

## Environment Variables

The default public API base URL is:

```txt
NUXT_PUBLIC_POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

No private API keys are required.

