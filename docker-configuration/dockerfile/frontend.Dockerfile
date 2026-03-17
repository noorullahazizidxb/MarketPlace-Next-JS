# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/apps

FROM base AS source
ARG FRONTEND_REPO_URL=https://github.com/noorullahazizidxb/MarketPlace-Next-JS.git
ARG FRONTEND_REPO_REF=main
RUN git clone --depth=1 --branch "$FRONTEND_REPO_REF" "$FRONTEND_REPO_URL" frontend

FROM base AS app
COPY --from=source /opt/apps/frontend /srv/frontend
WORKDIR /srv/frontend
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
