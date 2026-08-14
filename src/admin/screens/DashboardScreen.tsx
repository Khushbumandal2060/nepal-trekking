"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    getSession,
    loadBookings,
    loadBlogPosts,
    loadEnquiries,
    loadTreks,
    type BookingRecord,
    type EnquiryMessage,
} from "@/admin/admin-store";

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

export default function DashboardScreen() {
    const [data, setData] = useState<{
        treks: number;
        blog: number;
        bookings: BookingRecord[];
        enquiries: EnquiryMessage[];
    } | null>(null);

    useEffect(() => {
        setData({
            treks: loadTreks().length,
            blog: loadBlogPosts().length,
            bookings: loadBookings(),
            enquiries: loadEnquiries(),
        });
    }, []);

    if (!data) {
        return <p className="admin-empty">Loading dashboard…</p>;
    }

    const session = getSession();
    const newBookings = data.bookings.filter((b) => b.status === "new").length;
    const newEnquiries = data.enquiries.filter((m) => m.status === "new").length;
    const confirmedRevenue = data.bookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum, b) => sum + b.total, 0);

    const recentBookings = [...data.bookings]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 6);
    const recentEnquiries = [...data.enquiries]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 6);

    const firstName = (session?.name ?? "Admin").split(" ")[0];

    return (
        <>
            <div className="admin-topbar">
                <div>
                    <h1>Welcome back, {firstName}</h1>
                    <p>
                        This is the Trekking Nepal admin panel. Manage your treks,
                        blog, bookings and enquiries from here. Changes are saved to
                        your browser.
                    </p>
                </div>
                <div className="admin-topbar-actions">
                    <Link href="/admin/treks/new" className="admin-btn admin-btn-primary">
                        + Add trek
                    </Link>
                    <Link href="/" className="admin-btn admin-btn-ghost">
                        View public site
                    </Link>
                </div>
            </div>

            <div className="admin-stats">
                <div className="admin-stat">
                    <span className="admin-stat-label">Live treks</span>
                    <span className="admin-stat-value">{data.treks}</span>
                    <span className="admin-stat-note">
                        across all regions ·{" "}
                        <Link href="/admin/treks">manage →</Link>
                    </span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Blog posts</span>
                    <span className="admin-stat-value">{data.blog}</span>
                    <span className="admin-stat-note">
                        latest guides & stories ·{" "}
                        <Link href="/admin/blog">manage →</Link>
                    </span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Bookings</span>
                    <span className="admin-stat-value">{data.bookings.length}</span>
                    <span className="admin-stat-note">
                        <b>{newBookings}</b> new awaiting review ·{" "}
                        <Link href="/admin/bookings">manage →</Link>
                    </span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Enquiries</span>
                    <span className="admin-stat-value">{data.enquiries.length}</span>
                    <span className="admin-stat-note">
                        <b className="warn">{newEnquiries}</b> unread ·{" "}
                        <Link href="/admin/messages">manage →</Link>
                    </span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Confirmed revenue</span>
                    <span className="admin-stat-value">
                        {money.format(confirmedRevenue)}
                    </span>
                    <span className="admin-stat-note">
                        from confirmed bookings on file
                    </span>
                </div>
            </div>

            <div style={{ display: "grid", gap: 26, gridTemplateColumns: "minmax(0,1fr)" }}>
                <section className="admin-card">
                    <div className="admin-card-head">
                        <div>
                            <h2>Recent bookings</h2>
                            <span className="admin-card-sub">
                                Most recent requests from the booking form
                            </span>
                        </div>
                        <Link href="/admin/bookings" className="admin-btn admin-btn-ghost admin-btn-sm">
                            View all bookings
                        </Link>
                    </div>
                    {recentBookings.length === 0 ? (
                        <div className="admin-empty">
                            <p>No bookings yet.</p>
                        </div>
                    ) : (
                        <div className="admin-card-body admin-card-body-flush">
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Ref</th>
                                            <th>Lead traveller</th>
                                            <th>Trek</th>
                                            <th>Departure</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map((b) => (
                                            <tr key={b.id}>
                                                <td className="admin-mono">{b.reference}</td>
                                                <td>
                                                    <b>{b.name}</b>
                                                </td>
                                                <td>{b.trekName}</td>
                                                <td className="admin-mono">
                                                    {formatDeparture(b.departure)}
                                                </td>
                                                <td>{money.format(b.total)}</td>
                                                <td>
                                                    <span
                                                        className={
                                                            "admin-pill " +
                                                            (b.status === "new"
                                                                ? "admin-pill-new"
                                                                : b.status === "confirmed"
                                                                    ? "admin-pill-confirmed"
                                                                    : "admin-pill-cancelled")
                                                        }
                                                    >
                                                        <span className="admin-pill-dot" />
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>

                <section className="admin-card">
                    <div className="admin-card-head">
                        <div>
                            <h2>Recent enquiries</h2>
                            <span className="admin-card-sub">
                                Messages sent through the contact form
                            </span>
                        </div>
                        <Link href="/admin/messages" className="admin-btn admin-btn-ghost admin-btn-sm">
                            View all enquiries
                        </Link>
                    </div>
                    {recentEnquiries.length === 0 ? (
                        <div className="admin-empty">
                            <p>No enquiries yet.</p>
                        </div>
                    ) : (
                        <div className="admin-card-body admin-card-body-flush">
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Ref</th>
                                            <th>Name</th>
                                            <th>About</th>
                                            <th>Received</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentEnquiries.map((m) => (
                                            <tr key={m.id}>
                                                <td className="admin-mono">{m.reference}</td>
                                                <td>
                                                    <b>{m.name}</b>
                                                </td>
                                                <td>{m.trek}</td>
                                                <td className="admin-mono">
                                                    {formatDate(m.createdAt)}
                                                </td>
                                                <td>
                                                    <span
                                                        className={
                                                            "admin-pill " +
                                                            (m.status === "new"
                                                                ? "admin-pill-new"
                                                                : "admin-pill-read")
                                                        }
                                                    >
                                                        <span className="admin-pill-dot" />
                                                        {m.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
