import type { Metadata } from "next";
import Image from "next/image";
import FaqList from "@/components/FaqList";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import {
    breadcrumbJsonLd,
    buildMetadata,
    contactPageJsonLd,
    faqPageJsonLd,
} from "@/lib/seo";
import type { TrekFaq } from "@/lib/types";
import styles from "./contact.module.css";

export const metadata: Metadata = buildMetadata({
    title: "Contact",
    description:
        "Tell us where you want to go — fill in a few details and a Kathmandu-based trek expert will reply within 24 hours with route options, dates, and pricing.",
    path: "/contact",
});

/* ----------------------------------------------------------------
   Contact details — single source of truth used across the page.
   ---------------------------------------------------------------- */
const CONTACT = {
    address: "Trekking Nepal, Thamel, Kathmandu 44600, Nepal",
    phoneDisplay: "+977 1 4XX XXXX",
    phoneHref: "tel:+977141XXXXXXX",
    email: "hello@trekkingnepal.example",
    emailHref: "mailto:hello@trekkingnepal.example",
    whatsappDisplay: "+977 98XX XXXXXX",
    whatsappHref: "https://wa.me/97798XXXXXXXX",
    hours: "Sunday\u2013Friday, 9:00\u201318:00 NPT",
    hoursNote: "Nepal is closed on Saturdays",
    responseTime: "Enquiries are typically answered within 24 hours on office days.",
    landmark: "Near the Garden of Dreams, Thamel",
    mapsEmbed:
        "https://www.google.com/maps?q=Thamel%2C+Kathmandu+44600%2C+Nepal&z=15&output=embed",
    mapsDirections:
        "https://www.google.com/maps/dir/?api=1&destination=Thamel%2C+Kathmandu+44600%2C+Nepal",
};

/* Quick-tap tiles under the hero. */
interface Tile {
    icon: string;
    label: string;
    value: string;
    sub: string;
    href: string;
}

const TILES: Tile[] = [
    {
        icon: "\uD83D\uDCCD",
        label: "Visit",
        value: "Thamel, Kathmandu",
        sub: "44600, Nepal",
        href: CONTACT.mapsDirections,
    },
    {
        icon: "\uD83D\uDCDE",
        label: "Call",
        value: CONTACT.phoneDisplay,
        sub: "Sun\u2013Fri, 9:00\u201318:00",
        href: CONTACT.phoneHref,
    },
    {
        icon: "\u2709\uFE0F",
        label: "Email",
        value: CONTACT.email,
        sub: "Replies within 24 hours",
        href: CONTACT.emailHref,
    },
    {
        icon: "\uD83D\uDCAC",
        label: "WhatsApp",
        value: CONTACT.whatsappDisplay,
        sub: "Fastest for quick questions",
        href: CONTACT.whatsappHref,
    },
];

/* Office-details list shown beside the enquiry form. */
interface Detail {
    icon: string;
    label: string;
    value: string;
    href?: string;
}

