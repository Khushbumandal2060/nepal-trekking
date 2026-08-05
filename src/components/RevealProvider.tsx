"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-reveal orchestrator.
 *
 * Scans the DOM for any element carrying the `.reveal` class that has not yet
 * been shown and reveals it (by adding `.is-visible`) as it scrolls into the
 * viewport. Re-scans whenever the route changes so freshly mounted pages get
 * their own reveal pass. Renders nothing.
 */
export default function RevealProvider() {
    const pathname = usePathname();

    useEffect(() => {
        const targets = Array.from(
            document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        );

        // Graceful fallback for very old browsers without IntersectionObserver.
        if (typeof IntersectionObserver === "undefined") {
            targets.forEach((el) => el.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
        );

        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [pathname]);

    return null;
}
