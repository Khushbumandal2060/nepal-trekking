import { NextResponse } from "next/server";
import {
    deleteBooking,
    listBookings,
    updateBookingStatus,
    type BookingStatus,
} from "@/lib/bookings";

/**
 * Demo-level admin auth. The /admin panel has no real server-side auth — it
 * uses a localStorage session with the hardcoded demo credentials below (the
 * same pair exported from @/admin/admin-store). These headers are sent by the
 * BookingsScreen on every request so we can protect the admin-only endpoints
 * without introducing a separate auth system.
 */
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

function isAdmin(request: Request): boolean {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return false;
    const email = request.headers.get("x-admin-email") ?? "";
    const password = request.headers.get("x-admin-password") ?? "";
    return (
        email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD
    );
}

function unauthorized(): NextResponse {
    return NextResponse.json(
        { ok: false, error: "Unauthorized." },
        { status: 401 }
    );
}

async function readJson(
    request: Request
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; error: string }> {
    try {
        const body = (await request.json()) as Record<string, unknown>;
        return { ok: true, body };
    } catch {
        return { ok: false, error: "Invalid request body." };
    }
}

/** GET /api/admin/bookings — every booking across all users, newest first. */
export async function GET(request: Request) {
    if (!isAdmin(request)) return unauthorized();

    try {
        const bookings = await listBookings();
        return NextResponse.json({ ok: true, bookings });
    } catch (err) {
        console.error("[api/admin/bookings] list failed:", err);
        return NextResponse.json(
            { ok: false, error: "Could not load bookings." },
            { status: 500 }
        );
    }
}

/** PATCH /api/admin/bookings — update a booking's status by id. */
export async function PATCH(request: Request) {
    if (!isAdmin(request)) return unauthorized();

    const parsed = await readJson(request);
    if (!parsed.ok) {
        return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const { body } = parsed;
    const id = String(body.id ?? "").trim();
    const status = String(body.status ?? "").trim() as BookingStatus;

    if (!id) {
        return NextResponse.json(
            { ok: false, error: "Missing booking id." },
            { status: 400 }
        );
    }
    if (status !== "new" && status !== "confirmed" && status !== "cancelled") {
        return NextResponse.json(
            { ok: false, error: "Status must be 'new', 'confirmed' or 'cancelled'." },
            { status: 400 }
        );
    }

    try {
        const booking = await updateBookingStatus(id, status);
        if (!booking) {
            return NextResponse.json(
                { ok: false, error: "Booking not found." },
                { status: 404 }
            );
        }
        return NextResponse.json({ ok: true, booking });
    } catch (err) {
        console.error("[api/admin/bookings] update failed:", err);
        return NextResponse.json(
            { ok: false, error: "Could not update the booking." },
            { status: 500 }
        );
    }
}

/** DELETE /api/admin/bookings — remove a booking by id. */
export async function DELETE(request: Request) {
    if (!isAdmin(request)) return unauthorized();

    const parsed = await readJson(request);
    if (!parsed.ok) {
        return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const id = String(parsed.body.id ?? "").trim();
    if (!id) {
        return NextResponse.json(
            { ok: false, error: "Missing booking id." },
            { status: 400 }
        );
    }

    try {
        const removed = await deleteBooking(id);
        if (!removed) {
            return NextResponse.json(
                { ok: false, error: "Booking not found." },
                { status: 404 }
            );
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[api/admin/bookings] delete failed:", err);
        return NextResponse.json(
            { ok: false, error: "Could not delete the booking." },
            { status: 500 }
        );
    }
}