const DETAILS: Detail[] = [
    { icon: "\uD83D\uDCCD", label: "Address", value: CONTACT.address },
    { icon: "\uD83D\uDCDE", label: "Phone", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
    { icon: "\u2709\uFE0F", label: "Email", value: CONTACT.email, href: CONTACT.emailHref },
    { icon: "\uD83D\uDD58", label: "Office Hours", value: `${CONTACT.hours} \u2014 ${CONTACT.hoursNote}` },
];

/* "What happens next" steps. */
const STEPS = [
    {
        num: "01",
        title: "Send an enquiry",
        desc: "Tell us the trek, your dates, group size and any questions. It takes about two minutes.",
    },
    {
        num: "02",
        title: "An expert replies",
        desc: "A Kathmandu-based trek leader answers within 24 hours with route options and dates.",
    },
    {
        num: "03",
        title: "Build your plan",
        desc: "Together you shape a day-by-day itinerary \u2014 then we handle permits, guides and logistics.",
    },
];

/* Common questions before people write in. */
const FAQS: TrekFaq[] = [
    {
        q: "How quickly will you reply?",
        a: "Most enquiries are answered within one business day. During peak season (March\u2013May and September\u2013November) it may take up to 48 hours \u2014 but we reply to every message, always with a named guide.",
    },
    {
        q: "Can I message you on WhatsApp?",
        a: "Yes. WhatsApp is often the fastest way to reach us for quick questions. Just add our number and mention the trek you are interested in.",
    },
    {
        q: "Is there any cost to ask a question?",
        a: "No. Enquiries and itinerary planning are free, and there is no obligation to book. You only pay once you confirm a departure.",
    },
    {
        q: "I'm not sure which trek to choose.",
        a: "That is exactly what we are here for. Send us your dates, fitness level and how many days you have \u2014 we will suggest two or three routes that fit.",
    },
];

export default function ContactPage() {
    return (
        <div id="main-content">
            <JsonLd
                data={[
                    contactPageJsonLd(),
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "Contact", path: "/contact" },
                    ]),
                    faqPageJsonLd(FAQS),
                ]}
            />

            {/* ============================================================
                1 · HERO
                ============================================================ */}
            <section className={styles.hero}>
                <div className={styles.heroMedia}>
                    <Image
                        src="/images/contact.jpg"
                        alt="The Nepali Himalaya seen from a high ridge"
                        fill
                        priority
                        sizes="100vw"
                        className={styles.heroImg}
                    />
                    <div className={styles.heroScrim} aria-hidden="true" />
                </div>

                <span className={styles.heroRail} aria-hidden="true">
                    Thamel &middot; Kathmandu &middot; NPT +5:45
                </span>

                <div className={`wrap ${styles.heroContent}`}>
                    <div className={styles.heroEyebrow}>Contact</div>
                    <h1>Tell us where you want to go.</h1>
                    <p className={styles.heroLede}>
                        Fill in a few details and a Kathmandu-based trek expert
                        will reply within 24 hours with route options, dates and
                        pricing.
                    </p>
                    <div className={styles.heroActions}>
                        <a className="btn btn-primary" href="#enquiry">
                            Send an Enquiry
                        </a>
                        <a
                            className={`btn btn-ghost ${styles.whatsappGhost}`}
                            href={CONTACT.whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                className={styles.whatsappIcon}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            WhatsApp Us
                        </a>
                        <a
                            className="btn btn-ghost"
                            href={CONTACT.mapsDirections}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Get Directions
                        </a>
                    </div>
                    <div className={styles.heroMeta}>
                        <span>{CONTACT.phoneDisplay}</span>
                        <span>{CONTACT.email}</span>
                        <span>{CONTACT.hours}</span>
                    </div>
                </div>
            </section>

            {/* ============================================================
                2 · QUICK CONTACT TILES
                ============================================================ */}
            <section className={styles.tiles}>
                <div className={`wrap reveal ${styles.tilesGrid}`}>
                    {TILES.map((t) => {
                        const external = t.href.startsWith("http");
                        return (
                            <a
                                key={t.label}
                                href={t.href}
                                className={styles.tile}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noopener noreferrer" : undefined}
                            >
                                <span className={styles.tileIcon} aria-hidden="true">
                                    {t.icon}
                                </span>
                                <span className={styles.tileLabel}>{t.label}</span>
                                <span className={styles.tileValue}>{t.value}</span>
                                <span className={styles.tileSub}>{t.sub}</span>
                            </a>
                        );
                    })}
                </div>
            </section>

            {/* ============================================================
                3 · ENQUIRY FORM + OFFICE DETAILS
                ============================================================ */}
            <section className={styles.main} id="enquiry">
                <div className={`wrap reveal ${styles.split}`}>
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <div>
                                <div className="sec-eyebrow">Plan My Trek</div>
                                <h2>Send an enquiry</h2>
                            </div>
                            <span className={styles.cardTag}>Thamel &middot; Kathmandu</span>
                        </div>
                        <ContactForm />
                    </div>

                    <div className={styles.details}>
                        {DETAILS.map((d) => {
                            const external =
                                d.href !== undefined && d.href.startsWith("http");
                            return (
                                <div key={d.label} className={styles.detail}>
                                    <span className={styles.detailIcon} aria-hidden="true">
                                        {d.icon}
                                    </span>
                                    <div>
                                        <div className={styles.detailLabel}>{d.label}</div>
                                        <div className={styles.detailValue}>
                                            {d.href ? (
                                                <a
                                                    href={d.href}
                                                    target={external ? "_blank" : undefined}
                                                    rel={external ? "noopener noreferrer" : undefined}
                                                >
                                                    {d.value}
                                                </a>
                                            ) : (
                                                d.value
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className={styles.note}>
                            <div className={styles.noteLabel}>Response Time</div>
                            <p>{CONTACT.responseTime}</p>
                            <a
                                className={`btn btn-primary ${styles.noteCta}`}
                                href="#enquiry"
                            >
                                Send an Enquiry
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                4 · MAP
                ============================================================ */}
            <section className={styles.map}>
                <div className={`wrap reveal ${styles.mapGrid}`}>
                    <div className={styles.mapFrame}>
                        <iframe
                            src={CONTACT.mapsEmbed}
                            title="Map showing the Trekking Nepal office in Thamel, Kathmandu"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                    <div className={styles.mapCard}>
                        <div className={styles.mapEyebrow}>Find Us</div>
                        <h2>On foot in Thamel, minutes from the Garden of Dreams.</h2>
                        <div className={styles.mapRow}>
                            <span className={styles.mapRowIcon} aria-hidden="true">
                                {"\uD83D\uDCCD"}
                            </span>
                            <div>
                                <b>Address</b>
                                {CONTACT.address}
                            </div>
                        </div>
                        <div className={styles.mapRow}>
                            <span className={styles.mapRowIcon} aria-hidden="true">
                                {"\uD83D\uDD58"}
                            </span>
                            <div>
                                <b>Office Hours</b>
                                {CONTACT.hours}
                            </div>
                        </div>
                        <div className={styles.mapRow}>
                            <span className={styles.mapRowIcon} aria-hidden="true">
                                {"\uD83D\uDEA9"}
                            </span>
                            <div>
                                <b>Closest Landmark</b>
                                {CONTACT.landmark}
                            </div>
                        </div>
                        <a
                            className={`btn btn-primary ${styles.mapBtn}`}
                            href={CONTACT.mapsDirections}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>
            </section>

            {/* ============================================================
                5 · WHAT HAPPENS NEXT
                ============================================================ */}
            <section className={styles.steps}>
                <div className="wrap reveal">
                    <div className={`sec-head ${styles.stepsHead}`}>
                        <div className="sec-eyebrow">What Happens Next</div>
                        <h2>From enquiry to itinerary in three steps.</h2>
                    </div>
                    <div className={styles.stepsGrid}>
                        {STEPS.map((s) => (
                            <article key={s.num} className={styles.step}>
                                <span className={styles.stepNum}>{s.num}</span>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                6 · FAQ
                ============================================================ */}
            <section className={styles.faq}>
                <div className={`wrap reveal ${styles.faqGrid}`}>
                    <div className="sec-head">
                        <div className="sec-eyebrow">Common Questions</div>
                        <h2>Before you write in.</h2>
                        <p className="sec-lead">
                            A few things people often ask before getting in
                            touch &mdash; answers, not runaround.
                        </p>
                    </div>
                    <FaqList faqs={FAQS} />
                </div>
            </section>

            {/* ============================================================
                7 · CLOSING CTA
                ============================================================ */}
            <section className={styles.cta}>
                <div className="wrap reveal">
                    <h2>Prefer to talk it through?</h2>
                    <p>
                        Jump on WhatsApp for a quick chat, or send an enquiry and
                        a named trek leader will get back to you within 24 hours.
                    </p>
                    <div className={styles.ctaActions}>
                        <a
                            className={`btn ${styles.whatsappBtn}`}
                            href={CONTACT.whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                className={styles.whatsappIcon}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                        <a className="btn btn-ghost" href="#enquiry">
                            Send an Enquiry
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
