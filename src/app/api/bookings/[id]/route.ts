import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
    deleteBookingForUser,
    getBookingForUser,
    updateBookingForUser,
    type BookingUpdateInput,
} from "@/lib/bookings";

/**
 * Authenticated endpoints for a signed-in user to manage ONE of their own
 * bookings. Ownership is enforced on every query by matching the booking's
 * `user_email` against the session email.
 *
 *   PATCH  /api/bookings/[id]  — update group size / departure / notes
 *   DELETE /api/bookings/[id]  — cancel & delete the booking
 */

interface RouteContext {
    params: Promise<{ id: string }>;
}

const DEPARTURE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseInput(body: unknown): { ok: true; value: BookingUpdateInput } | { ok: false; error: string } {
    const raw = (body ?? {}) as Record<string, unknown>;

    const input: BookingUpdateInput = {};

    if (raw.group_size !== undefined) {
        const n = Number(raw.group_size);
        if (!Number.isInteger(n) || n < 1 || n > 16) {
            return { ok: false, error: "Group size must be between 1 and 16." };
        }
        input.group_size = n;
    }

    if (raw.departure !== undefined && raw.departure !== null) {
        const dep = String(raw.departure).trim();
        if (!DEPARTURE_RE.test(dep)) {
            return {
                ok: false,
                error: "Departure must be a date in YYYY-MM-DD format.",
            };
        }
        const d = new Date(`${dep}T00:00:00Z`);
        if (Number.isNaN(d.getTime())) {
            return { ok: false, error: "That departure date isn't valid." };
        }
        input.departure = dep;
    }

    if (raw.departure_type !== undefined) {
        const dt = String(raw.departure_type);
        if (dt !== "fixed" && dt !== "private") {
            return {
                ok: false,
                error: "Departure type must be 'fixed' or 'private'.",
            };
        }
        input.departure_type = dt;
    }

    if (raw.notes !== undefined && raw.notes !== null) {
        const notes = String(raw.notes);
        if (notes.length > 2000) {
            return { ok: false, error: "Notes must be under 2,000 characters." };
        }
        input.notes = notes;
    }

    return { ok: true, value: input };
}

export async function PATCH(request: Request, { params }: RouteContext) {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json(
            { ok: false, error: "You need to be signed in." },
            { status: 401 }
        );
    }

    const { id } = await params;

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
        return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    try {
        const updated = await updateBookingForUser(id, email, parsed.value);
        if (!updated) {
            return NextResponse.json(
                { ok: false, error: "Booking not found." },
                { status: 404 }
            );
        }
        return NextResponse.json({ ok: true, booking: updated });
    } catch (err) {
        console.error("[api/bookings] update failed:", err);
        return NextResponse.json(
            { ok: false, error: "Could not update your booking right now. Please try again." },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) {
        return NextResponse.json(
            { ok: false, error: "You need to be signed in." },
            { status: 401 }
        );
    }

    const { id } = await params;

    try {
        const existing = await getBookingForUser(id, email);
        if (!existing) {
            return NextResponse.json(
                { ok: false, error: "Booking not found." },
                { status: 404 }
            );
        }

        await deleteBookingForUser(id, email);
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[api/bookings] delete failed:", err);
        return NextResponse.json(
            { ok: false, error: "Could not cancel your booking right now. Please try again." },
            { status: 500 }
        );
    }
}
