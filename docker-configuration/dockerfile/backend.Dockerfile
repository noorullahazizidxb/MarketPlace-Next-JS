# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/apps

FROM base AS source
ARG BACKEND_REPO_URL=https://github.com/noorullahazizidxb/MarketPlace-Back-End-Node-Parisma.git
ARG BACKEND_REPO_REF=main
ARG GIT_USERNAME
RUN --mount=type=secret,id=git_password \
  set -eu; \
  secret_file="/run/secrets/git_password"; \
  if [ -n "${GIT_USERNAME:-}" ] && [ -f "$secret_file" ] && [ -s "$secret_file" ]; then \
  password="$(cat "$secret_file")"; \
  auth_url="$(printf '%s' "$BACKEND_REPO_URL" | sed "s#https://#https://${GIT_USERNAME}:${password}@#")"; \
  git clone --depth=1 --branch "$BACKEND_REPO_REF" "$auth_url" backend; \
  else \
  git clone --depth=1 --branch "$BACKEND_REPO_REF" "$BACKEND_REPO_URL" backend; \
  fi

FROM base AS app
COPY --from=source /opt/apps/backend /srv/backend
WORKDIR /srv/backend
RUN npm install
RUN npx prisma generate

COPY <<'EOF' /usr/local/bin/backend-entrypoint.sh
#!/bin/sh
set -eu

cd /srv/backend

npx prisma generate
npx prisma migrate deploy

if [ "${ENABLE_ELASTIC_SEARCH:-false}" = "true" ]; then
  node scripts/initUsersIndex.js
  if [ -f scripts/reindex-blogs.js ]; then
    node scripts/reindex-blogs.js
  fi
  node scripts/reindex-search.js
fi

node scripts/seedAdmin.js
node scripts/seedAll.js

exec node src/index.js
EOF

RUN sed -i 's/\r$//' /usr/local/bin/backend-entrypoint.sh && chmod +x /usr/local/bin/backend-entrypoint.sh
EXPOSE 4000
# Use absolute path to ensure the entrypoint is found and executed
ENTRYPOINT ["/usr/local/bin/backend-entrypoint.sh"]
