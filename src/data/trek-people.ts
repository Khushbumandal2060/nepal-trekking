import type { Testimonial, TrekGuide } from "@/lib/types";

/* ============================================================
   PEOPLE — a single source of truth for the site's testimonials
   and local guides.

   Both the homepage testimonials, the about-page team grid and
   the trek detail page ("Reviews" + "Your Local Guide") read from
   here so there is only ever one copy of this content.
   ============================================================ */

export const TESTIMONIALS: Testimonial[] = [
    {
        name: "Sonam T.",
        trek: "Everest Base Camp Trek",
        quote:
            "Our guide, Pemba, knew every teahouse owner by name from Phakding to Gorak Shep. That familiarity made a hard trek feel taken care of the entire way.",
    },
    {
        name: "Meera J.",
        trek: "Annapurna Circuit Trek",
        quote:
            "The acclimatization days weren't just on paper — our guide genuinely refused to rush us over Thorong La until everyone felt ready. That mattered.",
    },
    {
        name: "Ben O.",
        trek: "Manaslu Circuit Trek",
        quote:
            "Barely saw another trekking group the entire route. If you want the Himalaya without the queues, this is it.",
    },
    {
        name: "Aashna P.",
        trek: "Upper Mustang Trek",
        quote:
            "Lo Manthang in person is nothing like the photos. Our guide's family connections in the region got us into two monasteries that aren't usually open to visitors.",
    },
];

/**
 * Local trek leaders / ambassadors featured on trek detail pages.
 * Each guide carries the region(s) they lead so a detail page can show
 * the guides that are genuinely responsible for that trek.
 */
export const GUIDES: TrekGuide[] = [
    {
        name: "Pemba Sherpa",
        role: "Head Trek Leader, Khumbu",
        region: "khumbu",
        image: "/images/about-sherpa.jpeg",
        bio: "Leads the Everest Base Camp and Gokyo routes. Raised in the Khumbu, he has spent more than a decade guiding the valleys between Lukla and Kala Patthar.",
    },
    {
        name: "Anjali Gurung",
        role: "Trek Leader, Annapurna Region",
        region: "annapurna",
        bio: "Guides Annapurna Sanctuary, Circuit and Mardi Himal. Known for patient pacing and spot-on local weather calls around Thorong La.",
    },
    {
        name: "Dawa Tamang",
        role: "Trek Leader, Langtang & Manaslu",
        region: "langtang",
        bio: "Leads the Langtang Valley, Gosaikunda and Manaslu Circuit routes, with deep ties to the family-run lodges along each trail.",
    },
    {
        name: "Karma Lama",
        role: "Operations & Permits, Kathmandu",
        region: "kathmandu",
        bio: "Runs permits, lodges and logistics from the Thamel office, so every departure is fully arranged before you land.",
    },
];
