import { treks as baseTreks } from "@/data/treks";
import { query } from "./db";
import type { Trek } from "./types";

/**
 * PostgreSQL persistence for treks created/edited in the /admin panel.
 *
 * The public site ships static seed treks from /src/data/treks.ts. When an
 * admin creates or edits a trek we also persist the full `Trek` object to the
 * `treks` table so it appears on the public /treks page, on its own detail
 * page, and in the booking form. `listPublicTreks` / `getPublicTrek` merge
 * the DB rows on top of the static seeds (DB wins on slug collisions), and
 * fall back to the static seeds alone if the database is unreachable.
 */

/** Every admin-created/edited trek stored in the DB. */
export async function listTreksFromDb(): Promise<Trek[]> {
    const res = await query<{ data: Trek }>(
        "SELECT data FROM treks ORDER BY created_at ASC;"
    );
    return res.rows.map((r) => r.data);
}

/** A single DB-backed trek by slug, or null. */
export async function getTrekFromDb(slug: string): Promise<Trek | null> {
    const res = await query<{ data: Trek }>(
        "SELECT data FROM treks WHERE slug = $1;",
        [slug]
    );
    return res.rows[0]?.data ?? null;
}

/** Insert or replace a trek (keyed by slug) in the DB. */
export async function saveTrekToDb(trek: Trek): Promise<void> {
    await query(
        `INSERT INTO treks (slug, name, data)
         VALUES ($1, $2, $3::jsonb)
         ON CONFLICT (slug) DO UPDATE
           SET name = EXCLUDED.name,
               data = EXCLUDED.data,
               updated_at = now();`,
        [trek.slug, trek.name, JSON.stringify(trek)]
    );
}

/** Remove a DB-backed trek by slug. Returns false if it didn't exist. */
export async function deleteTrekFromDb(slug: string): Promise<boolean> {
    const res = await query("DELETE FROM treks WHERE slug = $1;", [slug]);
    return (res.rowCount ?? 0) > 0;
}

/** Static seeds merged with DB treks — what the public /treks page shows. */
export async function listPublicTreks(): Promise<Trek[]> {
    try {
        const dbTreks = await listTreksFromDb();
        const bySlug = new Map<string, Trek>();
        for (const t of baseTreks) bySlug.set(t.slug, t);
        for (const t of dbTreks) bySlug.set(t.slug, t);
        return [...bySlug.values()];
    } catch (err) {
        console.error("[treks] DB unavailable, falling back to seed data:", err);
        return [...baseTreks];
    }
}

/** Resolve a trek for the public detail page (DB first, then static seeds). */
export async function getPublicTrek(slug: string): Promise<Trek | null> {
    try {
        const dbTrek = await getTrekFromDb(slug);
        if (dbTrek) return dbTrek;
    } catch (err) {
        console.error("[treks] DB unavailable, falling back to seed data:", err);
    }
    return baseTreks.find((t) => t.slug === slug) ?? null;
}
