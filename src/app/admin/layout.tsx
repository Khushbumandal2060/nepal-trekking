import AdminShell from "@/admin/AdminShell";
import "@/admin/admin.css";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminShell>{children}</AdminShell>;
}
