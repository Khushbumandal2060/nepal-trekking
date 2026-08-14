import type { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";
import JsonLd from "@/components/JsonLd";
import { listPublicTreks } from "@/lib/treks-db";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Book a Trek",
    description:
        "Reserve your place on a Nepal trek — pick a route, choose your departure, and send your details. Availability and pricing are confirmed within 24 hours.",
    path: "/book",
});

interface BookPageProps {
    searchParams: Promise<{ trek?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
    const params = await searchParams;

    // Static seeds merged with admin-created treks, so newly added treks are
    // bookable through the same form.
    const allTreks = await listPublicTreks();
    const initialSlug =
        params.trek && allTreks.some((t) => t.slug === params.trek)
            ? params.trek
            : undefined;

    return (
        <>
            <JsonLd
                data={breadcrumbJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Book a Trek", path: "/book" },
                ])}
            />
            <section className="page-hero">
                <div className="wrap">
                    <div className="eyebrow">Book a Trek</div>
                    <h1>Reserve your place in the Himalaya.</h1>
                    <p className="lede">
                        Pick a route, choose your dates, and send us your details. A
                        Kathmandu-based team confirms availability and pricing within 24
                        hours.
                    </p>
                </div>
            </section>

            <section>
                <div className="wrap booking-wrap reveal">
                    <BookingFlow treks={allTreks} initialSlug={initialSlug} />
                </div>
            </section>
        </>
    );
}
