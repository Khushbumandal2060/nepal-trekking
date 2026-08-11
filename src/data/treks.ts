import type { Trek, TrekFaq } from "@/lib/types";
import { khumbuAnnapurnaTreks } from "./treks-khumbu-annapurna";
import { moreTreks } from "./treks-more";

// All original trek write-ups. Altitudes/regions are general geographic facts.

// ---------------------------------------------------------------------
// Shared "Good to Know" questions shown on every trek detail page.
// Each entry carries one or more `topics` used to avoid duplicating a
// trek's own specific FAQ (e.g. the generic insurance question is skipped
// on a trek that already asks about insurance).
// ---------------------------------------------------------------------
interface GeneralFaq extends TrekFaq {
    topics: string[];
}

const generalFaqs: GeneralFaq[] = [
    {
        topics: ["fitness"],
        q: "How fit do I need to be for this trek?",
        a: "You don't need to be an athlete, but regular cardio and multi-hour hill walking make a big difference. We recommend training for 6–8 weeks beforehand — hiking with a loaded daypack, stairs and treadmill inclines all build the right foundation.",
    },
    {
        topics: ["insurance"],
        q: "Is travel insurance required for this trek?",
        a: "Yes. Comprehensive travel insurance covering high-altitude trekking and emergency helicopter evacuation is mandatory on all our treks, and we ask to see proof of cover before departure.",
    },
    {
        topics: ["acclimatization"],
        q: "How does acclimatization work on the trail?",
        a: "We follow the 'climb high, sleep low' principle, with built-in acclimatization days and a gradual ascent profile. If anyone shows signs of altitude sickness, we descend immediately and follow our emergency plan.",
    },
    {
        topics: ["gear"],
        q: "What gear do I need, and can I rent it in Nepal?",
        a: "The essentials are sturdy hiking boots, a warm down jacket, a sleeping bag rated below freezing and a comfortable daypack. We send a full packing list on booking, and most items can be bought or hired cheaply in Kathmandu or Pokhara.",
    },
    {
        topics: ["food"],
        q: "What are the teahouses and meals like?",
        a: "Teahouses offer a bed, blankets and cooked meals — typically dal bhat, noodles, momos and pancakes. They're basic but clean and friendly, with vegetarian options always available. Let us know about any dietary requirements when you book.",
    },
    {
        topics: ["connectivity"],
        q: "Will I have WiFi, phone signal and power on the trail?",
        a: "Expect limited connectivity. Most larger villages have WiFi and charging for a small fee, but signal fades quickly with altitude — a good chance to disconnect. Your guide always carries an emergency communication device for safety.",
    },
    {
        topics: ["water"],
        q: "Is the drinking water safe on the trail?",
        a: "We recommend only treated or purified water. Teahouses sell boiled water cheaply, and we suggest carrying a reusable bottle with purification tablets or a filter to cut plastic waste. Never drink directly from streams or taps.",
    },
    {
        topics: ["solo"],
        q: "Can I join as a solo traveller or book a private trek?",
        a: "Yes to both. Solo trekkers join our scheduled departures with no single supplement, and we also run fully private treks for couples, families or friends. Share your dates and we'll tailor the trip.",
    },
];

// Keywords used to match a general FAQ topic against a trek's own questions.
const topicKeywords: Record<string, string[]> = {
    fitness: [
        "experience",
        "fit",
        "first",
        "families",
        "suitable",
        "hard",
        "difficult",
        "mountaineer",
        "trekked before",
        "older",
        "high-altitude",
    ],
    insurance: ["insurance"],
    acclimatization: ["acclimat", "altitude sickness"],
    gear: ["gear", "packing", "equipment", "rent", "sleeping bag", "boots"],
    food: ["teahouse", "food", "meal", "accommodat", "lodge", "camping", "vegetarian"],
    connectivity: ["wifi", "signal", "phone", "charge", "internet", "sim"],
    water: ["water", "purif"],
    solo: ["solo", "alone", "single", "group"],
};

/** Appends the shared good-to-know questions, skipping any topic the trek already covers. */
function mergeFaqs(specific: TrekFaq[], general: GeneralFaq[]): TrekFaq[] {
    const specificText = specific.map((f) => f.q.toLowerCase());
    const covered = (topic: string) =>
        (topicKeywords[topic] ?? []).some((kw) =>
            specificText.some((q) => q.includes(kw))
        );
    const extra = general
        .filter((g) => !g.topics.some(covered))
        .map(({ q, a }) => ({ q, a }));
    return [...specific, ...extra];
}

