import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
    createBooking,
    type CreateBookingInput,
} from "@/lib/bookings";
import { createUser, findUserByEmail } from "@/lib/users";

const MONTH_RE = /^\d{4}-\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/bookings — create a booking owned by the signed-in user so it
 * shows up in their account dashboard (/account).
 *
 * Guests can't save to the DB because `bookings.user_email` is NOT NULL and
 * references `users(email)`. The booking form keeps a localStorage copy for
 * the demo/admin view, but the database row is what the dashboard reads.
 */
function parseInput(
    body: unknown
): { ok: true; value: CreateBookingInput } | { ok: false; error: string } {
    const raw = (body ?? {}) as Record<string, unknown>;

    const reference = String(raw.reference ?? "").trim();
    if (!/^[A-Z0-9-]{4,20}$/.test(reference)) {
        return { ok: false, error: "Invalid booking reference." };
    }

    const trek_slug = String(raw.trekSlug ?? raw.trek_slug ?? "").trim();
    if (!trek_slug) return { ok: false, error: "Missing trek." };

    const trek_name = String(raw.trekName ?? raw.trek_name ?? "").trim();
    if (!trek_name) return { ok: false, error: "Missing trek name." };

    const days = Number(raw.days);
    if (!Number.isInteger(days) || days < 1 || days > 60) {
        return { ok: false, error: "Invalid trek duration." };
    }

    let departure = String(raw.departure ?? "").trim();
    // The booking form sends "YYYY-MM"; the column is DATE, so pin to day 01.
    if (MONTH_RE.test(departure)) departure = `${departure}-01`;
    if (!DATE_RE.test(departure)) {
        return { ok: false, error: "Departure must be a valid month or date." };
    }
    if (Number.isNaN(new Date(`${departure}T00:00:00Z`).getTime())) {
        return { ok: false, error: "That departure date isn't valid." };
    }

    const departure_type = String(
        raw.departureType ?? raw.departure_type ?? "fixed"
    );
    if (departure_type !== "fixed" && departure_type !== "private") {
        return { ok: false, error: "Departure type must be 'fixed' or 'private'." };
    }

    const group_size = Number(raw.groupSize ?? raw.group_size);
    if (!Number.isInteger(group_size) || group_size < 1 || group_size > 16) {
        return { ok: false, error: "Group size must be between 1 and 16." };
    }

    const name = String(raw.name ?? "").trim();
    if (name.length < 2) return { ok: false, error: "Enter your full name." };

    const email = String(raw.email ?? "").trim();
    if (!EMAIL_RE.test(email)) {
        return { ok: false, error: "Enter a valid email address." };
    }

    const phone = String(raw.phone ?? "").trim() || null;
    const country = String(raw.country ?? "").trim() || null;
    const notes = String(raw.notes ?? "").trim().slice(0, 2000) || null;

    const total = Number(raw.total);
    if (!Number.isFinite(total) || total < 0) {
        return { ok: false, error: "Invalid total." };
    }

    return {
        ok: true,
        value: {
            reference,
            trek_slug,
            trek_name,
            days,
            departure,
            departure_type,
            group_size,
            name,
            email,
            phone,
            country,
            notes,
            total,
        },
    };
}

export async function POST(request: Request) {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "Please sign in to save your booking so you can track it in your dashboard.",
            },
            { status: 401 }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: "Invalid request body." },
            { status: 400 }
        );
    }

    const parsed = parseInput(body);
    if (!parsed.ok) {
        return NextResponse.json(
            { ok: false, error: parsed.error },
            { status: 400 }
        );
    }

    try {
        // Make sure a users row exists so the bookings.user_email FK holds
        // (Google sign-ins may not have a users row yet).
        const existing = await findUserByEmail(email);
        if (!existing) {
            await createUser({
                name: session.user?.name ?? email.split("@")[0],
                email,
                provider: "google",
            });
        }

        const booking = await createBooking(parsed.value, email.toLowerCase());
        return NextResponse.json({ ok: true, booking }, { status: 201 });
    } catch (err) {
        console.error("[api/bookings] create failed:", err);
        return NextResponse.json(
            {
                ok: false,
                error: "Could not save your booking right now. Please try again.",
            },
            { status: 500 }
        );
    }
}
