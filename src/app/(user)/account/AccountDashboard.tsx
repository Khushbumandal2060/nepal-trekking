"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { BookingRow } from "@/lib/bookings";
import styles from "./account.module.css";

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

export interface AccountUser {
    name: string;
    email: string;
    provider: string;
    memberSince: Date | string | null;
}

type Phase = "requested" | "confirmed" | "departing" | "completed" | "cancelled";

const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

function toDate(v: Date | string | null | undefined): Date | null {
    if (!v) return null;
    const d = typeof v === "string" ? new Date(v) : new Date(v.getTime());
    return Number.isNaN(d.getTime()) ? null : d;
}

function startOfToday(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function daysDiff(from: Date, to: Date): number {
    const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
    const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
    return Math.round((b - a) / 86_400_000);
}

function fmtDate(v: Date | string | null | undefined): string {
    const d = toDate(v);
    if (!d) return "—";
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function toDateInput(v: Date | string | null | undefined): string {
    if (!v) return "";
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
    const d = toDate(v);
    if (!d) return "";
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

function initials(name: string): string {
    return (name || "?").trim().charAt(0).toUpperCase();
}

function phaseOf(b: BookingRow): Phase {
    if (b.status === "cancelled") return "cancelled";
    const dep = toDate(b.departure);
    if (!dep) return b.status === "confirmed" ? "confirmed" : "requested";
    if (dep.getTime() < startOfToday()) return "completed";
    const diff = daysDiff(new Date(), dep);
    if (b.status === "confirmed" && diff <= 14) return "departing";
    return b.status === "confirmed" ? "confirmed" : "requested";
}

interface Countdown {
    text: string;
    cls: string;
}

function countdown(b: BookingRow): Countdown | null {
    const dep = toDate(b.departure);
    if (!dep) return null;
    const diff = daysDiff(new Date(), dep);
    if (diff < 0) return { text: "Trek completed", cls: "done" };
    if (diff === 0) return { text: "Departs today", cls: "soon" };
    if (diff === 1) return { text: "Departs tomorrow", cls: "soon" };
    return {
        text: `Starts in ${diff} days`,
        cls: diff <= 14 ? "soon" : "upcoming",
    };
}

const PHASE_LABEL: Record<Phase, string> = {
    requested: "Awaiting confirmation",
    confirmed: "Confirmed",
    departing: "Departing soon",
    completed: "Completed",
    cancelled: "Cancelled",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AccountDashboard({
    user,
    initialBookings,
}: {
    user: AccountUser;
    initialBookings: BookingRow[];
}) {
    const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<{
        departure: string;
        group_size: number;
        departure_type: string;
        notes: string;
    } | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeNav, setActiveNav] = useState("overview");

    /* Scroll-spy: highlight the section currently in view in the sidebar */
    useEffect(() => {
        const ids = ["overview", "my-treks", "profile"];
        const sections = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActiveNav(visible.target.id);
            },
            { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] }
        );
        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const stats = useMemo(() => {
        const active = bookings.filter((b) => {
            const p = phaseOf(b);
            return p !== "cancelled" && p !== "completed";
        });
        const next = [...active]
            .filter((b) => toDate(b.departure))
            .sort(
                (a, b) =>
                    (toDate(a.departure)?.getTime() ?? 0) -
                    (toDate(b.departure)?.getTime() ?? 0)
            )[0];
        const nextDays = next
            ? daysDiff(new Date(), toDate(next.departure) as Date)
            : null;
        const totalValue = bookings.reduce(
            (sum, b) => sum + Number(b.total ?? 0),
            0
        );

        return {
            upcoming: active.length,
            next,
            nextDays,
            total: bookings.length,
            value: totalValue,
        };
    }, [bookings]);

    function openEdit(b: BookingRow) {
        setError(null);
        setEditingId(b.id);
        setDraft({
            departure: toDateInput(b.departure),
            group_size: b.group_size,
            departure_type: b.departure_type === "private" ? "private" : "fixed",
            notes: b.notes ?? "",
        });
    }

    async function handleSaveEdit(id: string) {
        if (!draft) return;
        setBusyId(id);
        setError(null);
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group_size: draft.group_size,
                    departure: draft.departure || null,
                    departure_type: draft.departure_type,
                    notes: draft.notes,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error(data?.error ?? "Could not update your booking.");
            }
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? (data.booking as BookingRow) : b))
            );
            setEditingId(null);
            setDraft(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not update your booking."
            );
        } finally {
            setBusyId(null);
        }
    }

    async function handleCancel(b: BookingRow) {
        const ok = window.confirm(
            `Cancel booking ${b.reference} — “${b.trek_name}”?\n\nThis removes it from your account and releases your dates. You can always start a new booking afterwards.`
        );
        if (!ok) return;
        setBusyId(b.id);
        setError(null);
        try {
            const res = await fetch(`/api/bookings/${b.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error(data?.error ?? "Could not cancel your booking.");
            }
            setBookings((prev) => prev.filter((x) => x.id !== b.id));
            if (editingId === b.id) {
                setEditingId(null);
                setDraft(null);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not cancel your booking."
            );
        } finally {
            setBusyId(null);
        }
    }

    return (
        <div className={styles.dashboard}>
            {/* Error banner */}
            {error && (
                <div className={styles.errorBanner} role="alert">
                    <span aria-hidden="true">⚠</span> {error}
                </div>
            )}

            {/* Sidebar navigation + main content */}
            <div className={styles.dashboardLayout}>
                <aside className={styles.sidebar} aria-label="Dashboard menu">
                    <div className={styles.sidebarUser}>
                        <span className={styles.avatar} aria-hidden="true">
                            {initials(user.name)}
                        </span>
                        <div>
                            <p className={styles.profileName}>{user.name}</p>
                            <p className={styles.profileEmail}>{user.email}</p>
                        </div>
                    </div>

                    <nav className={styles.sidebarNav} aria-label="Account sections">
                        <p className={styles.sidebarLabel}>Menu</p>
                        <a
                            href="#overview"
                            className={[
                                styles.sidebarLink,
                                activeNav === "overview" ? styles.sidebarActive : "",
                            ].join(" ")}
                        >
                            <span className={styles.sidebarIcon} aria-hidden="true">◈</span>
                            Overview
                        </a>
                        <a
                            href="#my-treks"
                            className={[
                                styles.sidebarLink,
                                activeNav === "my-treks" ? styles.sidebarActive : "",
                            ].join(" ")}
                        >
                            <span className={styles.sidebarIcon} aria-hidden="true">🏔</span>
                            My treks
                            {stats.upcoming > 0 && (
                                <span className={styles.sidebarCount}>{stats.upcoming}</span>
                            )}
                        </a>
                        <a
                            href="#profile"
                            className={[
                                styles.sidebarLink,
                                activeNav === "profile" ? styles.sidebarActive : "",
                            ].join(" ")}
                        >
                            <span className={styles.sidebarIcon} aria-hidden="true">◉</span>
                            Profile
                        </a>
                    </nav>

                    <div className={styles.sidebarSection}>
                        <p className={styles.sidebarLabel}>Explore</p>
                        <Link href="/treks" className={styles.sidebarLink}>
                            <span className={styles.sidebarIcon} aria-hidden="true">🏕</span>
                            Browse treks
                        </Link>
                        <Link href="/book" className={styles.sidebarLink}>
                            <span className={styles.sidebarIcon} aria-hidden="true">✚</span>
                            New booking
                        </Link>
                    </div>

                    <button
                        type="button"
                        className={styles.sidebarSignout}
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <span aria-hidden="true">⎋</span> Sign out
                    </button>
                </aside>

                <div className={styles.dashboardMain}>
                    <section id="overview" className={styles.sectionAnchor}>
                        <div className={styles.sectionTitleRow}>
                            <div>
                                <p className={styles.sectionEyebrow}>Overview</p>
                                <h2 className={styles.sectionTitle}>
                                    Your adventure at a glance
                                </h2>
                            </div>
                        </div>

                        <div className={styles.statGrid} aria-label="Account summary">
                            <div className={styles.statCard}>
                                <span className={styles.statIcon} aria-hidden="true">
                                    🏔
                                </span>
                                <div>
                                    <span className={styles.statLabel}>Upcoming treks</span>
                                    <span className={styles.statValue}>{stats.upcoming}</span>
                                    <span className={styles.statHint}>
                                        {stats.upcoming > 0
                                            ? stats.upcoming === 1
                                                ? "adventure planned"
                                                : "adventures planned"
                                            : "no upcoming trips"}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <span className={styles.statIcon} aria-hidden="true">
                                    📅
                                </span>
                                <div>
                                    <span className={styles.statLabel}>Next departure</span>
                                    <span className={styles.statValue}>
                                        {stats.next ? fmtDate(stats.next.departure) : "—"}
                                    </span>
                                    <span className={styles.statHint}>
                                        {stats.nextDays === null
                                            ? "no dates set"
                                            : stats.nextDays === 0
                                                ? "departs today"
                                                : stats.nextDays === 1
                                                    ? "departs tomorrow"
                                                    : `in ${stats.nextDays} days`}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <span className={styles.statIcon} aria-hidden="true">
                                    🎒
                                </span>
                                <div>
                                    <span className={styles.statLabel}>Total bookings</span>
                                    <span className={styles.statValue}>{stats.total}</span>
                                    <span className={styles.statHint}>trips on your record</span>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <span className={styles.statIcon} aria-hidden="true">
                                    ✦
                                </span>
                                <div>
                                    <span className={styles.statLabel}>Adventure value</span>
                                    <span className={styles.statValue}>
                                        {stats.value > 0 ? money.format(stats.value) : "—"}
                                    </span>
                                    <span className={styles.statHint}>estimated trip value</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="my-treks" className={styles.sectionAnchor}>
                        <div className={styles.bookingsPanel}>
                            <div className={styles.panelHead}>
                                <div>
                                    <h2 className={styles.cardTitle}>My treks</h2>
                                    <p className={styles.panelSub}>
                                        Track your status, adjust dates or travellers, and
                                        manage your adventures.
                                    </p>
                                </div>
                                <Link href="/book" className={styles.newBookingBtn}>
                                    + New booking
                                </Link>
                            </div>

                            {bookings.length === 0 ? (
                                <div className={styles.empty}>
                                    <span className={styles.emptyIcon} aria-hidden="true">
                                        🏔
                                    </span>
                                    <h3>No treks yet — your adventure starts here</h3>
                                    <p>
                                        When you book a trek it will appear here with its
                                        reference, departure and live status so you can
                                        follow every step of the journey.
                                    </p>
                                    <Link href="/book" className={styles.emptyCta}>
                                        Plan your first trek
                                    </Link>
                                </div>
                            ) : (
                                <ul className={styles.bookingList}>
                                    {bookings.map((b) => (
                                        <li key={b.id}>
                                            <BookingCard
                                                booking={b}
                                                editing={editingId === b.id}
                                                draft={draft}
                                                busy={busyId === b.id}
                                                onEdit={() => openEdit(b)}
                                                onSave={() => handleSaveEdit(b.id)}
                                                onCancelEdit={() => {
                                                    setEditingId(null);
                                                    setDraft(null);
                                                    setError(null);
                                                }}
                                                onCancelBooking={() => handleCancel(b)}
                                                onDraftChange={setDraft}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    <section id="profile" className={styles.sectionAnchor}>
                        <div className={styles.sectionTitleRow}>
                            <div>
                                <p className={styles.sectionEyebrow}>Profile</p>
                                <h2 className={styles.sectionTitle}>Account details</h2>
                            </div>
                        </div>

                        <aside className={styles.card}>
                            <div className={styles.profileHead}>
                                <span className={styles.avatar} aria-hidden="true">
                                    {initials(user.name)}
                                </span>
                                <div>
                                    <p className={styles.profileName}>{user.name}</p>
                                    <p className={styles.profileEmail}>{user.email}</p>
                                </div>
                            </div>

                            <span className={styles.providerBadge}>
                                {user.provider === "google"
                                    ? "Signed in with Google"
                                    : "Email & password"}
                            </span>

                            <div className={styles.stats}>
                                <div className={styles.statRow}>
                                    <span>Member since</span>
                                    <span className={styles.statValue}>
                                        {fmtDate(user.memberSince)}
                                    </span>
                                </div>
                                <div className={styles.statRow}>
                                    <span>Upcoming</span>
                                    <span className={styles.statValue}>{stats.upcoming}</span>
                                </div>
                                <div className={styles.statRow}>
                                    <span>Completed</span>
                                    <span className={styles.statValue}>
                                        {bookings.filter((b) => phaseOf(b) === "completed").length}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.linkGrid}>
                                <Link href="/treks" className={styles.quickLink}>
                                    Browse treks
                                    <small>Find your next adventure</small>
                                </Link>
                                <Link href="/book" className={styles.quickLink}>
                                    Book a trek
                                    <small>Start a new booking</small>
                                </Link>
                            </div>
                        </aside>
                    </section>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Single booking card                                                */
/* ------------------------------------------------------------------ */

function BookingCard({
    booking: b,
    editing,
    draft,
    busy,
    onEdit,
    onSave,
    onCancelEdit,
    onCancelBooking,
    onDraftChange,
}: {
    booking: BookingRow;
    editing: boolean;
    draft: { departure: string; group_size: number; departure_type: string; notes: string } | null;
    busy: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancelEdit: () => void;
    onCancelBooking: () => void;
    onDraftChange: (d: {
        departure: string;
        group_size: number;
        departure_type: string;
        notes: string;
    }) => void;
}) {
    const phase = phaseOf(b);
    const cd = countdown(b);
    const isCancelled = phase === "cancelled";
    const isDone = phase === "completed";

    // 0 = Requested · 1 = Confirmed · 2 = Trek complete
    const activeStep = phase === "requested" ? 0 : phase === "confirmed" ? 1 : phase === "departing" ? 1 : 2;

    const steps = [
        { label: "Requested", sub: fmtDate(b.created_at) },
        {
            label: "Confirmed",
            sub: phase === "requested" ? "Awaiting team" : "Place secured",
        },
        {
            label: isDone ? "Trek complete" : "Trek",
            sub: isDone ? "Well done — see you soon!" : fmtDate(b.departure),
        },
    ];

    return (
        <article
            className={[
                styles.bookingCard,
                isCancelled ? styles.cancelledCard : "",
                isDone ? styles.completedCard : "",
            ].join(" ")}
        >
            <div className={styles.bookingTop}>
                <div className={styles.bookingRef}>
                    <span className={styles.refBadge}>{b.reference}</span>
                    <span className={styles.bookingType}>
                        {b.departure_type === "private" ? "Private" : "Fixed departure"}
                    </span>
                </div>
                {cd && !isCancelled && (
                    <span className={`${styles.countdown} ${styles[cd.cls]}`}>
                        {cd.text}
                    </span>
                )}
                {isCancelled && (
                    <span className={`${styles.countdown} ${styles.cancelled}`}>
                        Cancelled
                    </span>
                )}
            </div>

            <h3 className={styles.bookingName}>{b.trek_name}</h3>
            <p className={styles.bookingMeta}>
                {b.days} days · {b.group_size}{" "}
                {b.group_size === 1 ? "traveller" : "travellers"} ·{" "}
                {money.format(Number(b.total ?? 0))} estimated
            </p>

            {/* Status tracker */}
            {!isCancelled && (
                <div className={styles.tracker} aria-label={`Status: ${PHASE_LABEL[phase]}`}>
                    <div className={styles.trackerRow}>
                        <div
                            className={styles.trackerLine}
                            aria-hidden="true"
                            style={{ "--progress": `${(activeStep / 2) * 100}%` } as CSSProperties}
                        />
                        {steps.map((s, i) => {
                            const cls: string[] = [];
                            if (i < activeStep) cls.push("done");
                            else if (i === activeStep) {
                                cls.push("active");
                                if (phase === "departing" && i === 1) cls.push("soon");
                            }
                            return (
                                <div key={s.label} className={styles.trackerStep}>
                                    <span
                                        className={[
                                            styles.trackerDot,
                                            ...cls.map((c) => styles[c]).filter(Boolean),
                                        ].join(" ")}
                                    >
                                        {i < activeStep ? "✓" : i + 1}
                                    </span>
                                    <span className={styles.trackerLabel}>{s.label}</span>
                                    <span className={styles.trackerSub}>{s.sub}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {isCancelled && (
                <div className={styles.cancelledNote}>
                    This booking was cancelled. Dates and travellers have been
                    released — ready for a fresh start whenever you are.
                </div>
            )}

            {isDone && !isCancelled && (
                <div className={styles.doneNote}>
                    🎉 This trek has been completed. We hope the Himalaya was
                    everything you hoped for — and more.
                </div>
            )}

            {/* Inline edit form */}
            {editing && draft && (
                <div className={styles.editForm}>
                    <div className={styles.editGrid}>
                        <label className={styles.field}>
                            <span>Departure date</span>
                            <input
                                type="date"
                                value={draft.departure}
                                onChange={(e) =>
                                    onDraftChange({ ...draft, departure: e.target.value })
                                }
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Travellers</span>
                            <input
                                type="number"
                                min={1}
                                max={16}
                                value={draft.group_size}
                                onChange={(e) =>
                                    onDraftChange({
                                        ...draft,
                                        group_size: Number(e.target.value),
                                    })
                                }
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Departure type</span>
                            <select
                                value={draft.departure_type}
                                onChange={(e) =>
                                    onDraftChange({
                                        ...draft,
                                        departure_type: e.target.value,
                                    })
                                }
                            >
                                <option value="fixed">Fixed departure</option>
                                <option value="private">Private departure</option>
                            </select>
                        </label>
                        <label className={styles.fieldFull}>
                            <span>Notes for the team</span>
                            <textarea
                                rows={3}
                                value={draft.notes}
                                onChange={(e) =>
                                    onDraftChange({ ...draft, notes: e.target.value })
                                }
                                placeholder="Fitness level, dietary needs, questions…"
                            />
                        </label>
                    </div>
                    <div className={styles.editActions}>
                        <button
                            type="button"
                            className={styles.btnGhost}
                            onClick={onCancelEdit}
                            disabled={busy}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={styles.btnSave}
                            onClick={onSave}
                            disabled={busy}
                        >
                            {busy ? "Saving…" : "Save changes"}
                        </button>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className={styles.bookingActions}>
                {!editing && !isCancelled && (
                    <button type="button" className={styles.btnGhost} onClick={onEdit}>
                        ✎ Edit booking
                    </button>
                )}
                {!isCancelled && (
                    <button
                        type="button"
                        className={styles.btnCancel}
                        onClick={onCancelBooking}
                        disabled={busy}
                    >
                        {busy ? "Working…" : "Cancel booking"}
                    </button>
                )}
                {isCancelled && (
                    <Link href="/book" className={styles.btnGhost}>
                        Re-book a trek
                    </Link>
                )}
            </div>
        </article>
    );
}
