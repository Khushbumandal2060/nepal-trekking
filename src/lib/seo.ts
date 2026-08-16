import type { Metadata } from "next";
import type { BlogPost } from "@/data/blog";
import type { Trek, TrekFaq } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Site-wide constants                                                 */
/* ------------------------------------------------------------------ */

export const SITE_NAME = "Trekking Nepal";
export const SITE_TAGLINE = "Himalayan Trekking Company";
export const SITE_DESCRIPTION =
    "A Kathmandu-based trekking company running fixed-departure and custom treks exclusively inside Nepal since 2013. Everest, Annapurna, Manaslu, Langtang, Mustang and Kanchenjunga.";

export const SITE_KEYWORDS = [
    "Nepal trekking",
    "Everest Base Camp",
    "Annapurna",
    "Manaslu",
    "Langtang",
    "Mustang",
    "Kanchenjunga",
    "Himalaya",
    "trekking company Nepal",
    "guided treks Nepal",
    "Kathmandu trekking",
];

export const TWITTER_HANDLE = "@trekkingnepal";

/** Production URL override via NEXT_PUBLIC_SITE_URL; localhost is the dev fallback. */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

/** Absolute URL for an on-site path (e.g. "/treks" → "https://site.com/treks"). */
export function absoluteUrl(path = "/"): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${SITE_URL}${normalized}`;
}

/** Trim a string to a sensible meta description length without breaking words. */
export function truncate(text: string, max = 155): string {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

/* ------------------------------------------------------------------ */
/* Metadata builder                                                    */
/* ------------------------------------------------------------------ */

const OG_IMAGE = `${SITE_URL}/opengraph-image`;
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

interface SeoOptions {
    title?: string;
    description?: string;
    /** Site path used for the canonical URL, e.g. "/treks/everest-base-camp". */
    path?: string;
    /** Absolute or site-relative image path for og:image / twitter:image. */
    image?: string;
    /** Defaults to "website"; use "article" for evergreen content pages. */
    type?: "website" | "article";
    /** Adds robots noindex for utility/auth pages. */
    noIndex?: boolean;
    keywords?: string[];
}

/**
 * Compose a complete Metadata object (title, description, canonical,
 * Open Graph, Twitter card) from a few site-specific options.
 */
export function buildMetadata(opts: SeoOptions = {}): Metadata {
    const description = opts.description
        ? truncate(opts.description)
        : SITE_DESCRIPTION;
    const title = opts.title ?? `${SITE_NAME} — ${SITE_TAGLINE}`;
    const url = absoluteUrl(opts.path ?? "/");
    const image = opts.image ? absoluteUrl(opts.image) : OG_IMAGE;

    const metadata: Metadata = {
        title,
        description,
        alternates: { canonical: url },
        keywords: opts.keywords?.length ? opts.keywords : undefined,
        openGraph: {
            type: opts.type ?? "website",
            url,
            siteName: SITE_NAME,
            title,
            description,
            locale: "en_US",
            images: [
                {
                    url: image,
                    ...OG_IMAGE_SIZE,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };

    if (opts.noIndex) {
        metadata.robots = { index: false, follow: false };
    }

    return metadata;
}

/* ------------------------------------------------------------------ */
/* JSON-LD structured-data builders (schema.org)                       */
/* ------------------------------------------------------------------ */

export interface JsonLdObject {
    [key: string]: unknown;
}

/** Organization — the canonical "who runs this site" node. */
export function organizationJsonLd(): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        description: SITE_DESCRIPTION,
        address: {
            "@type": "PostalAddress",
            streetAddress: "Thamel",
            addressLocality: "Kathmandu",
            postalCode: "44600",
            addressCountry: "NP",
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "hello@trekkingnepal.example",
            availableLanguage: ["English"],
        },
        sameAs: [],
    };
}

/** WebSite — lets search engines surface a site link search box. */
export function websiteJsonLd(): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
    };
}

/** BreadcrumbList — home → trail of pages down to the current route. */
export function breadcrumbJsonLd(
    items: { name: string; path: string }[]
): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

/** ItemList — used on the treks index to enumerate every route. */
export function itemListJsonLd(
    items: { name: string; path: string }[]
): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            url: absoluteUrl(item.path),
        })),
    };
}

/** Extract the numeric USD price from a string like "$1,450". */
function parsePriceUsd(price: string): number {
    const match = price.replace(/,/g, "").match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

/** Product — a trek detail page with an offer and key facts. */
export function trekProductJsonLd(trek: Trek): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${SITE_URL}/treks/${trek.slug}#product`,
        name: `${trek.name} Trek`,
        description: trek.overview,
        image: absoluteUrl(trek.image),
        url: absoluteUrl(`/treks/${trek.slug}`),
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
            "@type": "Offer",
            price: parsePriceUsd(trek.price),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/treks/${trek.slug}`),
        },
        additionalProperty: [
            { "@type": "PropertyValue", name: "Duration", value: `${trek.days} days` },
            { "@type": "PropertyValue", name: "Grade", value: trek.grade },
            { "@type": "PropertyValue", name: "Max altitude", value: trek.altitude },
            { "@type": "PropertyValue", name: "Start point", value: trek.startPoint },
            { "@type": "PropertyValue", name: "Best months", value: trek.bestMonths },
        ],
    };
}

/** FAQPage — from a trek's own FAQ list. */
export function faqPageJsonLd(faqs: TrekFaq[]): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
    };
}

/** ContactPage — used on /contact. */
export function contactPageJsonLd(): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": `${SITE_URL}/contact#page`,
        name: "Contact Trekking Nepal",
        url: absoluteUrl("/contact"),
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
    };
}

