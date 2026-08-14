import { NextResponse } from "next/server";
import {
    deleteTrekFromDb,
    listTreksFromDb,
    saveTrekToDb,
} from "@/lib/treks-db";
import type { Trek } from "@/lib/types";

/**
 * /api/admin/treks — server-side persistence for the treks admin panel.
 *
 * The admin panel used to save treks only to the browser's localStorage, so
 * admin-created treks never reached the public site. These handlers write the
 * same trek objects to the `treks` table, which the public /treks, detail and
 * /book pages read. Guarded by the demo admin header credentials (same scheme
 * as /api/admin/bookings).
 */

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

function isAdmin(request: Request): boolean {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return false;
    const email = request.headers.get("x-admin-email") ?? "";
    const password = request.headers.get("x-admin-password") ?? "";
    return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

function unauthorized() {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

/** GET — list all DB-backed treks (admin view / verification). */
export async function GET(request: Request) {
    if (!isAdmin(request)) return unauthorized();
    try {
        const treks = await listTreksFromDb();
        return NextResponse.json({ ok: true, treks });
    } catch (err) {
        console.error("[api/admin/treks] list failed:", err);
        return NextResponse.json(
            { ok: false, error: "Could not load treks." },
            { status: 500 }
        );
    }
}

/** POST — create or replace a trek (body: { trek: Trek }). */
export async function POST(request: Request) {
    if (!isAdmin(request)) return unauthorized();

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: "Invalid request body." },
            { status: 400 }
        );
    }

    const raw = (body ?? {}) as Record<string, unknown>;
    const trek = raw.trek as Trek | undefined;
    if (!trek || typeof trek !== "object" || !trek.slug || !trek.name) {
        return NextResponse.json(
            { ok: false, error: "Trek must include a slug and a name." },
            { status: 400 }
        );
    }

    try {
        await saveTrekToDb(trek);
        return NextResponse.json({ ok: true, trek }, { status: 200 });
    } catch (err) {
        console.error("[api/admin/treks] save failed:", err);
        return NextResponse.json(
            { ok: false, error: "Could not save the trek." },
            { status: 500 }
        );
    }
}

/** DELETE — remove a DB-backed trek (body: { slug }). */
export async function DELETE(request: Request) {
    if (!isAdmin(request)) return unauthorized();

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: "Invalid request body." },
            { status: 400 }
        );
    }

    const raw = (body ?? {}) as Record<string, unknown>;
    const slug = String(raw.slug ?? "").trim();
    if (!slug) {
        return NextResponse.json(
            { ok: false, error: "Missing trek slug." },
            { status: 400 }
        );
    }

    try {
        const deleted = await deleteTrekFromDb(slug);
        if (!deleted) {
            return NextResponse.json(
                { ok: false, error: "Trek not found." },
                { status: 404 }
            );
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[api/admin/treks] delete failed:", err);
        return NextResponse.json(
            { ok: false, error: "Could not delete the trek." },
            { status: 500 }
        );
    }
}
