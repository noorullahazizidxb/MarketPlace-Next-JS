# Ubuntu — Marketplace Next.js

```bash
sudo bash scripts/ubuntu-bootstrap.sh
cp .env.example .env
npm ci
npm run build
bash scripts/ubuntu-run.sh
```

Point nginx `/` at `:3000`. Same-domain API: proxy `/backend/` to Express `:4000` (see `MarketPlace-Back-End-Node-Parisma/docs/nginx-marketplace.devminds.net.conf`).
