"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** A single clickable filter option rendered inside an accordion group. */
export interface SidebarOption {
    value: string;
    label: string;
    count: number;
    href: string;
    active: boolean;
}

/** A collapsible sidebar section (e.g. "Trek by Duration") with its options. */
export interface SidebarGroup {
    id: string;
    label: string;
    options: SidebarOption[];
}

interface TreksSidebarProps {
    groups: SidebarGroup[];
    monthOptions: SidebarOption[];
    activeMonth: string;
    monthResetHref: string;
}

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`sidebar-chevron ${open ? "open" : ""}`}
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

const CALENDAR_ICON = (
    <svg
        className="sidebar-date-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
);

const FILTER_ICON = (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
);

export default function TreksSidebar({
    groups,
    monthOptions,
    activeMonth,
    monthResetHref,
}: TreksSidebarProps) {
    const router = useRouter();
    const [openGroup, setOpenGroup] = useState<string | null>("Trek by Region");
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggle = (label: string) =>
        setOpenGroup((current) => (current === label ? null : label));

    const closeMobile = () => setMobileOpen(false);

    const goToMonth = (value: string) => {
        closeMobile();
        if (value === "") {
            router.push(monthResetHref, { scroll: false });
            return;
        }
        const opt = monthOptions.find((o) => o.value === value);
        if (opt) router.push(opt.href, { scroll: false });
    };

    // When landing with a filter already applied (e.g. /treks?duration=short),
    // expand the accordion group holding the active option so the selection is
    // visible immediately. Manual open/close toggles are never overridden here
    // because they don't trigger a navigation (groups prop stays the same).
    useEffect(() => {
        const active = groups.find((g) => g.options.some((o) => o.active));
        if (active) setOpenGroup(active.label);
    }, [groups]);

    return (
        <>
            <button
                type="button"
                className="sidebar-mobile-trigger"
                aria-expanded={mobileOpen}
                aria-controls="treks-sidebar"
                onClick={() => setMobileOpen((v) => !v)}
            >
                {FILTER_ICON}
                Filters
            </button>

            <div
                className={`sidebar-backdrop ${mobileOpen ? "sidebar--open" : ""}`}
                aria-hidden="true"
                onClick={closeMobile}
            />

            <aside
                id="treks-sidebar"
                className={`treks-sidebar ${mobileOpen ? "sidebar--open" : ""}`}
            >
                <div className="sidebar-header-gradient">
                    <h3>
                        <span className="sidebar-header-star" aria-hidden="true">
                            &#9733;
                        </span>
                        Filter Treks
                    </h3>
                    <p>Find your perfect adventure</p>
                </div>

                <div className="sidebar-body">
                    <div className="sidebar-date-wrap">
                        <select
                            className="sidebar-date-input"
                            aria-label="Filter by month"
                            value={activeMonth === "all" ? "" : activeMonth}
                            onChange={(e) => goToMonth(e.target.value)}
                        >
                            <option value="">All months</option>
                            {monthOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        {CALENDAR_ICON}
                    </div>

                    <Link
                        href="/treks"
                        className="sidebar-view-all-btn"
                        onClick={closeMobile}
                    >
                        View All Treks
                    </Link>

                    {groups.map((group) => (
                        <div className="sidebar-accordion-item" key={group.id}>
                            <button
                                type="button"
                                className="sidebar-accordion-btn"
                                aria-expanded={openGroup === group.label}
                                onClick={() => toggle(group.label)}
                            >
                                <span>{group.label}</span>
                                <Chevron open={openGroup === group.label} />
                            </button>
                            {openGroup === group.label && group.options.length > 0 && (
                                <nav
                                    className="sidebar-region-list"
                                    aria-label={`Filter by ${group.id}`}
                                >
                                    {group.options.map((opt) => (
                                        <Link
                                            key={opt.value}
                                            href={opt.href}
                                            scroll={false}
                                            onClick={closeMobile}
                                            className={`sidebar-region-link ${opt.active
                                                ? "sidebar-region-active"
                                                : ""
                                                }`}
                                        >
                                            <span>{opt.label}</span>
                                            <span
                                                className={`sidebar-region-count ${opt.active
                                                    ? "sidebar-region-count-active"
                                                    : ""
                                                    }`}
                                            >
                                                {opt.count}
                                            </span>
                                        </Link>
                                    ))}
                                </nav>
                            )}
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
}
