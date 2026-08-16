/**
 * TrekSubNav — sticky in-page navigation for the trek detail page.
 *
 * A horizontal rail of jump-links that stays pinned under the site header
 * while the visitor scrolls. It highlights the section currently in view
 * (scroll-spy) so a long page always shows where you are. Fully client-side
 * and keyboard accessible (native <a> anchors).
 */
"use client";

import { useEffect, useState } from "react";

export interface TrekSubNavLink {
    id: string;
    label: string;
}

interface TrekSubNavProps {
    links: TrekSubNavLink[];
}

/** Sections are considered "in view" once their top passes this offset. */
const ACTIVE_OFFSET = 150;

export default function TrekSubNav({ links }: TrekSubNavProps) {
    const [active, setActive] = useState<string>(links[0]?.id ?? "");
    const [stuck, setStuck] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setStuck(window.scrollY > 12);

            let current = links[0]?.id ?? "";
            for (const link of links) {
                const el = document.getElementById(link.id);
                if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
                    current = link.id;
                }
            }
            setActive(current);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [links]);

    return (
        <nav
            className={stuck ? "trek-subnav is-stuck" : "trek-subnav"}
            aria-label="Trek page sections"
        >
            <div className="wrap trek-subnav-inner">
                {links.map((link) => (
                    <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={
                            active === link.id
                                ? "trek-subnav-link is-active"
                                : "trek-subnav-link"
                        }
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    );
}
