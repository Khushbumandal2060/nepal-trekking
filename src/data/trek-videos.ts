import type { Region, Trek } from "@/lib/types";

// ---------------------------------------------------------------------
// YouTube videos for trek detail pages.
//
// Every trek gets a well-known video for its region as a placeholder.
// To show a trek-specific video, set `video` on that trek's object and it
// overrides the region default. All IDs below were pulled from live
// YouTube search results, so the embeds resolve to real, playable videos.
// ---------------------------------------------------------------------

export const REGION_VIDEOS: Record<Region, string> = {
    khumbu: "wsutzqbRIJM", // Everest Base Camp Trek – full documentary (Magical Nepal)
    annapurna: "wb3iL15Tbv4", // Hiking 100 Miles Through the Himalayas (Annapurna Circuit)
    manaslu: "7PL5zb6GxmI", // Hiking 100 Miles – Manaslu Circuit
    langtang: "iTKYXcso2Mo", // Langtang Valley Trek – ambient hiking film
    mustang: "vTtqft4N5mU", // A Journey to the Edge of Tibet – Upper Mustang Trek
    kanchenjunga: "CnmlWmGM750", // Hiking 200km – Kanchenjunga Base Camp
    dolpo: "hdlLrK7ndTY", // Into Wild Dolpo – Nepal's Hidden Tibet
    makalu: "WnNl75FOby0", // Makalu Base Camp Trek – Hidden Adventure of Eastern Nepal
    dhaulagiri: "O2BiCCYv-Rw", // Dhaulagiri Circuit – Nepal's Wildest Trek (full documentary)
    karnali: "nQmQ9St8cL8", // Rara Lake – Most Beautiful Lake in Nepal
    ganesh: "TSEbSypG_JQ", // Ganesh Himal Trek, Nepal
};

/** YouTube video ID for a trek: the trek's own `video` wins, otherwise its region's placeholder. */
export function trekVideo(t: Trek): string | undefined {
    return t.video ?? REGION_VIDEOS[t.region];
}
