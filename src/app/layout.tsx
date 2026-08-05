import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import RevealProvider from "@/components/RevealProvider";

export const metadata: Metadata = {
    title: {
        default: "Trekking Nepal — Himalayan Trekking Company",
        template: "%s — Trekking Nepal",
    },
    description:
        "A Kathmandu-based trekking company running fixed-departure and custom treks exclusively inside Nepal since 2013. Everest, Annapurna, Manaslu, Langtang, Mustang and Kanchenjunga.",
    keywords: [
        "Nepal trekking",
        "Everest Base Camp",
        "Annapurna",
        "Manaslu",
        "Langtang",
        "Mustang",
        "Kanchenjunga",
        "Himalaya",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <a href="#main" className="skip-link">
                    Skip to content
                </a>
                <Header />
                <main id="main">
                    {children}
                </main>
                <Footer />
                <ChatBot />
                <RevealProvider />
                <noscript>
                    <style>{`.reveal{opacity:1;transform:none}`}</style>
                </noscript>
            </body>
        </html>
    );
}
