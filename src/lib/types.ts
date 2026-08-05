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

export interface Trek {
    slug: string;
    name: string;
    image: string;
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
