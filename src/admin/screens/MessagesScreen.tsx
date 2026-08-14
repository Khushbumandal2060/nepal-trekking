"use client";

import { useEffect, useState } from "react";
import {
    deleteEnquiry,
    loadEnquiries,
    markEnquiryRead,
    type EnquiryMessage,
} from "@/admin/admin-store";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

type Filter = "all" | "new" | "read";

const FILTERS: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "new", label: "Unread" },
    { value: "read", label: "Read" },
];

export default function MessagesScreen() {
    const [messages, setMessages] = useState<EnquiryMessage[] | null>(null);
    const [filter, setFilter] = useState<Filter>("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        setMessages(loadEnquiries());
    }, []);

    if (!messages) {
        return <p className="admin-empty">Loading enquiries…</p>;
    }

    const visible =
        filter === "all"
            ? messages
            : messages.filter((m) => m.status === filter);

    const unread = messages.filter((m) => m.status === "new").length;

    function handleOpen(m: EnquiryMessage) {
        setExpandedId((cur) => (cur === m.id ? null : m.id));
        if (m.status === "new") {
            setMessages(markEnquiryRead(m.id));
        }
    }

    function handleDelete(m: EnquiryMessage) {
        const confirmed = window.confirm(
            `Delete enquiry ${m.reference} from ${m.name}?`
        );
        if (!confirmed) return;
        setMessages(deleteEnquiry(m.id));
        if (expandedId === m.id) setExpandedId(null);
    }

    return (
        <>
            <div className="admin-topbar">
                <div>
                    <h1>Enquiries</h1>
                    <p>
                        Messages received through the contact form. Opening an
                        enquiry marks it as read.
                    </p>
                </div>
            </div>

            <div className="admin-stats">
                <div className="admin-stat">
                    <span className="admin-stat-label">Total messages</span>
                    <span className="admin-stat-value">{messages.length}</span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Unread</span>
                    <span className="admin-stat-value">{unread}</span>
                    <span className="admin-stat-note">
                        needing your attention
                    </span>
                </div>
                <div className="admin-stat">
                    <span className="admin-stat-label">Read</span>
                    <span className="admin-stat-value">
                        {messages.length - unread}
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
                        {f.value !== "all"
                            ? ` · ${messages.filter((m) => m.status === f.value).length
                            }`
                            : ""}
                    </button>
                ))}
            </div>

            <div className="admin-card">
                <div className="admin-card-head">
                    <div>
                        <h2>
                            {filter === "all"
                                ? "All enquiries"
                                : filter === "new"
                                    ? "Unread enquiries"
                                    : "Read enquiries"}
                        </h2>
                        <span className="admin-card-sub">
                            {visible.length} shown · click a message to read it
                        </span>
                    </div>
                </div>
                <div className="admin-card-body admin-card-body-flush">
                    {visible.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty-icon">✉</div>
                            <h3>No messages here</h3>
                            <p>Contact-form submissions will appear in this list.</p>
                        </div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Ref</th>
                                        <th>From</th>
                                        <th>Interested in</th>
                                        <th>Dates</th>
                                        <th>Received</th>
                                        <th>Status</th>
                                        <th aria-label="Actions" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {visible.map((m) => (
                                        <MessageRow
                                            key={m.id}
                                            message={m}
                                            expanded={expandedId === m.id}
                                            onToggle={() => handleOpen(m)}
                                            onDelete={() => handleDelete(m)}
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

function MessageRow({
    message: m,
    expanded,
    onToggle,
    onDelete,
}: {
    message: EnquiryMessage;
    expanded: boolean;
    onToggle: () => void;
    onDelete: () => void;
}) {
    return (
        <>
            <tr
                onClick={onToggle}
                style={{ cursor: "pointer" }}
                aria-expanded={expanded}
            >
                <td className="admin-mono">{m.reference}</td>
                <td>
                    <b>{m.name}</b>
                    <div className="admin-mono" style={{ color: "var(--sub)" }}>
                        {m.email}
                    </div>
                </td>
                <td>{m.trek}</td>
                <td className="admin-mono">{m.dates || "—"}</td>
                <td className="admin-mono">{formatDate(m.createdAt)}</td>
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
                        {m.status === "new" ? "unread" : "read"}
                    </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                    <div className="admin-row-actions">
                        <button
                            type="button"
                            className="admin-icon-btn danger"
                            aria-label={`Delete enquiry ${m.reference}`}
                            title="Delete enquiry"
                            onClick={onDelete}
                        >
                            ✕
                        </button>
                    </div>
                </td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan={7} style={{ background: "#fffdf9" }}>
                        <div className="admin-card-body">
                            <dl className="admin-detail-grid">
                                <div className="admin-detail-item">
                                    <dt>Name</dt>
                                    <dd>{m.name}</dd>
                                </div>
                                <div className="admin-detail-item">
                                    <dt>Email</dt>
                                    <dd>{m.email}</dd>
                                </div>
                                <div className="admin-detail-item">
                                    <dt>Interested in</dt>
                                    <dd>{m.trek}</dd>
                                </div>
                                <div className="admin-detail-item">
                                    <dt>Preferred dates</dt>
                                    <dd>{m.dates || "—"}</dd>
                                </div>
                            </dl>
                            <div className="admin-field" style={{ marginBottom: 8 }}>
                                <span>Message</span>
                            </div>
                            <div className="admin-notes">
                                {m.message.trim() || "No message body."}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