/** AboutPage — structured profile for the /about route. */
export function aboutPageJsonLd(): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${SITE_URL}/about#page`,
        name: "About Trekking Nepal",
        url: absoluteUrl("/about"),
        description: SITE_DESCRIPTION,
        mainEntity: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
    };
}

/** Service — the guided trekking + booking service offered on /book. */
export function serviceJsonLd(): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/book#service`,
        serviceType: "Guided trekking tours",
        name: "Guided Trekking in Nepal",
        url: absoluteUrl("/book"),
        description:
            "Book a place on a guided Nepal trek — Everest, Annapurna, Manaslu, Langtang, Mustang and Kanchenjunga. Availability and pricing confirmed within 24 hours.",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: {
            "@type": "Country",
            name: "Nepal",
        },
        audience: {
            "@type": "Audience",
            audienceType: "Trekkers",
        },
        availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: absoluteUrl("/book"),
        },
        offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            url: absoluteUrl("/book"),
        },
    };
}

/** Best-effort conversion of a display date ("May 28, 2026") to ISO 8601. */
function toIsoDate(date: string): string {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toISOString();
}

/** Blog — the /blog Journal, enumerating each post as a BlogPosting. */
export function blogJsonLd(posts: BlogPost[]): JsonLdObject {
    return {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        url: absoluteUrl("/blog"),
        name: "The Trekking Nepal Journal",
        description:
            "Guides' notes from the trail — season updates, packing lists and honest answers to the questions trekkers ask us most.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
        blogPost: posts.map((post) => {
            const iso = toIsoDate(post.date);
            return {
                "@type": "BlogPosting",
                "@id": `${SITE_URL}/blog#${post.slug}`,
                headline: post.title,
                description: post.excerpt,
                url: absoluteUrl(`/blog#${post.slug}`),
                datePublished: iso,
                dateModified: iso,
                mainEntityOfPage: absoluteUrl(`/blog#${post.slug}`),
                author: { "@id": `${SITE_URL}/#organization` },
                publisher: { "@id": `${SITE_URL}/#organization` },
            };
        }),
    };
}
