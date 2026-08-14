"use client";

import { usePathname } from "next/navigation";

/**
 * Conditionally renders the public site chrome (header, footer, chat bot).
 * On /admin routes it renders nothing so the admin panel gets its own
 * full-height shell without the marketing site's chrome.
 */
export default function SiteChrome({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");
    if (isAdmin) return null;
    return <>{children}</>;
}