const rawTreks: Trek[] = [
    {
        slug: "everest-base-camp",
        image: "/images/everest.jpg",
        name: "Everest Base Camp Trek",
        region: "khumbu",
        regionLabel: "Khumbu, Solukhumbu District",
        days: 13,
        grade: "Difficult",
        altitude: "18,200 ft / 5,545 m",
        startPoint: "Kathmandu → Lukla (flight)",
        bestMonths: "Mar–May, Sep–Nov",
        groupSize: "4–14",
        price: "$1,450",
        overview:
            "The classic route into the Khumbu: a short mountain flight into Lukla, a gentle build through Sherpa villages, and a slow climb toward the foot of the world's highest peak. This itinerary carries two dedicated acclimatization days so your body gets a real chance to adjust before the final push to Kala Patthar.",
        highlights: [
            "Sunrise over Everest, Nuptse and Lhotse from Kala Patthar",
            "Namche Bazaar, the trading hub of the Khumbu",
            "Tengboche Monastery, the spiritual centre of the region",
            "A close look at the Khumbu Glacier near base camp",
        ],
        itinerary: [
            {
                t: "Fly to Lukla, trek to Phakding",
                d: "A short scenic flight drops you into the mountains almost immediately. An easy afternoon walk along the Dudh Koshi river eases you into trail life.",
                alt: "8,560 ft",
                hrs: "3–4 hrs",
            },
            {
                t: "Phakding to Namche Bazaar",
                d: "The trail climbs steadily, crossing several suspension bridges before a long final ascent into Namche, the unofficial capital of the Khumbu.",
                alt: "11,290 ft",
                hrs: "6–7 hrs",
            },
            {
                t: "Acclimatization day in Namche",
                d: "A rest day with a purpose — a short hike up toward Everest View Hotel helps your body adjust before you go higher.",
                alt: "11,290 ft",
                hrs: "3 hrs",
            },
            {
                t: "Namche to Tengboche",
                d: "Rolling trail with wide Himalayan views leads to Tengboche, home to the region's most important monastery.",
                alt: "12,690 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Tengboche to Dingboche",
                d: "The trees thin out and the landscape turns alpine as you climb into the Imja Valley.",
                alt: "14,470 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Acclimatization day in Dingboche",
                d: "A side hike up Nangkartshang for panoramic views, then back down to sleep at the same altitude.",
                alt: "14,470 ft",
                hrs: "3–4 hrs",
            },
            {
                t: "Dingboche to Lobuche",
                d: "A quieter trail past the Khumbu glacier's edge, with memorials to mountaineers along the ridge.",
                alt: "16,210 ft",
                hrs: "5 hrs",
            },
            {
                t: "Lobuche to Gorak Shep, on to Everest Base Camp",
                d: "The big day. Drop bags in Gorak Shep, then continue over glacial moraine to reach base camp itself before returning to sleep.",
                alt: "17,600 ft (EBC)",
                hrs: "7–8 hrs",
            },
            {
                t: "Kala Patthar sunrise, descend to Pheriche",
                d: "A pre-dawn climb to Kala Patthar for the best Everest views on the route, then a long descent to lower, thicker air.",
                alt: "18,200 ft (peak)",
                hrs: "7 hrs",
            },
            {
                t: "Pheriche to Namche Bazaar",
                d: "A long, satisfying descent back through familiar villages.",
                alt: "11,290 ft",
                hrs: "6–7 hrs",
            },
            {
                t: "Namche to Lukla",
                d: "The final trekking day, retracing the route back to Lukla for a celebratory last night on the trail.",
                alt: "9,380 ft",
                hrs: "6–7 hrs",
            },
            {
                t: "Fly back to Kathmandu",
                d: "A short flight returns you to the capital, weather permitting — we build a buffer day into every departure for exactly this reason.",
                alt: "4,600 ft",
                hrs: "35 min flight",
            },
            {
                t: "Buffer / departure day",
                d: "Reserved in case of flight delays out of Lukla. If unused, it's a free day to explore Kathmandu.",
                alt: "—",
                hrs: "—",
            },
        ],
        included: [
            "Airport pickup and drop in Kathmandu",
            "Kathmandu–Lukla–Kathmandu flights",
            "Teahouse accommodation on trek",
            "All meals during the trek",
            "Licensed English-speaking trek guide",
            "Porter support (1 porter per 2 trekkers)",
            "Sagarmatha National Park & TIMS permits",
            "First-aid kit and basic oxygen support",
        ],
        excluded: [
            "International flights to Nepal",
            "Nepal entry visa",
            "Personal trekking gear",
            "Travel insurance with helicopter evacuation cover",
            "Tips for guides and porters",
            "Alcoholic and bottled drinks on trail",
        ],
        faqs: [
            {
                q: "Do I need prior trekking experience?",
                a: "No technical climbing experience is required, but a solid base of cardio fitness matters. Most trekkers train for 8–10 weeks beforehand with hiking, stairs, and long walks.",
            },
            {
                q: "What if the Lukla flight is delayed?",
                a: "This is common in this region, especially in peak season. The itinerary includes a buffer day at the end specifically to absorb weather delays without affecting your international flight home.",
            },
            {
                q: "Is travel insurance mandatory?",
                a: "Yes. Your policy must cover trekking above 5,000m and include emergency helicopter evacuation. We ask for proof before departure.",
            },
        ],
    },
    {
        slug: "annapurna-base-camp",
        image: "/images/annapurna.jpg",
        name: "Annapurna Base Camp Trek",
        region: "annapurna",
        regionLabel: "Annapurna Sanctuary, Gandaki Province",
        days: 9,
        grade: "Moderate",
        altitude: "13,550 ft / 4,130 m",
        startPoint: "Pokhara → Nayapul (drive)",
        bestMonths: "Mar–May, Sep–Dec",
        groupSize: "4–16",
        price: "$820",
        overview:
            "A shorter, greener alternative to the Khumbu treks, climbing through rhododendron forest and terraced villages into a natural amphitheatre of 7,000m and 8,000m peaks. Teahouses the whole way mean light packs and warm meals every night.",
        highlights: [
            "Waking up inside the Annapurna Sanctuary, ringed by giants",
            "Hot springs at Jhinu Danda on the way down",
            "Gurung and Magar villages along the lower trail",
            "A gentler altitude profile than the Khumbu routes",
        ],
        itinerary: [
            {
                t: "Drive to Nayapul, trek to Tikhedhunga",
                d: "A scenic drive from Pokhara sets you at the trailhead; the first afternoon is a gentle river-side walk.",
                alt: "5,400 ft",
                hrs: "3–4 hrs",
            },
            {
                t: "Tikhedhunga to Ghorepani",
                d: "A famous stone staircase climbs steadily through forest to the ridge village of Ghorepani.",
                alt: "9,430 ft",
                hrs: "6–7 hrs",
            },
            {
                t: "Poon Hill sunrise, on to Tadapani",
                d: "A pre-dawn climb for one of Nepal's best panoramic sunrises, then a forested traverse toward Tadapani.",
                alt: "10,530 ft (peak)",
                hrs: "6 hrs",
            },
            {
                t: "Tadapani to Chhomrong",
                d: "The trail descends into the Modi Khola valley and climbs back up to Chhomrong, gateway to the Sanctuary.",
                alt: "7,050 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Chhomrong to Himalaya Hotel",
                d: "A long, steadily climbing day as the valley narrows and the forest thins.",
                alt: "9,700 ft",
                hrs: "6 hrs",
            },
            {
                t: "Himalaya Hotel to Annapurna Base Camp",
                d: "The final push into the amphitheatre of peaks, arriving with enough daylight to take it all in.",
                alt: "13,550 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Descend to Bamboo",
                d: "A long descent, retracing the valley with the peaks now behind you.",
                alt: "7,700 ft",
                hrs: "7 hrs",
            },
            {
                t: "Bamboo to Jhinu Danda, hot springs",
                d: "An easier day ending at the region's natural hot springs — a well-earned soak for tired legs.",
                alt: "5,700 ft",
                hrs: "5 hrs",
            },
            {
                t: "Jhinu Danda to Nayapul, drive to Pokhara",
                d: "The final trekking hours followed by a drive back to Pokhara's lakeside.",
                alt: "2,700 ft (Pokhara)",
                hrs: "4 hrs trek + drive",
            },
        ],
        included: [
            "Pokhara airport/hotel pickup",
            "Kathmandu–Pokhara transport (bus)",
            "Teahouse accommodation on trek",
            "All meals during the trek",
            "Licensed trek guide and porter support",
            "ACAP & TIMS permits",
            "First-aid kit",
        ],
        excluded: [
            "International and domestic flights",
            "Nepal entry visa",
            "Personal trekking gear",
            "Travel insurance",
            "Tips for guides and porters",
        ],
        faqs: [
            {
                q: "Is this easier than Everest Base Camp?",
                a: "Generally yes — it's shorter, lower in maximum altitude, and the ascent is more gradual, which makes it a common choice for a first Himalayan trek.",
            },
            {
                q: "Can this be combined with Poon Hill only, as a shorter trip?",
                a: "Yes, we also run a 5-day Ghorepani Poon Hill trek that covers the first half of this route for trekkers short on time.",
            },
        ],
    },
    {
        slug: "annapurna-circuit",
        image: "/images/annapurna-circuit-trek.jpg",
        name: "Annapurna Circuit Trek",
        region: "annapurna",
        regionLabel: "Manang & Mustang, Gandaki Province",
        days: 14,
        grade: "Moderate to Difficult",
        altitude: "17,770 ft / 5,416 m",
        startPoint: "Kathmandu → Besisahar (drive)",
        bestMonths: "Mar–May, Sep–Nov",
        groupSize: "4–12",
        price: "$1,180",
        overview:
            "One of the great classic circuits, crossing from lush subtropical valleys over the high, wind-scoured Thorong La pass into the dry, Tibetan-influenced landscape of Mustang. Long, varied, and still one of the best introductions to the sheer range of Nepal's terrain.",
        highlights: [
            "Crossing Thorong La, one of the highest trekking passes in the world",
            "The dramatic landscape shift from green valleys to high desert",
            "Muktinath, a pilgrimage site sacred to both Hindus and Buddhists",
            "Natural hot springs at Tatopani",
        ],
        itinerary: [
            {
                t: "Drive to Besisahar, on to Chame",
                d: "A long but scenic drive followed by the first trekking hours along the Marsyangdi river.",
                alt: "8,700 ft",
                hrs: "Drive + 2 hrs trek",
            },
            {
                t: "Chame to Pisang",
                d: "Pine forest and a first proper glimpse of the Annapurna range through the trees.",
                alt: "10,500 ft",
                hrs: "5 hrs",
            },
            {
                t: "Pisang to Manang",
                d: "The valley opens up; you can take the high or low route depending on acclimatization needs.",
                alt: "11,600 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Acclimatization day in Manang",
                d: "A short side hike to a viewpoint above the village, with a full day to adjust before going higher.",
                alt: "11,600 ft",
                hrs: "2–3 hrs",
            },
            {
                t: "Manang to Yak Kharka",
                d: "The trail leaves the treeline behind for good.",
                alt: "13,200 ft",
                hrs: "4 hrs",
            },
            {
                t: "Yak Kharka to Thorong Phedi",
                d: "A short but high-altitude day, positioning you for the pass crossing.",
                alt: "14,600 ft",
                hrs: "4 hrs",
            },
            {
                t: "Cross Thorong La to Muktinath",
                d: "An early start for the long climb over the pass and a knee-testing descent into Muktinath.",
                alt: "17,770 ft (pass)",
                hrs: "8–9 hrs",
            },
            {
                t: "Muktinath to Marpha",
                d: "Drop into the dry Mustang valley, passing apple orchards and whitewashed villages.",
                alt: "8,800 ft",
                hrs: "5 hrs (+ optional jeep)",
            },
            {
                t: "Marpha to Kalopani",
                d: "Trail through pine forest along the Kali Gandaki, one of the world's deepest gorges.",
                alt: "8,200 ft",
                hrs: "5 hrs",
            },
            {
                t: "Kalopani to Tatopani",
                d: "A long descent ending at natural hot springs — the traditional reward point on this route.",
                alt: "3,900 ft",
                hrs: "6 hrs",
            },
            {
                t: "Tatopani to Ghorepani",
                d: "A steep climb back up out of the gorge toward the Poon Hill ridge.",
                alt: "9,430 ft",
                hrs: "6–7 hrs",
            },
            {
                t: "Poon Hill sunrise, descend to Nayapul",
                d: "One last sunrise viewpoint before descending out of the mountains.",
                alt: "10,530 ft (peak)",
                hrs: "6 hrs",
            },
            {
                t: "Drive to Pokhara",
                d: "A relaxed day getting back to lakeside Pokhara.",
                alt: "2,700 ft",
                hrs: "Drive",
            },
            {
                t: "Buffer / drive to Kathmandu",
                d: "Built-in flexibility for weather or pace, or an extra day in Pokhara.",
                alt: "—",
                hrs: "—",
            },
        ],
        included: [
            "Kathmandu–Besisahar and Pokhara–Kathmandu transport",
            "Teahouse accommodation on trek",
            "All meals during the trek",
            "Licensed trek guide and porter support",
            "ACAP & TIMS permits",
            "First-aid kit",
        ],
        excluded: [
            "International flights",
            "Nepal entry visa",
            "Personal trekking gear",
            "Travel insurance with high-altitude cover",
            "Tips",
        ],
        faqs: [
            {
                q: "How hard is the Thorong La crossing?",
                a: "It's a long summit day — 8 to 9 hours — at real altitude, but not technical. Success comes down to acclimatization, an early start, and steady pacing rather than climbing skill.",
            },
            {
                q: "Can I shorten this trek with a jeep?",
                a: "Yes, jeep roads now run along parts of this circuit. We can build a shorter version for trekkers with limited time, though it changes the trail experience.",
            },
        ],
    },
    {
        slug: "manaslu-circuit",
        image: "/images/manaslu circuit-trek.jpg",
        name: "Manaslu Circuit Trek",
        region: "manaslu",
        regionLabel: "Gorkha District",
        days: 12,
        grade: "Difficult",
        altitude: "17,100 ft / 5,213 m",
        startPoint: "Kathmandu → Soti Khola (drive)",
        bestMonths: "Mar–May, Sep–Nov",
        groupSize: "4–10",
        price: "$1,390",
        overview:
            "A restricted-area trek circling the world's eighth-highest peak, with a fraction of the foot traffic of the Everest and Annapurna routes. Special permits keep group sizes small and the trail genuinely remote.",
        highlights: [
            "Circling Mt. Manaslu (8,163m) with none of the crowds of other 8,000m routes",
            "Tibetan Buddhist villages largely unchanged by tourism",
            "Crossing the high, remote Larkya La pass",
            "Restricted-area status means a real sense of wilderness",
        ],
        itinerary: [
            {
                t: "Drive to Soti Khola",
                d: "A long, scenic drive out of the Kathmandu valley to the trailhead.",
                alt: "2,400 ft",
                hrs: "Drive, 7–8 hrs",
            },
            {
                t: "Soti Khola to Machha Khola",
                d: "An easy first day along the Budhi Gandaki river.",
                alt: "2,900 ft",
                hrs: "6 hrs",
            },
            {
                t: "Machha Khola to Jagat",
                d: "Entering the restricted area, with permit checks along the way.",
                alt: "4,600 ft",
                hrs: "6–7 hrs",
            },
            {
                t: "Jagat to Deng",
                d: "The valley narrows and the trail turns more remote.",
                alt: "6,000 ft",
                hrs: "6 hrs",
            },
            {
                t: "Deng to Namrung",
                d: "First real mountain views begin to open up.",
                alt: "8,000 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Namrung to Samagaon",
                d: "Tibetan-influenced villages and the first clear views of Manaslu itself.",
                alt: "11,000 ft",
                hrs: "5 hrs",
            },
            {
                t: "Acclimatization day in Samagaon",
                d: "An optional side hike toward Manaslu Base Camp for views and altitude adjustment.",
                alt: "11,000 ft",
                hrs: "4–5 hrs",
            },
            {
                t: "Samagaon to Samdo",
                d: "A short day to keep the altitude gain gentle ahead of the pass.",
                alt: "12,700 ft",
                hrs: "3–4 hrs",
            },
            {
                t: "Samdo to Dharamsala",
                d: "A short positioning day before the pass crossing.",
                alt: "14,800 ft",
                hrs: "3 hrs",
            },
            {
                t: "Cross Larkya La to Bimtang",
                d: "The big day — a high, remote pass crossing with sweeping views on the far side.",
                alt: "17,100 ft (pass)",
                hrs: "8–9 hrs",
            },
            {
                t: "Bimtang to Dharapani",
                d: "A long descent back into forest and the Marsyangdi valley.",
                alt: "6,300 ft",
                hrs: "7 hrs",
            },
            {
                t: "Drive to Kathmandu",
                d: "A full day's drive back to the capital, closing the circuit.",
                alt: "4,600 ft",
                hrs: "Drive, 8 hrs",
            },
        ],
        included: [
            "Kathmandu–Soti Khola and Dharapani–Kathmandu transport",
            "Teahouse/lodge accommodation on trek",
            "All meals during the trek",
            "Licensed guide, porter support, and a required local liaison officer",
            "Manaslu restricted-area permit, MCAP & ACAP fees",
            "First-aid kit",
        ],
        excluded: [
            "International flights",
            "Nepal entry visa",
            "Personal trekking gear",
            "Travel insurance with high-altitude cover",
            "Tips",
        ],
        faqs: [
            {
                q: "Why does this trek need a special permit?",
                a: "The Manaslu region is a restricted area under Nepali law, partly to manage tourism impact near the Tibet border. Permits require trekkers to travel in a group of at least two with a licensed guide.",
            },
            {
                q: "Is it less crowded than Everest Base Camp?",
                a: "Considerably — permit requirements naturally cap numbers, so teahouses are quieter and the trail feels far more remote.",
            },
        ],
    },
    {
        slug: "langtang-valley",
        image: "/images/Langtang valley trek.jpg",
        name: "Langtang Valley Trek",
        region: "langtang",
        regionLabel: "Langtang National Park",
        days: 7,
        grade: "Moderate",
        altitude: "15,660 ft / 4,773 m",
        startPoint: "Kathmandu → Syabrubesi (drive)",
        bestMonths: "Mar–May, Sep–Dec",
        groupSize: "4–16",
        price: "$680",
        overview:
            "The closest major trekking valley to Kathmandu, and one that rebuilt itself with real care after the 2015 earthquake. A shorter, accessible route through Tamang villages and glacier-fed forest, with big mountain views for relatively modest effort.",
        highlights: [
            "Views of Langtang Lirung (7,227m) towering over the valley",
            "Tamang culture and locally run teahouses",
            "Kyanjin Gompa monastery and its cheese factory",
            "A shorter, more accessible itinerary than the major circuits",
        ],
        itinerary: [
            {
                t: "Drive to Syabrubesi",
                d: "A winding mountain drive from Kathmandu sets the tone for the trek ahead.",
                alt: "4,900 ft",
                hrs: "Drive, 7–8 hrs",
            },
            {
                t: "Syabrubesi to Lama Hotel",
                d: "The trail follows the Langtang Khola through dense forest.",
                alt: "8,000 ft",
                hrs: "6 hrs",
            },
            {
                t: "Lama Hotel to Langtang Village",
                d: "The valley opens up, with the first big mountain views of the trip.",
                alt: "11,000 ft",
                hrs: "6 hrs",
            },
            {
                t: "Langtang Village to Kyanjin Gompa",
                d: "A short day ending at the valley's main monastery, with time to explore in the afternoon.",
                alt: "12,600 ft",
                hrs: "3–4 hrs",
            },
            {
                t: "Acclimatization day, Kyanjin Ri side hike",
                d: "An optional climb for sweeping views over the Langtang range.",
                alt: "15,660 ft (peak)",
                hrs: "4–5 hrs",
            },
            {
                t: "Kyanjin Gompa to Lama Hotel",
                d: "Retracing the trail downhill, with fresh legs and clearer heads.",
                alt: "8,000 ft",
                hrs: "6 hrs",
            },
            {
                t: "Lama Hotel to Syabrubesi, drive to Kathmandu",
                d: "A final descent followed by the drive back to the capital.",
                alt: "4,900 ft",
                hrs: "5 hrs trek + drive",
            },
        ],
        included: [
            "Kathmandu–Syabrubesi return transport",
            "Teahouse accommodation on trek",
            "All meals during the trek",
            "Licensed trek guide and porter support",
            "Langtang National Park & TIMS permits",
            "First-aid kit",
        ],
        excluded: [
            "International flights",
            "Nepal entry visa",
            "Personal trekking gear",
            "Travel insurance",
            "Tips",
        ],
        faqs: [
            {
                q: "Is this a good option on a shorter trip to Nepal?",
                a: "Yes — it's one of the most time-efficient ways to get real high-mountain scenery, without the long approach days of the Khumbu or Manaslu routes.",
            },
        ],
    },
    {
        slug: "upper-mustang",
        image: "/images/upper mustang-trek.jpeg",
        name: "Upper Mustang Trek",
        region: "mustang",
        regionLabel: "Mustang District",
        days: 10,
        grade: "Moderate",
        altitude: "13,000 ft / 3,960 m",
        startPoint: "Pokhara → Jomsom (flight)",
        bestMonths: "Jun–Sep (rain-shadow, good in monsoon)",
        groupSize: "2–10",
        price: "$1,650",
        overview:
            "A high-desert trek into the former Kingdom of Lo, walled off from the rest of Nepal by geography and, until 1992, by policy. Sits in the Himalayan rain shadow, which makes it one of the few good monsoon-season treks in the country.",
        highlights: [
            "The walled city of Lo Manthang, former capital of an independent kingdom",
            "Dramatic eroded canyon and cave landscapes",
            "Tibetan Buddhist monasteries with centuries-old murals",
            "Trekkable during monsoon when most other regions are washed out",
        ],
        itinerary: [
            {
                t: "Fly to Jomsom, trek to Kagbeni",
                d: "A short mountain flight followed by an easy walk into the restricted-area gateway village.",
                alt: "9,200 ft",
                hrs: "3 hrs trek",
            },
            {
                t: "Kagbeni to Chele",
                d: "Entering Upper Mustang proper, with the landscape turning to high desert.",
                alt: "10,100 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Chele to Syangboche",
                d: "Crossing two passes through eroded canyon terrain.",
                alt: "11,700 ft",
                hrs: "6 hrs",
            },
            {
                t: "Syangboche to Ghami",
                d: "Wind-carved cliffs and small chorten-lined villages.",
                alt: "11,800 ft",
                hrs: "5 hrs",
            },
            {
                t: "Ghami to Tsarang",
                d: "Passing one of the longest mani walls in Nepal en route to a former royal residence.",
                alt: "11,700 ft",
                hrs: "5 hrs",
            },
            {
                t: "Tsarang to Lo Manthang",
                d: "Arriving at the walled former capital, with the afternoon free to explore.",
                alt: "12,400 ft",
                hrs: "4 hrs",
            },
            {
                t: "Explore Lo Manthang",
                d: "A full day visiting the walled city's monasteries and the old royal palace grounds.",
                alt: "12,400 ft",
                hrs: "Day trip",
            },
            {
                t: "Lo Manthang to Drakmar",
                d: "A different return route past striking red cliff formations.",
                alt: "12,700 ft",
                hrs: "5 hrs",
            },
            {
                t: "Drakmar to Jomsom (via Chuksang)",
                d: "A long return day, often broken with a short jeep transfer on the final stretch.",
                alt: "9,200 ft",
                hrs: "6 hrs + optional jeep",
            },
            {
                t: "Fly to Pokhara",
                d: "A short return flight closes out the trek.",
                alt: "2,700 ft",
                hrs: "20 min flight",
            },
        ],
        included: [
            "Pokhara–Jomsom–Pokhara flights",
            "Teahouse accommodation on trek",
            "All meals during the trek",
            "Licensed trek guide and porter support",
            "Upper Mustang restricted-area permit & ACAP fees",
            "First-aid kit",
        ],
        excluded: [
            "International flights and Kathmandu–Pokhara transport",
            "Nepal entry visa",
            "Personal trekking gear",
            "Travel insurance",
            "Tips",
        ],
        faqs: [
            {
                q: "Why is this trek more expensive than others of similar length?",
                a: "Upper Mustang requires a special restricted-area permit priced per day by the Nepali government, which is a fixed cost regardless of operator.",
            },
            {
                q: "Can this really be trekked in monsoon season?",
                a: "Yes — Upper Mustang sits in the rain shadow of the Annapurna and Dhaulagiri massifs, so it stays largely dry even when the rest of Nepal is in monsoon.",
            },
        ],
    },
    {
        slug: "mardi-himal",
        image: "/images/mardi himal-trek.jpg",
        name: "Mardi Himal Trek",
        region: "annapurna",
        regionLabel: "Annapurna Region, Gandaki Province",
        days: 5,
        grade: "Easy to Moderate",
        altitude: "14,600 ft / 4,500 m",
        startPoint: "Pokhara → Kande (drive)",
        bestMonths: "Mar–May, Sep–Dec",
        groupSize: "4–16",
        price: "$540",
        overview:
            "A short, ridge-line trek to a viewpoint directly beneath Machhapuchhre (Fishtail), one of Nepal's most striking peaks. Less developed than the Poon Hill route, with a genuine sense of quiet even close to Pokhara.",
        highlights: [
            "Close-up views of Machhapuchhre from High Camp",
            "A shorter itinerary that still reaches real altitude",
            "Rhododendron forest in bloom during spring departures",
            "Far fewer trekkers than nearby Poon Hill",
        ],
        itinerary: [
            {
                t: "Drive to Kande, trek to Forest Camp",
                d: "A short drive to the trailhead followed by a steady climb into rhododendron forest.",
                alt: "8,200 ft",
                hrs: "5 hrs",
            },
            {
                t: "Forest Camp to High Camp",
                d: "The trail breaks out of the treeline with growing views of Machhapuchhre.",
                alt: "11,700 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "High Camp to Mardi Himal Viewpoint and back",
                d: "An early start for the best light on the peaks, then a return to High Camp.",
                alt: "14,600 ft (viewpoint)",
                hrs: "5–6 hrs",
            },
            {
                t: "High Camp to Siding village",
                d: "A long descent down the opposite side of the ridge into a quiet Gurung village.",
                alt: "5,200 ft",
                hrs: "6 hrs",
            },
            {
                t: "Drive back to Pokhara",
                d: "A short final trekking stretch followed by a drive back to lakeside Pokhara.",
                alt: "2,700 ft",
                hrs: "2 hrs trek + drive",
            },
        ],
        included: [
            "Pokhara–Kande and Siding–Pokhara transport",
            "Teahouse accommodation on trek",
            "All meals during the trek",
            "Licensed trek guide and porter support",
            "ACAP & TIMS permits",
            "First-aid kit",
        ],
        excluded: [
            "Kathmandu–Pokhara transport",
            "Nepal entry visa",
            "Personal trekking gear",
            "Travel insurance",
            "Tips",
        ],
        faqs: [
            {
                q: "Good for a short trip to Nepal?",
                a: "Yes, this is one of the best options when you only have about a week and still want a genuine high-altitude viewpoint.",
            },
        ],
    },
    {
        slug: "kanchenjunga-base-camp",
        image: "/images/kanchanjunga base-camp.jpg",
        name: "Kanchenjunga Base Camp Trek",
        region: "kanchenjunga",
        regionLabel: "Taplejung District, Far Eastern Nepal",
        days: 18,
        grade: "Challenging",
        altitude: "16,700 ft / 5,090 m",
        startPoint: "Kathmandu → Bhadrapur (flight) → Taplejung (drive)",
        bestMonths: "Mar–May, Sep–Nov",
        groupSize: "2–8",
        price: "$2,150",
        overview:
            "A long, remote expedition-style trek to the base of the world's third-highest mountain, in a far corner of Nepal that sees a fraction of the trekkers of the central regions. Camping-based for long stretches, with full logistical support.",
        highlights: [
            "Reaching the base of Kanchenjunga (8,586m), the world's third-highest peak",
            "Genuinely remote trail with minimal infrastructure",
            "Rich biodiversity inside Kanchenjunga Conservation Area",
            "A full-scale expedition-style itinerary with camp crew support",
        ],
        itinerary: [
            {
                t: "Fly to Bhadrapur, drive to Taplejung",
                d: "A domestic flight followed by a long mountain drive to the trailhead region.",
                alt: "5,700 ft",
                hrs: "Flight + drive",
            },
            {
                t: "Taplejung to Mitlung",
                d: "The trek begins, following the Tamor river valley.",
                alt: "3,000 ft",
                hrs: "4 hrs",
            },
            {
                t: "Mitlung to Chirwa",
                d: "Following river trail deeper into conservation area terrain.",
                alt: "4,000 ft",
                hrs: "6 hrs",
            },
            {
                t: "Chirwa to Sekathum",
                d: "Crossing into denser forest as the trail steepens.",
                alt: "5,200 ft",
                hrs: "6 hrs",
            },
            {
                t: "Sekathum to Amjilosa",
                d: "A steep climb marking the start of the higher approach.",
                alt: "7,500 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Amjilosa to Gyabla",
                d: "Forested trail with occasional glimpses of the peaks ahead.",
                alt: "8,800 ft",
                hrs: "5 hrs",
            },
            {
                t: "Gyabla to Ghunsa",
                d: "A well-established Tibetan-influenced village and a natural rest point.",
                alt: "10,500 ft",
                hrs: "5 hrs",
            },
            {
                t: "Acclimatization day in Ghunsa",
                d: "A short side hike, with the rest of the day for recovery.",
                alt: "10,500 ft",
                hrs: "3 hrs",
            },
            {
                t: "Ghunsa to Khambachen",
                d: "The valley widens, with the first real Kanchenjunga views.",
                alt: "13,800 ft",
                hrs: "5–6 hrs",
            },
            {
                t: "Acclimatization day in Khambachen",
                d: "A second rest day, essential this high before continuing.",
                alt: "13,800 ft",
                hrs: "2–3 hrs",
            },
            {
                t: "Khambachen to Lhonak",
                d: "Crossing glacial terrain toward the final approach.",
                alt: "16,000 ft",
                hrs: "5 hrs",
            },
            {
                t: "Lhonak to Kanchenjunga North Base Camp and back",
                d: "The main event — reaching base camp views before returning to sleep at lower altitude.",
                alt: "16,700 ft (base camp)",
                hrs: "7–8 hrs",
            },
            {
                t: "Lhonak to Ghunsa",
                d: "A long descent back through familiar villages.",
                alt: "10,500 ft",
                hrs: "7 hrs",
            },
            {
                t: "Ghunsa to Sekathum",
                d: "Retracing the approach trail downhill.",
                alt: "5,200 ft",
                hrs: "7 hrs",
            },
            {
                t: "Sekathum to Chirwa",
                d: "Continuing the descent along the Tamor valley.",
                alt: "4,000 ft",
                hrs: "6 hrs",
            },
            {
                t: "Chirwa to Taplejung",
                d: "The final trekking day, closing the loop.",
                alt: "5,700 ft",
                hrs: "6 hrs",
            },
            {
                t: "Drive to Bhadrapur",
                d: "A long drive back toward the flight connection to Kathmandu.",
                alt: "300 ft",
                hrs: "Drive, full day",
            },
            {
                t: "Fly to Kathmandu",
                d: "A domestic flight completes the return journey.",
                alt: "4,600 ft",
                hrs: "1 hr flight",
            },
        ],
        included: [
            "Bhadrapur flights and all ground transport",
            "Camping equipment and full crew (cook, kitchen staff, porters) for remote sections",
            "All meals during the trek",
            "Licensed guide and required liaison arrangements",
            "Kanchenjunga Conservation Area & restricted-area permits",
            "First-aid kit and emergency communication device",
        ],
        excluded: [
            "International flights",
            "Nepal entry visa",
            "Personal trekking and camping gear",
            "Travel insurance with high-altitude and evacuation cover",
            "Tips",
        ],
        faqs: [
            {
                q: "Is this trek suitable for a first Himalayan trip?",
                a: "No — we recommend this only for trekkers with prior high-altitude multi-day trekking experience, given the remoteness and length of the itinerary.",
            },
            {
                q: "Why camping instead of teahouses for part of the route?",
                a: "Infrastructure in the far eastern approach is limited, so we bring a full camp crew to guarantee food and shelter quality on the more remote stretches.",
            },
        ],
    },
    ...khumbuAnnapurnaTreks,
    ...moreTreks,
];

// Merge each trek's own FAQs with the shared good-to-know questions so every
// detail page's "Good to Know" section shows around 8–10 questions.
export const treks: Trek[] = rawTreks.map((trek) => ({
    ...trek,
    faqs: mergeFaqs(trek.faqs, generalFaqs),
}));

export const trekList = treks.map((trek) => ({ ...trek }));

export function getTrek(slug: string): Trek | undefined {
    return treks.find((trek) => trek.slug === slug);
}
