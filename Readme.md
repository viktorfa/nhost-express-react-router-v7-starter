# Nhost starter with Express and React Router V7

## SaaS boilerplate with subscriptions and organizations

Some migrations to Nhost are added so that it's easy to get started with a SaaS app.

If you use the server and frontend in this project, it's designed to be self hosted on a server. The React Router frontend is part of the Express server, which makes it easy to add handlers for Hasura events and other backend logic.

### Setup

Make the extensions as superuser with:

Run `pnpm nhost up`

`psql postgres://postgres:postgres@local.db.nhost.run:5432/local -f nhost/migrations/default/0_extensions/up.sql`

Then run `pnpm nhost down` and `pnpm nhost up` again.

Extensions for Postgres are:

- vector (for vector search)
- pg_stat_statements (for monitoring)
- pg_trgm (for trigram search)
- hypopg (for automatic index optimization with Dexter)

Just edit the `nhost/migrations/default/0_extensions/up.sql` file to add or remove extensions.

Install packages with `pnpm i`

Generate types for Kysely (Postgres query builder) with `pnpm nhost generate-kysely-types`
Generate GraphQL types with `pnpm nhost generate-graphql-types`

Develop with `pnpm dev` and build with `pnpm build`
