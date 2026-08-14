"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    adminHeaders,
    deleteTrek,
    loadCustomTreks,
    loadTreks,
} from "@/admin/admin-store";
import type { Trek } from "@/lib/types";

export default function TreksScreen() {
    const [treks, setTreks] = useState<Trek[] | null>(null);
    const [flash, setFlash] = useState<string | null>(null);

    useEffect(() => {
        setTreks(loadTreks());

        // Self-healing sync: push any localStorage-only treks (created before
        // the DB sync existed, or a save that failed silently) to the database
        // so they also appear on the public /treks page.
        (async () => {
            const pending = loadCustomTreks();
            for (const trek of pending) {
                try {
                    await fetch("/api/admin/treks", {
                        method: "POST",
                        headers: {
                            ...adminHeaders(),
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ trek }),
                    });
                } catch {
                    /* offline / non-fatal */
                }
            }
        })();
    }, []);

    async function handleDelete(trek: Trek) {
        const confirmed = window.confirm(
            `Delete "${trek.name}"? This hides it from the live site.`
        );
        if (!confirmed) return;
        deleteTrek(trek.slug);
        setTreks(loadTreks());
        setFlash(`“${trek.name}” has been removed from the live site.`);
        window.setTimeout(() => setFlash(null), 4000);

        // Remove the DB row so it also disappears from the public /treks page.
        try {
            await fetch("/api/admin/treks", {
                method: "DELETE",
                headers: {
                    ...adminHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ slug: trek.slug }),
            });
        } catch {
            /* offline / non-fatal */
        }
    }

    if (!treks) {
        return <p className="admin-empty">Loading treks…</p>;
    }

    const byRegion = treks.reduce<Record<string, number>>((acc, t) => {
        acc[t.regionLabel] = (acc[t.regionLabel] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <>
            <div className="admin-topbar">
                <div>
                    <h1>Treks</h1>
                    <p>
                        {treks.length} treks live across{" "}
                        {Object.keys(byRegion).length} regions. Edit any trek to
                        change its page — edits are saved in your browser.
                    </p>
                </div>
                <div className="admin-topbar-actions">
                    <Link
                        href="/admin/treks/new"
                        className="admin-btn admin-btn-primary"
                    >
                        + Add trek
                    </Link>
                </div>
            </div>

            {flash && (
                <div className="admin-flash" role="status">
                    ✓ {flash}
                </div>
            )}

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>All treks</h2>
                        <span className="admin-card-sub">
                            Sorted alphabetically
                        </span>
                    </div>
                </div>
                <div className="admin-card-body admin-card-body-flush">
                    {treks.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty-icon">⛰</div>
                            <h3>No treks yet</h3>
                            <p>Create your first trek to get started.</p>
                        </div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Trek</th>
                                        <th>Region</th>
                                        <th>Days</th>
                                        <th>Grade</th>
                                        <th>Max altitude</th>
                                        <th>Price (pp)</th>
                                        <th aria-label="Actions" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {treks.map((t) => (
                                        <tr key={t.slug}>
                                            <td>
                                                <div className="admin-trek-cell">
                                                    <Image
                                                        className="admin-trek-thumb"
                                                        src={t.image}
                                                        alt=""
                                                        width={54}
                                                        height={40}
                                                        loading="lazy"
                                                    />
                                                    <div>
                                                        <div className="admin-trek-name">
                                                            {t.name}
                                                        </div>
                                                        <div className="admin-mono" style={{ color: "var(--sub)" }}>
                                                            /treks/{t.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{t.regionLabel}</td>
                                            <td>{t.days}</td>
                                            <td>{t.grade}</td>
                                            <td className="admin-mono">
                                                {t.altitude}
                                            </td>
                                            <td>{t.price}</td>
                                            <td>
                                                <div className="admin-row-actions">
                                                    <Link
                                                        href={`/admin/treks/${t.slug}`}
                                                        className="admin-btn admin-btn-ghost admin-btn-sm"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="admin-btn admin-btn-danger admin-btn-sm"
                                                        onClick={() => handleDelete(t)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
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
