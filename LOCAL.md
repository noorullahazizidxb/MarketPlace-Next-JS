# LOCAL ONLY — Marketplace frontend docker-configuration

`docker-configuration/docker-compose.yml` is for local/dev experimentation.

## Production

Deploy Marketplace via **DevMinds platform** (`devminds-net` + edge `public-proxy`).

The nginx service in this compose uses Compose profile `edge` and must not own public `:80`/`:443` when the shared edge gateway is up.
