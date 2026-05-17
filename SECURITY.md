# Security Policy

This is a static portfolio application that uses public PokeAPI data and does not require secrets.

Please report security concerns by opening a GitHub issue with a clear description and reproduction steps. Do not include sensitive personal data in public reports.

## Project Security Notes

- No API keys are required.
- `.env` files are ignored by Git.
- External API data should be normalized before use.
- Components should not render untrusted HTML.
- User-facing errors should avoid exposing stack traces.

