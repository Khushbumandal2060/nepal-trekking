"use client";

import { useEffect, useState } from "react";
import {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    deleteBooking,
    loadBookings,
    updateBookingStatus,
    type BookingRecord,
    type BookingStatus,
} from "@/admin/admin-store";
import type { BookingRow } from "@/lib/bookings";

const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatDeparture(ym: string): string {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

/** Demo admin auth headers sent with every admin bookings API call. */
function adminHeaders(): Record<string, string> {
    return {
        "Content-Type": "application/json",
        "x-admin-email": ADMIN_EMAIL,
        "x-admin-password": ADMIN_PASSWORD,
    };
}

/** Map a DB row (snake_case) to the camelCase shape the screen renders. */
function toRecord(row: BookingRow): BookingRecord {
    const departure =
        typeof row.departure === "string"
            ? row.departure.slice(0, 10)
            : row.departure instanceof Date
                ? row.departure.toISOString().slice(0, 10)
                : "";
    return {
        id: row.id,
        reference: row.reference,
        trekSlug: row.trek_slug,
        trekName: row.trek_name,
        days: row.days,
        departure,
        departureType: row.departure_type === "private" ? "private" : "fixed",
        groupSize: row.group_size,
        name: row.name,
        email: row.email,
        phone: row.phone ?? "",
        country: row.country ?? "",
        notes: row.notes ?? "",
        total: Number(row.total),
        status: row.status as BookingStatus,
        createdAt:
            typeof row.created_at === "string"
                ? row.created_at
                : row.created_at instanceof Date
                    ? row.created_at.toISOString()
                    : new Date().toISOString(),
    };
}

/** DB bookings first, then localStorage (seed + guest) bookings, deduped by id. */
function mergeBookings(dbRows: BookingRow[], local: BookingRecord[]): BookingRecord[] {
    const seen = new Set<string>();
    const merged: BookingRecord[] = [];
    for (const rec of [...dbRows.map(toRecord), ...local]) {
        if (seen.has(rec.id)) continue;
        seen.add(rec.id);
        merged.push(rec);
    }
    return merged;
}

type Filter = "all" | BookingStatus;

const FILTERS: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
];

