# Docker — Marketplace Next.js

```bash
bash scripts/docker-build.sh
```

Or use `MarketPlace-Next-JS/docker-configuration/` compose. Set `output: "standalone"` is enabled in `next.config.mjs`.

Typical bake-time args: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
