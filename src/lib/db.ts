import { Pool } from "pg";
import type { QueryResult, QueryResultRow } from "pg";

/**
 * PostgreSQL connection pool for the Trekking Nepal app.
 *
 * Connection is resolved from (in priority order):
 *   1. `DATABASE_URL`       — e.g. postgres://postgres:secret@localhost:5432/trekking_nepal
 *   2. Standard PG env vars — PGHOST / PGPORT / PGUSER / PGPASSWORD / PGDATABASE
 *
 * The pool is cached on `globalThis` so Next.js dev-mode hot reloads reuse
 * the same connections instead of exhausting the Postgres connection limit.
 */
function resolveConnectionString(): string {
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

    const host = process.env.PGHOST ?? "localhost";
    const port = process.env.PGPORT ?? "5432";
    const user = process.env.PGUSER ?? "postgres";
    const password = process.env.PGPASSWORD ?? "";
    const database = process.env.PGDATABASE ?? "trekking_nepal";

    const creds = password
        ? `${user}:${encodeURIComponent(password)}`
        : user;
    return `postgres://${creds}@${host}:${port}/${database}`;
}

const globalForPg = globalThis as unknown as { _tnPool?: Pool };

export const pool: Pool =
    globalForPg._tnPool ??
    new Pool({
        connectionString: resolveConnectionString(),
        max: 10,
        idleTimeoutMillis: 30_000,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPg._tnPool = pool;
}

/** Typed query helper so callers don't have to juggle Pool directly. */
export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> {
    return pool.query<T>(text, params);
}

/** True once the DB is reachable and the expected tables exist. */
export async function checkDatabase(): Promise<boolean> {
    try {
        const res = await query<{ table_name: string }>(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'bookings');"
        );
        return (res.rowCount ?? 0) > 0;
    } catch {
        return false;
    }
}
