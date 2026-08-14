"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    getSession,
    loadBookings,
    loadEnquiries,
    setSession,
} from "@/admin/admin-store";

/* Small inline icon set so the sidebar doesn't depend on an icon library. */
function Icon({ d, extra }: { d: string; extra?: React.ReactNode }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={d} />
            {extra}
        </svg>
    );
}

const NAV = [
    {
        href: "/admin",
        label: "Dashboard",
        icon: <Icon d="M3 11l9-8 9 8" extra={<path d="M5 10v10h14V10" />} />,
    },
    {
        href: "/admin/treks",
        label: "Treks",
        icon: (
            <Icon
                d="M8 3l4 6 4-6M6 21l3-8M18 21l-3-8M3 21h18M12 9v6"
            />
        ),
    },
    {
        href: "/admin/blog",
        label: "Blog",
        icon: (
            <Icon
                d="M6 3h12v18H6z"
                extra={<path d="M9 8h6M9 12h6M9 16h4" />}
            />
        ),
    },
    {
        href: "/admin/bookings",
        label: "Bookings",
        icon: (
            <Icon
                d="M4 5h16v16H4zM4 9h16M8 3v4M16 3v4"
            />
        ),
    },
    {
        href: "/admin/messages",
        label: "Enquiries",
        icon: (
            <Icon
                d="M4 6h16v12H4z"
                extra={<path d="M4 7l8 6 8-6" />}
            />
        ),
    },
];

export default function AdminShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (isLoginPage) {
            // Already signed in? Send them straight to the dashboard.
            if (getSession()) router.replace("/admin");
        } else if (!getSession()) {
            router.replace("/admin/login");
        }
        setReady(true);
    }, [pathname, isLoginPage, router]);

    if (!ready) return null;

    // The login page gets its own standalone layout (no sidebar).
    if (isLoginPage) return <>{children}</>;

    if (!getSession()) return null; // redirecting to /admin/login

    const session = getSession();
    const bookings = loadBookings();
    const enquiries = loadEnquiries();
    const unreadBookings = bookings.filter((b) => b.status === "new").length;
    const unreadEnquiries = enquiries.filter((m) => m.status === "new").length;

    function handleLogout() {
        setSession(null);
        router.replace("/admin/login");
    }

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <Link href="/admin" className="admin-brand">
                    <span className="admin-brand-mark" aria-hidden="true">
                        ⛰
                    </span>
                    <span>
                        <span className="admin-brand-text">
                            Trekking <b>Nepal</b>
                        </span>
                        <span className="admin-brand-sub">Admin Panel</span>
                    </span>
                </Link>

                <nav className="admin-nav" aria-label="Admin navigation">
                    {NAV.map((item) => {
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);
                        let count: number | null = null;
                        if (item.href === "/admin/bookings")
                            count = unreadBookings;
                        if (item.href === "/admin/messages")
                            count = unreadEnquiries;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={
                                    "admin-nav-link" +
                                    (isActive ? " active" : "")
                                }
                            >
                                <span className="admin-nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                                {count != null && count > 0 && (
                                    <span className="admin-nav-count">{count}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar-foot">
                    <p className="admin-session">
                        Signed in as
                        <br />
                        <b>{session?.email ?? "admin"}</b>
                    </p>
                    <Link className="admin-logout" href="/">
                        View public site ↗
                    </Link>
                    <button
                        type="button"
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>
            </aside>

            <div className="admin-main">{children}</div>
        </div>
    );
}
