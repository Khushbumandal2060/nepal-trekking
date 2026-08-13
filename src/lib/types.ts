export type Region =
    | "khumbu"
    | "annapurna"
    | "manaslu"
    | "langtang"
    | "mustang"
    | "kanchenjunga"
    | "dolpo"
    | "makalu"
    | "dhaulagiri"
    | "karnali"
    | "ganesh";

export interface ItineraryDay {
    /** Day title */
    t: string;
    /** Day description */
    d: string;
    /** Altitude reached */
    alt: string;
    /** Walking time */
    hrs: string;
}

export interface TrekFaq {
    q: string;
    a: string;
}

export interface Testimonial {
    name: string;
    trek: string;
    quote: string;
}

export interface TeamMember {
    name: string;
    role: string;
}

/** A pricing option shown in the "Cost & Pricing" section. */
export interface TrekPricingRow {
    label: string;
    price: string;
    note?: string;
}

/** A categorized packing-list block shown in the "Trek Essentials" section. */
export interface PackingCategory {
    category: string;
    items: string[];
}

/** A dedicated acclimatization stop (e.g. a rest day with a side hike). */
export interface AcclimatizationStop {
    day: number;
    title: string;
    note: string;
}

/** A local guide / trek ambassador featured on the detail page. */
export interface TrekGuide {
    name: string;
    role: string;
    region?: string;
    bio?: string;
    image?: string;
}

export interface Trek {
    slug: string;
    name: string;
    image: string;
    /** YouTube video ID shown on the trek detail page. Falls back to the region video when unset. */
    video?: string;
    region: Region;
    regionLabel: string;
    days: number;
    grade: string;
    altitude: string;
    startPoint: string;
    bestMonths: string;
    groupSize: string;
    price: string;
    overview: string;
    highlights: string[];
    itinerary: ItineraryDay[];
    included: string[];
    excluded: string[];
    faqs: TrekFaq[];

    // ---- Optional detail-page fields (managed via the admin editor) ----
    /** Human-readable best-season summary, e.g. "Spring (Mar–May) & Autumn (Sep–Nov)". */
    bestSeason?: string;
    /** Where the trek finishes, e.g. "Kathmandu". */
    endingPoint?: string;
    /** Extra route photos shown in the gallery section. */
    gallery?: string[];
    /** Step-by-step guidance for getting to the trailhead. */
    howToReach?: string[];
    /** Accommodation description on this trek. */
    accommodation?: string[];
    /** Food & meal description on this trek. */
    food?: string[];
    /** Permits required for this trek. */
    permits?: string[];
    /** Dedicated acclimatization stops (derived from the itinerary when unset). */
    acclimatization?: AcclimatizationStop[];
    /** Pricing rows shown in the Cost & Pricing section. */
    pricing?: TrekPricingRow[];
    /** Categorized packing list. Falls back to the site-wide default list. */
    packingList?: PackingCategory[];
    /** Fitness guidance specific to this trek. Falls back to site-wide guidance. */
    fitness?: string[];
    /** Health & safety notes specific to this trek. */
    healthSafety?: string[];
    /** Cancellation / refund terms. When absent the page shows a confirmation-at-booking note. */
    cancellationPolicy?: string[];
    /** Reviews / testimonials for this trek. When absent the page shows the site-wide ones. */
    reviews?: Testimonial[];
    /** Featured local guides for this trek. When absent the page derives them by region. */
    guides?: TrekGuide[];
}
