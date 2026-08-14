import { query } from "./db";

/**
 * Typed persistence helpers for the `bookings` table.
 *
 * Every function is scoped to a single user's email so a signed-in user can
 * only ever read, update or delete bookings that belong to them. Callers are
 * expected to pass `session.user.email` after authentication.
 */

export interface BookingRow {
    id: string;
    reference: string;
    trek_slug: string;
    trek_name: string;
    days: number;
    departure: Date | string | null;
    departure_type: string;
    group_size: number;
    name: string;
    email: string;
    phone: string | null;
    country: string | null;
    notes: string | null;
    total: string | number;
    status: string;
    created_at: Date | string;
}

const BOOKING_COLUMNS = `
    id, reference, trek_slug, trek_name, days, departure, departure_type,
    group_size, name, email, phone, country, notes, total, status, created_at
`;

/** All bookings for a user, newest first. */
export async function findBookingsForUser(
    email: string
): Promise<BookingRow[]> {
    const res = await query<BookingRow>(
        `SELECT ${BOOKING_COLUMNS}
         FROM bookings
         WHERE lower(user_email) = lower($1)
         ORDER BY created_at DESC;`,
        [email]
    );
    return res.rows;
}

/** A single booking, but only if it belongs to the given user. */
export async function getBookingForUser(
    id: string,
    email: string
): Promise<BookingRow | null> {
    const res = await query<BookingRow>(
        `SELECT ${BOOKING_COLUMNS}
         FROM bookings
         WHERE id = $1 AND lower(user_email) = lower($2)
         LIMIT 1;`,
        [id, email]
    );
    return res.rows[0] ?? null;
}

/** Input for creating a new booking, owned by an authenticated user. */
export interface CreateBookingInput {
    reference: string;
    trek_slug: string;
    trek_name: string;
    days: number;
    departure: string; // "YYYY-MM-DD"
    departure_type: "fixed" | "private";
    group_size: number;
    name: string;
    email: string;
    phone: string | null;
    country: string | null;
    notes: string | null;
    total: number;
}

/**
 * Insert a new booking owned by `userEmail`. `bookings.user_email` is NOT NULL
 * and references `users(email)`, so the caller must be a signed-in user.
 * Returns the created row.
 */
export async function createBooking(
    input: CreateBookingInput,
    userEmail: string
): Promise<BookingRow> {
    const res = await query<BookingRow>(
        `INSERT INTO bookings (
             reference, user_email, trek_slug, trek_name, days, departure,
             departure_type, group_size, name, email, phone, country, notes,
             total, status
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'new')
         RETURNING ${BOOKING_COLUMNS};`,
        [
            input.reference,
            userEmail,
            input.trek_slug,
            input.trek_name,
            input.days,
            input.departure,
            input.departure_type,
            input.group_size,
            input.name,
            input.email,
            input.phone,
            input.country,
            input.notes,
            input.total,
        ]
    );
    return res.rows[0];
}

export interface BookingUpdateInput {
    group_size?: number;
    departure?: string;
    departure_type?: "fixed" | "private";
    notes?: string;
}

/**
 * Update mutable fields on a booking owned by `email`.
 * Returns the updated row, or `null` if the booking doesn't exist / isn't owned.
 */
export async function updateBookingForUser(
    id: string,
    email: string,
    input: BookingUpdateInput
): Promise<BookingRow | null> {
    const existing = await getBookingForUser(id, email);
    if (!existing) return null;

    const next = {
        group_size: input.group_size ?? existing.group_size,
        departure:
            input.departure !== undefined
                ? input.departure || null
                : existing.departure,
        departure_type: input.departure_type ?? existing.departure_type,
        notes:
            input.notes !== undefined
                ? (input.notes || "").trim() || null
                : existing.notes,
    };

    const res = await query<BookingRow>(
        `UPDATE bookings
         SET group_size = $1,
             departure = $2,
             departure_type = $3,
             notes = $4
         WHERE id = $5 AND lower(user_email) = lower($6)
         RETURNING ${BOOKING_COLUMNS};`,
        [
            next.group_size,
            next.departure,
            next.departure_type,
            next.notes,
            id,
            email,
        ]
    );

    return res.rows[0] ?? null;
}

/** Delete a booking owned by `email`. Returns true if a row was removed. */
export async function deleteBookingForUser(
    id: string,
    email: string
): Promise<boolean> {
    const res = await query(
        `DELETE FROM bookings
         WHERE id = $1 AND lower(user_email) = lower($2);`,
        [id, email]
    );
    return (res.rowCount ?? 0) > 0;
}

/* ============================================================
   ADMIN-ONLY HELPERS
   These are intentionally NOT user-scoped: they operate across
   every booking so the /admin panel can review and update the
   whole pipeline. Only call them behind admin authentication.
   ============================================================ */

/** Statuses the admin can set on a booking. Mirrors BookingStatus in the admin store. */
export type BookingStatus = "new" | "confirmed" | "cancelled";

/** Every booking across all users, newest first — the admin list view. */
export async function listBookings(): Promise<BookingRow[]> {
    const res = await query<BookingRow>(
        `SELECT ${BOOKING_COLUMNS}
         FROM bookings
         ORDER BY created_at DESC;`
    );
    return res.rows;
}

/**
 * Update a booking's status (admin-scoped, any user).
 * Returns the updated row, or `null` if the id doesn't exist.
 */
export async function updateBookingStatus(
    id: string,
    status: BookingStatus
): Promise<BookingRow | null> {
    const res = await query<BookingRow>(
        `UPDATE bookings
         SET status = $1
         WHERE id = $2
         RETURNING ${BOOKING_COLUMNS};`,
        [status, id]
    );
    return res.rows[0] ?? null;
}

/** Delete any booking (admin-scoped). Returns true if a row was removed. */
export async function deleteBooking(id: string): Promise<boolean> {
    const res = await query(`DELETE FROM bookings WHERE id = $1;`, [id]);
    return (res.rowCount ?? 0) > 0;
}
