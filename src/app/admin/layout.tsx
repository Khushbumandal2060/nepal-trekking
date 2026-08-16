import type { Metadata } from "next";
import AdminShell from "@/admin/AdminShell";
import "@/admin/admin.css";

/** Admin is a private tool — never index it. robots.txt already disallows
 * /admin, but self-declaring noindex here is defense-in-depth so the pages
 * never appear in search results even if linked elsewhere. */
export const metadata: Metadata = {
    title: "Admin — Trekking Nepal",
    robots: { index: false, follow: false },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminShell>{children}</AdminShell>;
}
