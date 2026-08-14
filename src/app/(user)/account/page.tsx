import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RidgeSVG from "@/components/RidgeSVG";
import { auth } from "@/lib/auth";
import { findBookingsForUser } from "@/lib/bookings";
import { findUserById } from "@/lib/users";
import { buildMetadata } from "@/lib/seo";
import AccountDashboard from "./AccountDashboard";
import styles from "./account.module.css";

export const metadata: Metadata = buildMetadata({
    title: "My Account",
    description:
        "Your Trekking Nepal account dashboard — track your treks, manage bookings and plan your next adventure.",
    path: "/account",
    noIndex: true,
});

function fmtDate(value: Date | string | null | undefined): string {
    if (!value) return "—";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default async function AccountPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const email = session.user.email ?? "";
    const name = session.user.name ?? "Trekker";
    const firstName = name.split(" ")[0];

    // Pull the full user row for accurate provider / created_at values.
    let provider = "credentials";
    let memberSince: Date | string | null = null;
    if (session.user.id) {
        try {
            const userRow = await findUserById(session.user.id);
            if (userRow) {
                provider = userRow.provider;
                memberSince = userRow.created_at;
            }
        } catch {
            // Fall back to the defaults above.
        }
    }

    let bookings = await findBookingsForUser(email).catch(() => []);

    return (
        <main id="main-content">
            {/* Dashboard hero */}
            <section className={styles.hero}>
                <div className={styles.heroScrim} aria-hidden="true" />
                <div className={styles.heroWrap}>
                    <div className={styles.heroTop}>
                        <span className={styles.heroEyebrow}>Your trekking home</span>
                        <span className={styles.heroMember}>
                            Member since {fmtDate(memberSince)}
                        </span>
                    </div>
                    <h1 className={styles.heroTitle}>
                        Namaste, <em>{firstName}</em>
                    </h1>
                    <p className={styles.heroSub}>
                        Every adventure you&rsquo;ve planned with us, in one place —
                        track status, adjust dates and manage your treks.
                    </p>
                </div>
                <div className={styles.heroRidge} aria-hidden="true">
                    <RidgeSVG seed={3} />
                </div>
            </section>

            <section className={styles.accountSection}>
                <div className={styles.accountWrap}>
                    <AccountDashboard
                        user={{
                            name,
                            email,
                            provider,
                            memberSince,
                        }}
                        initialBookings={bookings}
                    />
                </div>
            </section>
        </main>
    );
}
