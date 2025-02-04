Make the extensions as superuser with:


Run `pnpm nhost up`

`psql postgres://postgres:postgres@local.db.nhost.run:5432/local -f nhost/migrations/default/0_extensions/up.sql`


Then run `pnpm nhost down` and `pnpm nhost up` again.
