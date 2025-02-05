import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "@@/generated/kysely.d";

const { Pool } = pg;

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const kyselyDb = new Kysely<DB>({
  dialect,
});
