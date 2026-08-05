"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { treks } from "@/data/treks";

/** Centered navbar search with a live trek-results dropdown. */
export default function SearchBar() {
    const router = useRouter();
    const boxRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return treks
            .filter((t) =>
                [t.name, t.regionLabel, t.grade, t.bestMonths, t.overview]
                    .join(" ")
                    .toLowerCase()
                    .includes(q)
            )
            .slice(0, 6);
    }, [query]);

    // Close the dropdown when clicking anywhere outside the component.
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    // Reset the highlighted row whenever the query changes.
    useEffect(() => {
        setActive(0);
    }, [query]);

    const go = (slug: string) => {
        setQuery("");
        setOpen(false);
        router.push(`/treks/${slug}`);
    };

    const submit = () => {
        const q = query.trim();
        if (results.length > 0) {
            go(results[active].slug);
        } else if (q) {
            setOpen(false);
            router.push(`/treks?search=${encodeURIComponent(q)}`);
        }
    };

    return (
        <div className="searchbar" ref={boxRef}>
            <div className="searchbar-inner">
                <svg
                    className="searchbar-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="search"
                    value={query}
                    placeholder="Search treks, regions…"
                    aria-label="Search treks"
                    autoComplete="off"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            submit();
                        } else if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setActive((a) =>
                                Math.min(a + 1, Math.max(results.length - 1, 0))
                            );
                        } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            setActive((a) => Math.max(a - 1, 0));
                        } else if (e.key === "Escape") {
                            setOpen(false);
                            (e.target as HTMLInputElement).blur();
                        }
                    }}
                />
            </div>

            {open && query.trim() && (
                <div
                    className="searchbar-results"
                    role="listbox"
                    aria-label="Trek search results"
                >
                    {results.length === 0 ? (
                        <div className="searchbar-empty">
                            No treks match <b>&ldquo;{query.trim()}&rdquo;</b>. Press Enter
                            to browse all treks.
                        </div>
                    ) : (
                        results.map((t, i) => (
                            <button
                                type="button"
                                key={t.slug}
                                role="option"
                                aria-selected={i === active}
                                className={i === active ? "active" : ""}
                                onMouseEnter={() => setActive(i)}
                                onClick={() => go(t.slug)}
                            >
                                <span className="sr-name">{t.name}</span>
                                <span className="sr-meta">
                                    {t.regionLabel} &middot; {t.days} days &middot;{" "}
                                    {t.grade}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
