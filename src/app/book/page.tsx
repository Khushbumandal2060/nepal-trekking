import type { Metadata } from "next";
import BookingFlow from "@/components/BookingFlow";
import { treks } from "@/data/treks";

export const metadata: Metadata = {
    title: "Book a Trek",
    description:
        "Reserve your place on a Nepal trek — pick a route, choose your departure, and send your details. Availability and pricing are confirmed within 24 hours.",
};

interface BookPageProps {
    searchParams: Promise<{ trek?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
    const params = await searchParams;
    const initialSlug =
        params.trek && treks.some((t) => t.slug === params.trek)
            ? params.trek
            : undefined;

    return (
        <>
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
                    <BookingFlow treks={treks} initialSlug={initialSlug} />
                </div>
            </section>
        </>
    );
}
