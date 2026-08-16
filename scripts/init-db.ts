/**
 * One-off database initializer for Trekking Nepal.
 *
 * Creates the `users` and `bookings` tables (if they don't exist) and seeds
 * a demo email/password account so you can test login immediately:
 *
 *     email:    demo@trekkingnepal.com
 *     password: demo1234
 *
 * Usage:
 *   npm run db:init
 *
 * Connection comes from `DATABASE_URL` or the standard PG env vars
 * (PGHOST / PGPORT / PGUSER / PGPASSWORD / PGDATABASE) in `.env.local`.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

/* ---- Load .env.local into process.env (tiny parser, no dotenv dep) ---- */
function loadEnvFile(): void {
    try {
        const raw = readFileSync(resolve(".env.local"), "utf8");
        for (const line of raw.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eq = trimmed.indexOf("=");
            if (eq === -1) continue;
            const key = trimmed.slice(0, eq).trim();
            let value = trimmed.slice(eq + 1).trim();
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }
            if (!(key in process.env)) process.env[key] = value;
        }
    } catch {
        /* no .env.local — fall back to real env vars */
    }
}

loadEnvFile();

function connectionString(): string {
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
    const host = process.env.PGHOST ?? "localhost";
    const port = process.env.PGPORT ?? "5432";
    const user = process.env.PGUSER ?? "postgres";
    const password = process.env.PGPASSWORD ?? "";
    const database = process.env.PGDATABASE ?? "trekking_nepal";
    const creds = password ? `${user}:${encodeURIComponent(password)}` : user;
    return `postgres://${creds}@${host}:${port}/${database}`;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    image         TEXT,
    provider      TEXT NOT NULL DEFAULT 'credentials',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email     TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    reference      TEXT NOT NULL UNIQUE,
    trek_slug      TEXT NOT NULL,
    trek_name      TEXT NOT NULL,
    days           INTEGER NOT NULL,
    departure      DATE NOT NULL,
    departure_type TEXT NOT NULL DEFAULT 'fixed',
    group_size     INTEGER NOT NULL DEFAULT 1,
    name           TEXT NOT NULL,
    email          TEXT NOT NULL,
    phone          TEXT,
    country        TEXT,
    notes          TEXT,
    total          NUMERIC(10,2) NOT NULL DEFAULT 0,
    status         TEXT NOT NULL DEFAULT 'new',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS treks (
    slug       TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    data       JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

async function main(): Promise<void> {
    const pool = new Pool({ connectionString: connectionString() });

    console.log("→ Connecting to the database…");
    await pool.query(SCHEMA);
    console.log("✓ Tables ensured: users, bookings, treks");

    // Seed a demo email/password account so login works out of the box.
    const email = "demo@trekkingnepal.com";
    const name = "Demo Trekker";
    const password = "demo1234";

    const existing = await pool.query(
        "SELECT id FROM users WHERE lower(email) = lower($1);",
        [email]
    );

    if ((existing.rowCount ?? 0) === 0) {
        const passwordHash = await bcrypt.hash(password, 12);
        await pool.query(
            `INSERT INTO users (name, email, password_hash, provider)
             VALUES ($1, $2, $3, 'credentials');`,
            [name, email, passwordHash]
        );
        console.log(`✓ Seeded demo user: ${email} / ${password}`);
    } else {
        console.log(`ℹ Demo user already exists (${email}) — skipping.`);
    }

    await pool.end();
    console.log("Done.");
}

main().catch((err: unknown) => {
    console.error(
        "Initialization failed:",
        err instanceof Error ? err.message : String(err)
    );
    console.error(
        "Check DATABASE_URL in .env.local (or PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE)."
    );
    process.exit(1);
});