export default function BookingsScreen() {
    const [bookings, setBookings] = useState<BookingRecord[] | null>(null);
    const [filter, setFilter] = useState<Filter>("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            let fromDb: BookingRow[] = [];
            try {
                const res = await fetch("/api/admin/bookings", {
                    headers: adminHeaders(),
                });
                const data = (await res.json()) as {
                    ok: boolean;
                    bookings?: BookingRow[];
                };
                if (res.ok && data.ok && Array.isArray(data.bookings)) {
                    fromDb = data.bookings;
                }
            } catch {
                /* fall through to localStorage */
            }
            if (!cancelled) setBookings(mergeBookings(fromDb, loadBookings()));
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (!bookings) {
        return <p className="admin-empty">Loading bookings…</p>;
    }

    const visible =
        filter === "all"
            ? bookings
            : bookings.filter((b) => b.status === filter);

    const confirmedRevenue = bookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum, b) => sum + b.total, 0);

    async function handleStatusChange(id: string, status: BookingStatus) {
        // Optimistically update the UI, then reconcile with the DB.
        setBookings((cur) =>
            cur === null
                ? cur
                : cur.map((b) => (b.id === id ? { ...b, status } : b))
        );
        try {
            const res = await fetch("/api/admin/bookings", {
                method: "PATCH",
                headers: adminHeaders(),
                body: JSON.stringify({ id, status }),
            });
            if (!res.ok) setBookings(updateBookingStatus(id, status));
        } catch {
            setBookings(updateBookingStatus(id, status));
        }
    }

    async function handleDelete(b: BookingRecord) {
        const confirmed = window.confirm(
            `Delete booking ${b.reference} (${b.name})? This cannot be undone.`
        );
        if (!confirmed) return;
        try {
            const res = await fetch("/api/admin/bookings", {
                method: "DELETE",
                headers: adminHeaders(),
                body: JSON.stringify({ id: b.id }),
            });
            if (res.ok) {
                setBookings((cur) =>
                    cur === null ? cur : cur.filter((x) => x.id !== b.id)
                );
                if (expandedId === b.id) setExpandedId(null);
                return;
            }
        } catch {
            /* fall through to localStorage */
        }
        setBookings(deleteBooking(b.id));
        if (expandedId === b.id) setExpandedId(null);
    }

    return (
        <>
            <div className="admin-topbar">
                <div>
                    <h1>Bookings</h1>
                    <p>
                        Requests submitted through the booking form, including
                        ones you create live on the site. Update their status as
                        your team confirms departures.
                    </p>
                </div>
            </div>

            <div className="admin-stats">
                <div className="admin-stat">
                    <span className="admin-stat-label">Total bookings</span>
                    <span className="admin-stat-value">{bookings.length}</span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Awaiting review</span>
                    <span className="admin-stat-value">
                        {bookings.filter((b) => b.status === "new").length}
                    </span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Confirmed</span>
                    <span className="admin-stat-value">
                        {bookings.filter((b) => b.status === "confirmed").length}
                    </span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Confirmed value</span>
                    <span className="admin-stat-value">
                        {money.format(confirmedRevenue)}
                    </span>
                </div>
            </div>

            <div className="admin-tabs" style={{ marginBottom: 18 }}>
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        type="button"
                        className={
                            "admin-tab" + (filter === f.value ? " active" : "")
                        }
                        onClick={() => setFilter(f.value)}
                    >
                        {f.label}
                        {f.value === "all" ? "" : ` · ${bookings.filter((b) => b.status === f.value).length}`}
                    </button>
                ))}
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>
                            {filter === "all"
                                ? "All bookings"
                                : `${filter[0].toUpperCase()}${filter.slice(1)} bookings`}
                        </h2>
                        <span className="admin-card-sub">
                            {visible.length} shown · click a row to expand contact details
                        </span>
                    </div>
                </div>
                <div className="admin-card-body admin-card-body-flush">
                    {visible.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty-icon">▤</div>
                            <h3>No {filter === "all" ? "" : filter + " "}bookings</h3>
                            <p>Bookings submitted via the site will appear here.</p>
                        </div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Ref</th>
                                        <th>Lead traveller</th>
                                        <th>Trek</th>
                                        <th>Departure</th>
                                        <th>Group</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th aria-label="Actions" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {visible.map((b) => (
                                        <BookingRow
                                            key={b.id}
                                            booking={b}
                                            expanded={expandedId === b.id}
                                            onToggle={() =>
                                                setExpandedId((cur) =>
                                                    cur === b.id ? null : b.id
                                                )
                                            }
                                            onStatusChange={(s) =>
                                                handleStatusChange(b.id, s)
                                            }
                                            onDelete={() => handleDelete(b)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function BookingRow({
    booking: b,
    expanded,
    onToggle,
    onStatusChange,
    onDelete,
}: {
    booking: BookingRecord;
    expanded: boolean;
    onToggle: () => void;
    onStatusChange: (status: BookingStatus) => void;
    onDelete: () => void;
}) {
    return (
        <>
            <tr
                onClick={onToggle}
                style={{ cursor: "pointer" }}
                aria-expanded={expanded}
            >
                <td className="admin-mono">{b.reference}</td>
                <td>
                    <b>{b.name}</b>
                </td>
                <td>
                    {b.trekName}
                    <div className="admin-mono" style={{ color: "var(--sub)" }}>
                        {b.days} days
                    </div>
                </td>
                <td className="admin-mono">{formatDeparture(b.departure)}</td>
                <td>
                    {b.groupSize} pax ·{" "}
                    {b.departureType === "fixed" ? "fixed" : "private"}
                </td>
                <td>{money.format(b.total)}</td>
                <td onClick={(e) => e.stopPropagation()}>
                    <select
                        value={b.status}
                        onChange={(e) =>
                            onStatusChange(e.target.value as BookingStatus)
                        }
                        aria-label={`Status for ${b.reference}`}
                        style={{
                            font: "inherit",
                            fontSize: 13,
                            border: "1px solid var(--hline)",
                            borderRadius: 8,
                            padding: "6px 8px",
                            background: "#fff",
                            color: "var(--ink)",
                            cursor: "pointer",
                        }}
                    >
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                    <div className="admin-row-actions">
                        <button
                            type="button"
                            className="admin-icon-btn danger"
                            aria-label={`Delete booking ${b.reference}`}
                            title="Delete booking"
                            onClick={onDelete}
                        >
                            ✕
                        </button>
                    </div>
                </td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan={8} style={{ background: "#fffdf9" }}>
                        <div className="admin-card-body">
                            <dl className="admin-detail-grid">
                                <div className="admin-detail-item">
                                    <dt>Email</dt>
                                    <dd>{b.email}</dd>
                                </div>
                                <div className="admin-detail-item">
                                    <dt>Phone / WhatsApp</dt>
                                    <dd>{b.phone}</dd>
                                </div>
                                <div className="admin-detail-item">
                                    <dt>Country</dt>
                                    <dd>{b.country}</dd>
                                </div>
                                <div className="admin-detail-item">
                                    <dt>Requested on</dt>
                                    <dd>{formatDate(b.createdAt)}</dd>
                                </div>
                            </dl>
                            <div className="admin-field" style={{ marginBottom: 8 }}>
                                <span>Notes</span>
                            </div>
                            <div className="admin-notes">
                                {b.notes.trim() || "No notes provided."}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
