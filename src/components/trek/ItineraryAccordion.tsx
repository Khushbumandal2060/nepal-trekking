/**
 * ItineraryAccordion — the interactive "Day-by-Day Itinerary" section.
 *
 * Renders the flat itinerary as a vertical timeline. Each day is a node on a
 * connected rail; clicking a day header expands that day and closes the
 * others. The first day is open by default. Fully keyboard accessible with the
 * same `aria-expanded` / `aria-controls` pattern used elsewhere in the site.
 */
"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/lib/types";

interface ItineraryAccordionProps {
    days: ItineraryDay[];
}

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            className={open ? "itin-chevron itin-chevron--open" : "itin-chevron"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

export default function ItineraryAccordion({ days }: ItineraryAccordionProps) {
    const [openDay, setOpenDay] = useState<number | null>(0);

    return (
        <div className="itin-timeline">
            {days.map((day, i) => {
                const isOpen = openDay === i;
                const panelId = `itin-panel-${i}`;
                return (
                    <div
                        key={`${day.t}-${i}`}
                        className={isOpen ? "itin-item is-open" : "itin-item"}
                    >
                        <h3 className="itin-heading">
                            <button
                                type="button"
                                className="itin-head"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpenDay(isOpen ? null : i)}
                            >
                                <span className="itin-rail-dot" aria-hidden="true" />
                                <span className="itin-day-num">
                                    Day {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="itin-day-title">{day.t}</span>
                                <span className="itin-day-meta">
                                    {day.alt && (
                                        <span className="itin-day-alt">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="m8 3-6 12h5l-2 6 11-14h-5l3-4z" />
                                            </svg>
                                            {day.alt}
                                        </span>
                                    )}
                                    {day.hrs && (
                                        <span className="itin-day-hrs">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <circle cx="12" cy="12" r="9" />
                                                <path d="M12 7v5l3 3" />
                                            </svg>
                                            {day.hrs}
                                        </span>
                                    )}
                                </span>
                                <Chevron open={isOpen} />
                            </button>
                        </h3>
                        <div
                            id={panelId}
                            role="region"
                            className="itin-body"
                            hidden={!isOpen}
                        >
                            <p>{day.d}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
