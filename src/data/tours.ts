export type Tour = {
  slug: string;
  title: string;
  days: number;
  price: number;
  summary: string;
  details: string;
  image?: string;
  difficulty?: "Easy" | "Moderate" | "Hard";
  maxAltitude?: number; // meters
  meetingPoint?: string;
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: string[]; // day by day
};

export const tours: Tour[] = [
  {
    slug: "everest-base-camp",
    title: "Everest Base Camp",
    days: 14,
    price: 1499,
    summary: "Iconic trek to the base of Everest with full support and experienced guides.",
    details:
      "This classic trek takes you through Sherpa villages, monasteries and spectacular mountain scenery to Everest Base Camp. Accommodation in teahouses, experienced local guides, and airport transfers included.",
    image: "/file.svg",
    difficulty: "Hard",
    maxAltitude: 5364,
    meetingPoint: "Kathmandu (Tribhuvan International Airport)",
    inclusions: [
      "Airport transfers",
      "Experienced English-speaking guide",
      "Teahouse accommodation",
      "All breakfasts and some lunches",
      "Permits and TIMS card",
    ],
    exclusions: ["International flights", "Lunches on some days", "Personal equipment rental"],
    itinerary: [
      "Day 1: Arrival Kathmandu, group meeting and briefing",
      "Day 2: Fly to Lukla, trek to Phakding",
      "Day 3: Trek to Namche Bazaar (acclimatization)",
      "Day 4: Acclimatization day in Namche Bazaar",
      "Day 5: Trek to Tengboche",
      "Day 6: Trek to Dingboche",
      "Day 7: Acclimatization in Dingboche",
      "Day 8: Trek to Lobuche",
      "Day 9: Trek to Everest Base Camp, return to Gorak Shep",
      "Day 10: Hike Kala Patthar, fly back to Lukla and return to Kathmandu",
      "Day 11-14: Buffer days / travel extension options",
    ],
  },
  {
    slug: "annapurna-circuit",
    title: "Annapurna Circuit",
    days: 12,
    price: 1299,
    summary: "Diverse landscapes and cultural highlights on the Annapurna Circuit.",
    details:
      "The Annapurna Circuit offers varied terrain from subtropical to high alpine. Enjoy hot springs, panoramic passes, and rich local culture. Teahouse stays and experienced guides provided.",
    image: "/file.svg",
    difficulty: "Moderate",
    maxAltitude: 5416,
    meetingPoint: "Kathmandu",
    inclusions: ["Guide and porter service", "Teahouse accommodation", "All breakfasts", "Transport to trailhead"],
    exclusions: ["Travel insurance", "Lunches and dinners", "Tips"],
    itinerary: [
      "Day 1: Drive to Besishahar and trek to Bahundanda",
      "Day 2: Trek to Chamje",
      "Day 3: Trek to Bagarchhap",
      "Day 4: Trek to Chame",
      "Day 5: Trek to Pisang",
      "Day 6: Trek to Manang (acclimatization)",
      "Day 7: Acclimatization day in Manang",
      "Day 8: Trek to Thorung Phedi",
      "Day 9: Cross Thorung La pass and descend to Muktinath",
      "Day 10: Trek to Jomsom",
      "Day 11: Fly/drive to Pokhara",
      "Day 12: Return to Kathmandu",
    ],
  },
  {
    slug: "langtang-valley",
    title: "Langtang Valley",
    days: 7,
    price: 699,
    summary: "Shorter trek near Kathmandu; ideal for a quick mountain escape.",
    details:
      "Langtang Valley is perfect for those short on time but eager to experience Himalayan scenery. Rich rhododendron forests and friendly local villages make this a memorable trip.",
    image: "/file.svg",
    difficulty: "Moderate",
    maxAltitude: 3870,
    meetingPoint: "Kathmandu",
    inclusions: ["Guide", "Teahouse stay", "Breakfasts"],
    exclusions: ["Permits (if required)", "Lunches and dinners"],
    itinerary: [
      "Day 1: Drive to Syabrubesi and trek to Lama Hotel",
      "Day 2: Trek to Langtang Village",
      "Day 3: Trek to Kyanjing Gompa",
      "Day 4: Day hike to Tserko Ri (optional)",
      "Day 5: Return towards Lama Hotel",
      "Day 6: Trek back to Syabrubesi",
      "Day 7: Drive to Kathmandu",
    ],
  },
  {
    slug: "panchase-loop",
    title: "Poon Hill & Panchase Loop",
    days: 5,
    price: 499,
    summary: "Short and scenic trek for sunrise views over Annapurna range.",
    details: "Great for shorter holidays, cultural villages and panoramic sunrise at Poon Hill.",
    image: "/file.svg",
    difficulty: "Easy",
    maxAltitude: 3210,
    meetingPoint: "Pokhara",
    inclusions: ["Guide", "Teahouse accommodation", "Breakfasts"],
    exclusions: ["Travel to Pokhara", "Meals not listed"],
    itinerary: [
      "Day 1: Drive to Ulleri and trek to Ghorepani",
      "Day 2: Sunrise at Poon Hill, trek to Tadapani",
      "Day 3: Trek to Ghandruk",
      "Day 4: Trek to Nayapul, drive to Pokhara",
      "Day 5: Leisure day in Pokhara / departure",
    ],
  },
  {
    slug: "upper-mustang",
    title: "Upper Mustang (Lo Manthang)",
    days: 10,
    price: 1999,
    summary: "A unique desert-like landscape with ancient Tibetan-influenced culture.",
    details: "Requires a special permit; experience arid canyons, ancient caves and the walled city of Lo Manthang.",
    image: "/file.svg",
    difficulty: "Moderate",
    maxAltitude: 3950,
    meetingPoint: "Kathmandu",
    inclusions: ["Permit processing", "Guide and crew", "Accommodation as listed"],
    exclusions: ["International flights", "Insurance"],
    itinerary: [
      "Day 1: Fly to Jomsom and drive to Kagbeni",
      "Day 2: Trek to Chele",
      "Day 3: Trek to Syangboche",
      "Day 4: Trek to Lo Manthang",
      "Day 5-7: Explore Lo Manthang and nearby areas",
      "Day 8: Trek back towards Kagbeni",
      "Day 9: Drive to Jomsom",
      "Day 10: Fly to Pokhara/Kathmandu",
    ],
  },
];
