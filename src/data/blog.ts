export interface BlogPost {
    slug: string;
    title: string;
    category: string;
    excerpt: string;
    date: string;
    read: string;
    href: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: "best-time-to-trek-nepal",
        title: "The Best Time to Trek in Nepal, Month by Month",
        category: "Planning",
        excerpt:
            "Spring or autumn? When the rhododendrons bloom versus the clearest mountain air — and the months we quietly steer first-timers away from.",
        date: "May 28, 2026",
        read: "6 min read",
        href: "/blog",
    },
    {
        slug: "everest-base-camp-on-foot",
        title: "Everest Base Camp on Foot: What the Lukla Flight Really Buys You",
        category: "Everest",
        excerpt:
            "Thirteen days on the trail, two acclimatization days and one pre-dawn climb to Kala Patthar — how the classic route actually unfolds.",
        date: "May 12, 2026",
        read: "8 min read",
        href: "/treks/everest-base-camp",
    },
    {
        slug: "annapurna-circuit-vs-langtang",
        title: "Annapurna Circuit or Langtang? Choosing a First Nepal Trek",
        category: "Compare",
        excerpt:
            "Two very different first routes — one a high mountain pass, the other a valley full of Tamang and Sherpa culture. We break down the trade-offs.",
        date: "April 30, 2026",
        read: "7 min read",
        href: "/treks/annapurna-circuit",
    },
    {
        slug: "teahouse-etiquette",
        title: "Teahouse Etiquette: 9 Things Every First-Time Trekker Should Know",
        category: "Culture",
        excerpt:
            "From taking your boots off at the door to why the menu is the same everywhere — the unwritten rules that make a teahouse stay work.",
        date: "April 15, 2026",
        read: "5 min read",
        href: "/blog",
    },
    {
        slug: "packing-list-2026",
        title: "The 2026 Nepal Trekking Packing List",
        category: "Gear",
        excerpt:
            "Everything we tell our guests to bring — and the handful of things that should stay home. Built from fifteen seasons of what actually gets used.",
        date: "March 22, 2026",
        read: "9 min read",
        href: "/blog",
    },
    {
        slug: "altitude-sickness-guide",
        title: "Altitude Sickness: Prevention, Symptoms and What to Do",
        category: "Safety",
        excerpt:
            "The most important chapter in any trekker's preparation — how acclimatization works, the warning signs, and when to turn around.",
        date: "March 4, 2026",
        read: "10 min read",
        href: "/blog",
    },
];
