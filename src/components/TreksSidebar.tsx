"use client";

import { useState } from "react";
import Link from "next/link";
import type { Region } from "@/lib/types";

interface RegionOption {
    value: Region | "all";
    label: string;
    count: number;
    href: string;
}

interface TreksSidebarProps {
    regions: RegionOption[];
    activeRegion: Region | "all";
}

/** Categories shown as collapsible groups, matching the reference site's sidebar. */
const ACCORDION_ITEMS = [
    "Trek by Duration",
    "Trek by Months",
    "Trek by Country",
    "Trek by Region",
    "Trek by Themes",
    "Trek by Season",
    "Trek by Interests",
    "Trek by Distance",
];

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

export default function TreksSidebar({ regions, activeRegion }: TreksSidebarProps) {
    const [openGroup, setOpenGroup] = useState<string | null>("Trek by Region");

    const toggle = (label: string) =>
        setOpenGroup((current) => (current === label ? null : label));

    return (
        <aside className="treks-sidebar">
            <div className="sidebar-header-gradient">
                <h3>&#9733; Filter Treks</h3>
                <p>Find your perfect adventure</p>
            </div>

            <div className="sidebar-body">
                <div className="sidebar-date-wrap">
                    <input
                        type="text"
                        className="sidebar-date-input"
                        placeholder="Select Date Range"
                        readOnly
                        aria-label="Select date range"
                    />
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
                </div>

                <Link href="/treks" className="sidebar-view-all-btn">
                    View All Treks
                </Link>

                {ACCORDION_ITEMS.map((label) => (
                    <div className="sidebar-accordion-item" key={label}>
                        <button
                            type="button"
                            className="sidebar-accordion-btn"
                            aria-expanded={openGroup === label}
                            onClick={() => toggle(label)}
                        >
                            <span>{label}</span>
                            <Chevron open={openGroup === label} />
                        </button>
                        {openGroup === label && label === "Trek by Region" && (
                            <nav className="sidebar-region-list" aria-label="Filter by region">
                                {regions.map((r) => (
                                    <Link
                                        key={r.value}
                                        href={r.href}
                                        scroll={false}
                                        className={`sidebar-region-link ${activeRegion === r.value ? "sidebar-region-active" : ""
                                            }`}
                                    >
                                        <span>{r.label}</span>
                                        <span
                                            className={`sidebar-region-count ${activeRegion === r.value
                                                    ? "sidebar-region-count-active"
                                                    : ""
                                                }`}
                                        >
                                            {r.count}
                                        </span>
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
}
