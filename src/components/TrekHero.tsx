"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Trek } from "@/lib/types";

interface TrekHeroProps {
    trek: Trek;
    /** Optional YouTube ID — shows a "watch the trail" play button. */
    video?: string | null;
}

/** "17,600 ft / 5,364 m" → "17,600 ft" */
function elevationText(altitude: string): string {
    return altitude.split("/")[0].trim();
}

/**
 * Editorial hero for trek detail pages.
 *
 * Full-bleed photography with a cinematic scrim, a breadcrumb trail, the trek
 * name and a floating glass stats bar that bridges the hero into the content
 * below. The photo itself opens in a full-screen lightbox on click.
 */
export default function TrekHero({ trek, video }: TrekHeroProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    // Close on Escape and lock body scroll while the lightbox is open.
    useEffect(() => {
        if (!lightboxOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeLightbox();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [lightboxOpen, closeLightbox]);

    return (
        <>
            <section className="trek-hero">
                {/* The photo itself — click to open in full screen */}
                <button
                    type="button"
                    className="trek-hero-bg"
                    onClick={() => setLightboxOpen(true)}
                    aria-label={`View the ${trek.name} photo full screen`}
                >
                    <Image
                        src={trek.image}
                        alt={`${trek.name} in the Nepal Himalaya`}
                        fill
                        priority
                        quality={95}
                        sizes="100vw"
                    />
                </button>

                <div className="wrap trek-hero-content">
                    <nav className="trek-hero-crumbs" aria-label="Breadcrumb">
                        <Link href="/">Home</Link>
                        <span aria-hidden="true">/</span>
                        <Link href="/treks">Treks</Link>
                        <span aria-hidden="true">/</span>
                        <span className="is-current">{trek.name}</span>
                    </nav>

                    <span className="trek-hero-tag">{trek.regionLabel}</span>

                    <h1>{trek.name}</h1>

                    <p className="lede">{trek.overview}</p>

                    <div className="trek-hero-actions">
                        {video && (
                            <a href="#video" className="trek-hero-play">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M8 5.14v13.72c0 .9.98 1.45 1.75.98l11.02-6.86a1.14 1.14 0 0 0 0-1.96L9.75 4.16A1.14 1.14 0 0 0 8 5.14z" />
                                </svg>
                                Watch the trail
                            </a>
                        )}
                        <span className="trek-hero-price">
                            <span className="lbl">From</span>
                            <strong>{trek.price}</strong>
                            <span className="per">per person</span>
                        </span>
                    </div>
                </div>

                {/* Floating quick-stats bar */}
                <div className="wrap trek-hero-stats">
                    <div>
                        <span className="lbl">Duration</span>
                        <span className="val">{trek.days} Days</span>
                    </div>
                    <div>
                        <span className="lbl">Grade</span>
                        <span className="val">{trek.grade}</span>
                    </div>
                    <div>
                        <span className="lbl">Max Altitude</span>
                        <span className="val">{elevationText(trek.altitude)}</span>
                    </div>
                    <div>
                        <span className="lbl">Start</span>
                        <span className="val">{trek.startPoint}</span>
                    </div>
                </div>

                <span className="trek-hero-hint">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M15 3h6v6" />
                        <path d="M9 21H3v-6" />
                        <path d="M21 3l-7 7" />
                        <path d="M3 21l7-7" />
                    </svg>
                    View photo
                </span>
            </section>

            {lightboxOpen && (
                <div
                    className="lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${trek.name} photo`}
                    onClick={closeLightbox}
                >
                    <figure
                        className="lightbox-figure"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={trek.image}
                            alt={`${trek.name} in the Nepal Himalaya`}
                            fill
                            quality={95}
                            sizes="100vw"
                        />
                    </figure>
                    <button
                        type="button"
                        className="lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close photo"
                    >
                        ×
                    </button>
                </div>
            )}
        </>
    );
}
